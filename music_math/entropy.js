class FFT {
    constructor(size) {
        this.size = size;
        this.real = new Float32Array(size);
        this.imag = new Float32Array(size);
    }
    forward(input) {
        const n = this.size;
        this.real.set(input);
        this.imag.fill(0);
        this._transform(this.real, this.imag, n, 1);
    }
    inverse() {
        const n = this.size;
        this._transform(this.real, this.imag, n, -1);
        for (let i = 0; i < n; i++) {
            this.real[i] /= n;
            this.imag[i] /= n;
        }
        return Array.from(this.real);
    }
    _transform(real, imag, n, direction) {
        const nn = n === 1 ? 0 : Math.log2(n);
        if (Math.pow(2, nn) !== n) throw "Размер должен быть степенью двойки";
        for (let i = 0; i < n; i++) {
            const j = this._reverseBits(i, nn);
            if (j > i) {
                [real[i], real[j]] = [real[j], real[i]];
                [imag[i], imag[j]] = [imag[j], imag[i]];
            }
        }
        for (let s = 1; s <= nn; s++) {
            const m = 1 << s;
            const mh = m >> 1;
            for (let k = 0; k < n; k += m) {
                for (let j = 0; j < mh; j++) {
                    const kr = k + j;
                    const ki = kr + mh;
                    const theta = direction * (-2 * Math.PI * j / m);
                    const wr = Math.cos(theta);
                    const wi = Math.sin(theta);
                    const tr = real[ki] * wr - imag[ki] * wi;
                    const ti = real[ki] * wi + imag[ki] * wr;
                    real[ki] = real[kr] - tr;
                    imag[ki] = imag[kr] - ti;
                    real[kr] += tr;
                    imag[kr] += ti;
                }
            }
        }
    }
    _reverseBits(x, bits) {
        let y = 0;
        for (let i = 0; i < bits; i++) {
            y = (y << 1) | (x & 1);
            x >>= 1;
        }
        return y;
    }
}


/* =================================
 КЛАССЫ ДЛЯ ГРАФИКА HE
================================= */
class HarmonicEntropyCalculator {
    static instance = null;
    constructor() {
        if (HarmonicEntropyCalculator.instance) {
            return HarmonicEntropyCalculator.instance;
        }
        this.ratios = [];
        this.oldN = null;
        HarmonicEntropyCalculator.instance = this;
    }
    filterRatios() {
        const tolerance = 10;
        let ratioObjs = this.ratios.map(ratio => {
            const [p, q] = ratio;
            const cent = 1200 * HarmonicEntropyCalculator.log2(p / q);
            const consonance = (1 / p) + (1 / q);
            return {
                p,
                q,
                cent,
                consonance
            };
        });
        ratioObjs.sort((a, b) => b.consonance - a.consonance);
        const selected = [];
        for (const r of ratioObjs) {
            if (!selected.some(s => Math.abs(s.cent - r.cent) < tolerance)) {
                selected.push(r);
            }
        }
        selected.sort((a, b) => a.cent - b.cent);
        this.ratios = selected.map(r => [r.p, r.q]);
    }
    findLocalMinima(HE, threshold = 0.005) {
        const maxima = [];
        for (let i = 6; i < HE.length - 6; i++) {
            const dyPrev = HE[i].y - HE[i - 6].y;
            const dyNext = HE[i + 6].y - HE[i].y;
            if (dyPrev > threshold && dyNext < -threshold) {
                maxima.push({
                    x: HE[i].x,
                    y: HE[i].y,
                    strength: Math.abs(dyPrev) + Math.abs(dyNext)
                });
            }
        }
        return maxima.sort((a, b) => b.strength - a.strength);
    }
    findClosestHEPoint(HE, cent) {
        let low = 0,
            high = HE.length - 1,
            mid;
        while (low <= high) {
            mid = Math.floor((low + high) / 2);
            if (HE[mid].x < cent) {
                low = mid + 1;
            } else if (HE[mid].x > cent) {
                high = mid - 1;
            } else {
                return HE[mid];
            }
        }
        if (high < 0) return HE[0];
        if (low >= HE.length) return HE[HE.length - 1];
        return (Math.abs(HE[low].x - cent) < Math.abs(HE[high].x - cent)) ? HE[low] : HE[high];
    }
    findRatiosAtMinima(HE, minima) {
        const minimaXSet = new Set(minima.map(m => m.x));
        const ratiosToDisplay = [];
        for (const [p, q] of this.ratios) {
            const cent = 1200 * HarmonicEntropyCalculator.log2(p / q);
            const closestPoint = this.findClosestHEPoint(HE, cent);
            if (minimaXSet.has(closestPoint.x)) {
                ratiosToDisplay.push({
                    x: cent,
                    y: closestPoint.y,
                    label: `${p}/${q}`
                });
            }
        }
        return ratiosToDisplay;
    }
    static log2(x) {
        return Math.log(x) / Math.log(2);
    }
    static gcd(x, y) {
        while (y !== 0) {
            [x, y] = [y, x % y];
        }
        return x;
    }
    convolve(olda, oldb) {
        const a = [...olda],
            b = [...oldb];
        const len = a.length;
        let minlen = 1;
        while (minlen < len) minlen *= 2;
        a.push(...new Array(minlen - len).fill(0));
        b.push(...new Array(minlen - len).fill(0));
        const f_a = new FFT(minlen),
            f_b = new FFT(minlen);
        f_a.forward(a);
        f_b.forward(b);
        const real = new Array(minlen),
            imag = new Array(minlen);
        for (let i = 0; i < minlen; i++) {
            real[i] = f_a.real[i] * f_b.real[i] - f_a.imag[i] * f_b.imag[i];
            imag[i] = f_a.real[i] * f_b.imag[i] + f_a.imag[i] * f_b.real[i];
        }
        const f_out = new FFT(minlen);
        f_out.real = real;
        f_out.imag = imag;
        const result = f_out.inverse();
        return result.slice(0, len);
    }
    calculateHarmonicEntropy(HEinfo) {
        const {
            a,
            s,
            mincents,
            maxcents
        } = HEinfo;
        const scents = 1200 * HarmonicEntropyCalculator.log2(s + 1);
        const padding = Math.round(3 * scents);
        const min = mincents - padding;
        const max = maxcents + padding;
        const res = 1;
        const alpha = a === 1 ? 1.001 : a;
        const arraySize = Math.floor((max - min) / res) + 1;
        if (arraySize > 1000000) {
            console.error("Array size too large, aborting calculation");
            return [];
        }
        const k = new Array(arraySize).fill(0);
        const ak = new Array(arraySize).fill(0);
        for (const ratio of this.ratios) {
            const rcent = 1200 * HarmonicEntropyCalculator.log2(ratio[0] / ratio[1]);
            if (rcent < min || rcent > max) continue;
            const rcompl = Math.sqrt(ratio[0] * ratio[1]);
            if (rcent === Math.round(rcent)) {
                const index = Math.floor((rcent - min) / res);
                k[index] += 1 / rcompl;
                ak[index] += 1 / Math.pow(rcompl, alpha);
            } else {
                const clow = Math.ceil(rcent) - rcent;
                const chigh = rcent - Math.floor(rcent);
                const index = Math.floor((rcent - min) / res);
                k[index] += (1 / rcompl) * clow;
                k[index + 1] += (1 / rcompl) * chigh;
                ak[index] += (1 / Math.pow(rcompl, alpha)) * clow;
                ak[index + 1] += (1 / Math.pow(rcompl, alpha)) * chigh;
            }
        }
        let minlen = 1;
        while (minlen < 2 * k.length) minlen *= 2;
        k.push(...new Array(minlen - k.length).fill(0));
        ak.push(...new Array(minlen - ak.length).fill(0));
        const g = new Array(minlen),
            ag = new Array(minlen);
        let g_sum = 0;
        for (let i = 0; i < minlen; i++) {
            const c = i * res + min;
            const gval = (1 / (scents * 2 * Math.PI)) * (
                Math.exp(-((c - min) ** 2) / (2 * scents * scents)) +
                Math.exp(-((c - (minlen * res + min)) ** 2) / (2 * scents * scents))
            );
            g[i] = gval;
            g_sum += gval;
        }
        for (let i = 0; i < g.length; i++) {
            g[i] /= g_sum;
            ag[i] = Math.pow(g[i], alpha);
        }
        const ent = this.convolve(ak, ag);
        const nrm = this.convolve(k, g);
        const paddingPoints = padding / res;
        const result = [];
        const epsilon = 1e-10;
        for (let i = arraySize - paddingPoints - 1; i >= paddingPoints; i--) {
            const x = i * res + min;
            const entVal = ent[i] + epsilon;
            const nrmVal = nrm[i] + epsilon;
            const y = (1 / (1 - alpha)) * Math.log(entVal / Math.pow(nrmVal, alpha));
            result[i - paddingPoints] = {
                x: x,
                y: -y
            };
        }
        HEinfo.res = 1;
        return result;
    }
    preCalcRatios(HEinfo) {
        return new Promise((resolve) => {
            if (HEinfo.N !== this.oldN) {
                this.ratios = [];
                this.oldN = HEinfo.N;
                let n = HEinfo.N;
                const processRatios = () => {
                    if (n > 0) {
                        const start = performance.now();
                        do {
                            for (let i = 1; i <= Math.floor(Math.sqrt(n)); i++) {
                                if (n % i === 0 && HarmonicEntropyCalculator.gcd(i, n / i) === 1) {
                                    this.ratios.push([i, n / i]);
                                    if (n / i !== i) this.ratios.push([n / i, i]);
                                }
                            }
                        } while (--n >= 0 && performance.now() - start < 50);
                        requestAnimationFrame(processRatios);
                    } else {
                        this.filterRatios();
                        resolve(); // Вычисления завершены
                    }
                };
                setTimeout(processRatios, 25);
            } else {
                resolve(); // N не изменился, ratios уже готов
            }
        });
    }
}