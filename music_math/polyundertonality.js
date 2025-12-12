/**
 * polyundertonality.js v0.98
 * Corrected port from Julia. Stores absolute ratios, transforms on display.
 * Depends on: ji-lib.js (global.jiLib, global.Methods)
 */

(function(global) {
    'use strict';

    if (typeof jiLib === 'undefined') {
        throw new Error("polyundertonality.js requires ji-lib.js");
    }

    // ============================================
    // MATH UTILITIES
    // ============================================
    
    const Utils = {
        gcd(a, b) { return jiLib.gcd(a, b); },

        lcm(a, b) {
            if (a === 0 || b === 0) return 0;
            const g = this.gcd(Math.abs(a), Math.abs(b));
            // Correct LCM: |a*b|/gcd = |a|/gcd * |b|
            return Math.abs(a / g) * Math.abs(b);
        },

        arrayLcm(arr) {
            if (arr.length === 0) return 1;
            let res = arr[0];
            for (let i = 1; i < arr.length; i++) {
                res = this.lcm(res, arr[i]);
                if (res > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER;
            }
            return res;
        },

        // odd_part(n) = n >> trailing_zeros(n)
        oddPart(n) {
            n = Math.abs(Math.round(n));
            if (n === 0) return 0;
            while ((n & 1) === 0) n >>>= 1;
            return n;
        },

        // complex_euler(n) = 1 + sum(e*(p-1) for (p,e) in factor(odd_part(n)))
        complexEuler(n) {
            n = this.oddPart(n);
            if (n <= 1) return 1;
            const factors = jiLib.primeFactors(n);
            let sum = 0;
            for (const pStr in factors) {
                sum += factors[pStr] * (Number(pStr) - 1);
            }
            return 1 + sum;
        },

        // --- RATIO OPERATIONS (integer-preserving) ---
        
        create(num, den) {
            num = Math.round(num);
            den = Math.round(den);
            if (den === 0) return { num: 1, den: 1 };
            const g = this.gcd(Math.abs(num), Math.abs(den));
            const sign = (num * den < 0) ? -1 : 1;
            return { 
                num: sign * Math.abs(Math.round(num / g)), 
                den: Math.abs(Math.round(den / g)) 
            };
        },
        
        // normalize(x) = x * (1//2)^floor(log2(x)) → brings to [1, 2)
        // Uses integer multiplication to preserve exact fractions
        normalize(r) {
            let num = r.num;
            let den = r.den;
            if (num <= 0 || den <= 0) return this.create(1, 1);
            
            // Scale up: multiply num by 2 until num/den >= 1
            while (num < den) { num *= 2; }
            // Scale down: multiply den by 2 until num/den < 2
            while (num >= 2 * den) { den *= 2; }
            
            return this.create(num, den);
        },

        mul(a, b) { return this.create(a.num * b.num, a.den * b.den); },
        div(a, b) { return this.create(a.num * b.den, a.den * b.num); },
        
        // gcd(a/b, c/d) = gcd(a,c) / lcm(b,d)
        fractionGcd(r1, r2) {
            const num = this.gcd(r1.num, r2.num);
            const den = this.lcm(r1.den, r2.den);
            return this.create(num, den);
        },

        toDecimal(r) { return r.num / r.den; }
    };

    // ============================================
    // CORE LOGIC
    // ============================================

    const Logic = {
        
        // system_depth = lcm of odd_part(denominator) for all notes
        systemDepth(scales) {
            const denoms = new Set();
            for (const s of scales) {
                for (const r of s.scale) {
                    denoms.add(Utils.oddPart(r.den));
                }
            }
            if (denoms.size === 0) return 1;
            return Utils.arrayLcm(Array.from(denoms));
        },

        // system_root = reduce(gcd, (odd_rational(n) for all notes))
        // odd_rational(r) = odd_part(num) // odd_part(den)
        getSystemRoot(system) {
            if (!system || system.length === 0) return Utils.create(1, 1);
            
            let allOddNotes = [];
            for (const s of system) {
                for (const r of s.scale) {
                    allOddNotes.push(Utils.create(
                        Utils.oddPart(r.num),
                        Utils.oddPart(r.den)
                    ));
                }
            }

            if (allOddNotes.length === 0) return Utils.create(1, 1);

            // reduce(gcd, ...) - NOT lcm!
            let g = allOddNotes[0];
            for (let i = 1; i < allOddNotes.length; i++) {
                g = Utils.fractionGcd(g, allOddNotes[i]);
            }
            return g;
        },

        // cons_murzin(r) = 1/num + 1/den (for normalized ratio)
        computeConsonance(scale, method) {
            const n = scale.length;
            if (n < 2) return 1.0;
            
            let sum = 0, count = 0;
            const mKey = (method || 'murzin').toLowerCase();
            const calc = (global.Methods?.[mKey]?.calc) || global.Methods.murzin.calc;

            for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                    const interval = Utils.div(scale[i], scale[j]);
                    const norm = Utils.normalize(interval);
                    sum += calc(norm.num, norm.den);
                    count++;
                }
            }
            return count === 0 ? 0 : sum / count;
        },

        pruneSystem(scales, limit) {
            // Deep copy to avoid mutation
            let current = scales.map(s => ({ root: s.root, scale: s.scale.slice() }));
            let maxIter = 1000;

            while (maxIter-- > 0) {
                const depth = this.systemDepth(current);
                if (depth <= limit) return current;

                const denomsSet = new Set();
                current.forEach(s => {
                    s.scale.forEach(r => denomsSet.add(Utils.oddPart(r.den)));
                });
                
                const denoms = Array.from(denomsSet);
                if (denoms.length === 0) break;

                // Sort by badness: high complex_euler first, then high value
                denoms.sort((a, b) => {
                    const ca = Utils.complexEuler(a);
                    const cb = Utils.complexEuler(b);
                    return (ca !== cb) ? (cb - ca) : (b - a);
                });

                const victim = denoms[0];

                const pruned = current.map(s => ({
                    root: s.root,
                    scale: s.scale.filter(r => Utils.oddPart(r.den) !== victim)
                }));

                current = pruned.filter(s => s.scale.length >= 3);
                if (current.length === 0) break;
            }
            return current;
        },

        crystallize(scale, minCons, method) {
            let current = scale.slice();
            let iter = 0;
            
            while (iter++ < 50) {
                if (current.length <= 4) return current;
                if (this.computeConsonance(current, method) >= minCons) return current;

                let bestCand = null;
                let bestScore = -1;

                for (let i = 0; i < current.length; i++) {
                    const candidate = current.filter((_, x) => x !== i);
                    const score = this.computeConsonance(candidate, method);
                    if (score > bestScore) {
                        bestScore = score;
                        bestCand = candidate;
                    }
                }
                
                if (bestCand) current = bestCand;
                else break;
            }
            return current;
        },

        // normalize_scale(s) = sort!(unique!(normalize.(s)))
        normalizeScale(scaleArr) {
            const map = new Map();
            scaleArr.forEach(r => {
                const n = Utils.normalize(r);
                map.set(`${n.num}/${n.den}`, n);
            });
            return Array.from(map.values())
                .sort((a, b) => Utils.toDecimal(a) - Utils.toDecimal(b));
        },

        uniqueScale(scale) {
            const map = new Map();
            scale.forEach(r => map.set(`${r.num}/${r.den}`, r));
            return Array.from(map.values());
        },

        // Main generator - stores ABSOLUTE ratios (a/n), NO transformation
        generateSystem(limit, poolSize, minCons, consMethod) {
            // 1. Raw generation
            let raw = [];
            for (let a = 1; a <= poolSize; a++) {
                const scale = [];
                for (let n = 1; n <= poolSize; n++) {
                    scale.push(Utils.create(a, n));
                }
                raw.push({ root: a, scale });
            }

            // 2. Prune
            const pruned = this.pruneSystem(raw, limit);

            // 3. Crystallize
            // FIX: Заменили uniqueScale на normalizeScale.
            // Это приведет все дроби к диапазону [1, 2) и уберет дубликаты (2/1 станет 1/1).
            const result = pruned.map(s => ({
                root: s.root,
                scale: this.normalizeScale(this.crystallize(s.scale, minCons, consMethod))
            }));

            return result.filter(s => s.scale.length > 0);
        }
        // generateSystem(limit, poolSize, minCons, consMethod) {
        //     // 1. Raw: scale = [a/1, a/2, a/3, ... a/pool]
        //     let raw = [];
        //     for (let a = 1; a <= poolSize; a++) {
        //         const scale = [];
        //         for (let n = 1; n <= poolSize; n++) {
        //             scale.push(Utils.create(a, n));
        //         }
        //         raw.push({ root: a, scale });
        //     }

        //     // 2. Prune to meet depth limit
        //     const pruned = this.pruneSystem(raw, limit);

        //     // 3. Crystallize each scale, keep absolute values
        //     const result = pruned.map(s => ({
        //         root: s.root,
        //         scale: this.uniqueScale(this.crystallize(s.scale, minCons, consMethod))
        //     }));

        //     return result.filter(s => s.scale.length > 0);
        // }
    };

    // ============================================
    // PUBLIC API
    // ============================================
    
    global.PolyUndertonality = {
        generate: (limit, pool, minCons, method) => 
            Logic.generateSystem(limit, pool, minCons, method),
        getDepth: (system) => Logic.systemDepth(system),
        getSystemRoot: (system) => Logic.getSystemRoot(system),
        normalizeScale: (scale) => Logic.normalizeScale(scale),
        utils: Utils
    };

})(typeof window !== 'undefined' ? window : globalThis);