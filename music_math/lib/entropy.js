/**
 * UNIFIED HARMONIC ENTROPY 2.0
 * Обобщает алгоритм вычисления гармонической энтропии (P. Erlich)
 * и взвешенных метрик консонанса (Euler, Murzin, и др.) через FFT.
 * 
 * Заменяет собой HarmonicEntropyCalculator и ConsonanceWeightedHE.
 */

// ------------------ FFT (Standard implementation) ------------------
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
        return this.real; // Возвращаем TypedArray для скорости
    }
    _transform(real, imag, n, direction) {
        const nn = n === 1 ? 0 : Math.log2(n);
        if (Math.pow(2, nn) !== n) throw new Error("FFT Size must be power of 2");
        
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
            const thetaBase = direction * (-2 * Math.PI / m);
            
            for (let k = 0; k < n; k += m) {
                for (let j = 0; j < mh; j++) {
                    const kr = k + j;
                    const ki = kr + mh;
                    const theta = thetaBase * j;
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

// ------------------ UnifiedEntropyCalculator ------------------
class UnifiedEntropyCalculator {
    constructor() {
        this.ratios = []; // Хранит { p, q, w, cent }
        this.cacheKey = ""; 
    }

    /**
     * Генерация списка дробей и их весов.
     * @param {number} N - Лимит сложности (для HE: p*q <= N).
     * @param {string} method - 'he-classic', 'murzin', 'euler', etc.
     * @param {number} beta - Степенной коэффициент для весов (1.0 = стандарт).
     */
    async generateRatios({ N = 3000, method = 'he-classic', beta = 1.0 }) {
        const currentKey = `${N}-${method}-${beta}`;
        if (this.cacheKey === currentKey && this.ratios.length > 0) return;

        this.ratios = [];
        this.cacheKey = currentKey;

        // All consonance methods are now in ji-lib.js
        const baseWeightFn = (p, q) => jiLib.computeConsonance(p, q, method);
        const weightFn = (p, q) => {
            const w = baseWeightFn(p, q);
            return (beta === 1.0) ? w : Math.pow(w, beta);
        };

        return new Promise((resolve) => {
            // Асинхронная генерация чанками, чтобы не фризить UI
            let nIter = N;
            const processChunk = () => {
                const start = performance.now();
                while (nIter > 0 && performance.now() - start < 15) {
                    // Генерируем по Farey sequence logic (p*q <= N) для равномерного распределения энтропии
                    const maxI = Math.floor(Math.sqrt(nIter));
                    for (let i = 1; i <= maxI; i++) {
                        if (nIter % i === 0) {
                            const p = i;
                            const q = nIter / i;
                            if (jiLib.gcd(p, q) === 1) {
                                this._addRatio(p, q, weightFn);
                                if (p !== q) this._addRatio(q, p, weightFn);
                            }
                        }
                    }
                    nIter--;
                }

                if (nIter > 0) {
                    setTimeout(processChunk, 0);
                } else {
                    this.ratios.sort((a, b) => a.cent - b.cent);
                    resolve();
                }
            };
            processChunk();
        });
    }

    _addRatio(p, q, weightFn) {
        const w = weightFn(p, q);
        if (w < 1e-12) return;
        const ratioVal = p / q;
        const cent = 1200 * Math.log2(ratioVal);
        this.ratios.push({ p, q, w, cent });
    }

    convolve(inputA, inputB) {
        const lenA = inputA.length;
        const lenB = inputB.length;
        const outLen = lenA + lenB - 1;
        let minlen = 1;
        while (minlen < outLen) minlen *= 2;

        const A = new Float32Array(minlen);
        const B = new Float32Array(minlen);
        A.set(inputA);
        B.set(inputB);

        const fftA = new FFT(minlen);
        const fftB = new FFT(minlen);
        fftA.forward(A);
        fftB.forward(B);

        const real = new Float32Array(minlen);
        const imag = new Float32Array(minlen);
        for (let i = 0; i < minlen; i++) {
            real[i] = fftA.real[i] * fftB.real[i] - fftA.imag[i] * fftB.imag[i];
            imag[i] = fftA.real[i] * fftB.imag[i] + fftA.imag[i] * fftB.real[i];
        }

        const fftOut = new FFT(minlen);
        fftOut.real = real;
        fftOut.imag = imag;
        
        return fftOut.inverse();
    }

    /**
     * Основной расчет кривой
     * @param {Object} params - { mincents, maxcents, s, a, res }
     * s - ширина сглаживания в центах (или % от полутона, см. логику ниже)
     * a - коэффициент Реньи
     */
    calculateCurve({ mincents = 0, maxcents = 1200, s = 1.25, a = 2, res = 1 }) {
        if (this.ratios.length === 0) return [];

        // Логика конвертации s (из UI приходит 0.5...2.5) в центы
        // Если s ~ 1.0, считаем это % от 100 центов (как было в CWHE слайдере) -> 10 центов
        const sigmaCents = s * 10; 
        
        const padding = Math.ceil(4 * sigmaCents);
        const gridMin = mincents - padding;
        const gridMax = maxcents + padding;
        const size = Math.floor((gridMax - gridMin) / res) + 1;
        
        const K = new Float32Array(size).fill(0);
        const AK = new Float32Array(size).fill(0);

        // Биннинг весов
        for (const r of this.ratios) {
            if (r.cent < gridMin || r.cent > gridMax) continue;
            // Линейная интерполяция
            const exactIdx = (r.cent - gridMin) / res;
            const idx = Math.floor(exactIdx);
            const frac = exactIdx - idx;
            
            if (idx >= 0 && idx < size - 1) {
                const w = r.w;
                const wa = Math.pow(w, a);
                K[idx] += w * (1 - frac);
                K[idx + 1] += w * frac;
                AK[idx] += wa * (1 - frac);
                AK[idx + 1] += wa * frac;
            }
        }

        // Ядро Гаусса
        const kernelRadius = Math.ceil(4 * sigmaCents / res);
        const kernelSize = kernelRadius * 2 + 1;
        const G = new Float32Array(kernelSize);
        const twoSigmaSq = 2 * sigmaCents * sigmaCents;
        const normFactor = 1 / (sigmaCents * Math.sqrt(2 * Math.PI));
        
        let gSum = 0;
        for (let i = 0; i < kernelSize; i++) {
            const dist = (i - kernelRadius) * res;
            const val = normFactor * Math.exp(-(dist * dist) / twoSigmaSq);
            G[i] = val;
            gSum += val;
        }
        const AG = new Float32Array(kernelSize);
        for (let i = 0; i < kernelSize; i++) {
            G[i] /= gSum;
            AG[i] = Math.pow(G[i], a);
        }

        // Свертка
        const entRaw = this.convolve(AK, AG);
        const nrmRaw = this.convolve(K, G);

        const result = [];
        // Индекс начала данных (компенсация паддинга и радиуса ядра)
        // Сетка начиналась с gridMin (mincents - padding).
        // Свертка сдвигает на kernelRadius.
        // Нам нужны данные начиная с mincents.
        const offset = Math.floor((mincents - gridMin) / res) + kernelRadius;
        
        const plotPoints = Math.floor((maxcents - mincents) / res);
        const epsilon = 1e-15;

        for (let i = 0; i <= plotPoints; i++) {
            const arrIdx = offset + i;
            if (arrIdx < 0 || arrIdx >= entRaw.length) {
                result.push({ x: mincents + i * res, y: 0 });
                continue;
            }

            const entVal = entRaw[arrIdx] + epsilon;
            const nrmVal = nrmRaw[arrIdx] + epsilon;
            // Формула Реньи
            const y = (1 / (1 - a)) * Math.log(entVal / Math.pow(nrmVal, a));
            
            result.push({ x: mincents + i * res, y: y });
        }

        return result;
    }

    /**
     * Поиск минимумов (консонансов)
     */
    findExtrema(curveData, threshold = 0.001) {
        const points = [];
        const w = 5;
        for (let i = w; i < curveData.length - w; i++) {
            const cy = curveData[i].y;
            // Локальный минимум
            if (cy < curveData[i-1].y && cy < curveData[i+1].y) {
                // Проверка "выраженности" минимума
                const leftDiff = curveData[i-w].y - cy;
                const rightDiff = curveData[i+w].y - cy;
                if (leftDiff > threshold && rightDiff > threshold) {
                    points.push({ x: curveData[i].x, y: cy });
                }
            }
        }
        return points.sort((a, b) => a.y - b.y);
    }

    annotateExtrema(extrema, tolerance = 15) {
        const anns = [];
        for (const ex of extrema) {
            // Ищем дробь
            let bestR = null;
            let maxW = -1;
            
            // Оптимизация: бинарный поиск или просто фильтр, если массив большой
            // Для 3000-10000 элементов простой фильтр приемлем
            for (const r of this.ratios) {
                if (Math.abs(r.cent - ex.x) < tolerance) {
                    if (r.w > maxW) {
                        maxW = r.w;
                        bestR = r;
                    }
                }
            }
            if (bestR) {
                anns.push({
                    x: ex.x,
                    y: ex.y,
                    label: `${bestR.p}/${bestR.q}`
                });
            }
        }
        return anns;
    }
}

// Экспорт для браузера
window.UnifiedEntropyCalculator = UnifiedEntropyCalculator;
window.FFT = FFT;