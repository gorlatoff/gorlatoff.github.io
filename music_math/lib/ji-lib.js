(function(global) {
  'use strict';

  /* ==================================================
     INTERNAL STATE & CACHES
     ================================================== */
  
  const _consCache = new Map();
  const _factorsCache = new Map();

  /* ==================================================
     MATH HELPERS
     ================================================== */

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { let t = b; b = a % b; a = t; }
    return a;
  }

  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

    // НОД для двух рациональных интервалов
  function gcdOfRationals(a, b) {
    const gcdOfNumerators = jiLib.gcd(a.numerator, b.numerator);
    const lcmOfDenominators = jiLib.lcm(a.denominator, b.denominator);
    return new jiLib.RationalInterval(gcdOfNumerators, lcmOfDenominators);
  }

  function getPrimeFactors(n) {
    n = Math.abs(Math.floor(n));
    if (n <= 1) return {};
    
    if (_factorsCache.has(n)) return _factorsCache.get(n);

    const f = {}; 
    let tempN = n;

    while (tempN % 2 === 0) { f[2] = (f[2]||0)+1; tempN /= 2; }
    let d = 3;
    while (d*d <= tempN) {
      while (tempN % d === 0) { f[d] = (f[d]||0)+1; tempN /= d; }
      d += 2;
    }
    if (tempN > 1) f[tempN] = (f[tempN]||0)+1;
    
    _factorsCache.set(n, f);
    return f;
  }

  // ✅ Совместимость с core - принимает (n, d)
  function toSemitones(n, d) {
    return Math.round(12 * Math.log2(n / d));
  }

  /* ==================================================
     RATIO STRUCT & ARITHMETIC
     ================================================== */

  function createRatio(num, den) {
    if (!Number.isFinite(num) || !Number.isFinite(den)) {
      return { num: 1, den: 1 };
    }
    if (Math.abs(den) < 1e-9) return { num: 1, den: 1 };

    const common = gcd(num, den);
    const s = (num * den < 0) ? -1 : 1;
    
    return { 
      num: s * Math.abs(num / common), 
      den: Math.abs(den / common) 
    };
  }

  const multiply = (a, b) => createRatio(a.num * b.num, a.den * b.den);
  const divide   = (a, b) => createRatio(a.num * b.den, a.den * b.num);

  function normalize(ratio) {
    let { num, den } = ratio;
    if (num <= 0 || den <= 0) return createRatio(Math.abs(num), Math.abs(den));
    let val = num / den;
    while (val < 1) { num *= 2; val = num / den; }
    while (val >= 2) { den *= 2; val = num / den; }
    return createRatio(num, den);
  }

  /* ==================================================
     EDO & CONVERSIONS
     ================================================== */

  const toEDO = (ratio, steps) => steps * Math.log2(Math.abs(ratio.num / ratio.den));
  const toCents = (ratio) => toEDO(ratio, 1200);
  const ratioToSemitones = (ratio) => Math.round(toEDO(ratio, 12));
  const toDecimal = (ratio) => ratio.num / ratio.den;

  /* ==================================================
     ANALYSIS
     ================================================== */

  function primeLimit(ratio, limits) {
    const fnum = getPrimeFactors(ratio.num);
    const fden = getPrimeFactors(ratio.den);
    
    const count3 = (fnum[3]||0) + (fden[3]||0);
    const count5 = (fnum[5]||0) + (fden[5]||0);
    const count7 = (fnum[7]||0) + (fden[7]||0);
    
    let countExtra = 0;
    const allPrimes = new Set([...Object.keys(fnum), ...Object.keys(fden)]);
    for (const pStr of allPrimes) {
      const p = Number(pStr);
      if (p > 7) countExtra += (fnum[p]||0) + (fden[p]||0);
    }

    return (
      count3 <= (limits[3] || 0) &&
      count5 <= (limits[5] || 0) &&
      count7 <= (limits[7] || 0) &&
      (limits.extra === undefined ? true : (countExtra <= (limits.extra || 0)))
    );
  }

  /* ==================================================
     CONSONANCE METHODS - ✅ ПОЛНАЯ СОВМЕСТИМОСТЬ С CORE
     ================================================== */

  const Methods = {
    heClassic: {
      desc: `<b>HE Classic (Erlich):</b> 1 / √(N × D).<br>
             Paul Erlich's original Harmonic Entropy weight.<br>
             Based on Farey mediant probability: simpler ratios 
             with smaller N×D product are more likely to be perceived 
             under Gaussian pitch uncertainty.`,
      calc(n, d) {
        return 1 / Math.sqrt(n * d);
      }
    },

    murzin: {
      desc: '<b>Murzin:</b> 1/N + 1/D. Classic simplicity metric.',
      calc(n, d) {
        return 1 / n + 1 / d;
      }
    },

    euler: {
      desc: '<b>Euler:</b> 1 / (1 + Gradus/5). Weighted prime exponents.',
      calc(n, d) {
        const factors = { ...getPrimeFactors(n) };
        const dFactors = getPrimeFactors(d);
        
        for (const k in dFactors) {
          factors[k] = (factors[k] || 0) + dFactors[k];
        }

        let gradus = 0;
        for (const k in factors) {
          gradus += (Number(k) - 1) * factors[k];
        }

        return 1 / (1 + gradus / 5);
      }
    },

    sopfr: {
      desc: '<b>Sum of Primes:</b> 1 / (1 + Sum(factors)/5). Sum of all prime factors.',
      calc(n, d) {
        const sopfr = (x) => {
          const f = getPrimeFactors(x);
          let sum = 0;
          for (const k in f) sum += f[k] * Number(k);
          return sum;
        };
        return 1 / (1 + (sopfr(n) + sopfr(d)) / 5);
      }
    },

    barlow: {
      desc: '<b>Barlow:</b> 1 / (1 + Indigestibility). Quadratic prime penalty.',
      calc(n, d) {
        const indigestibility = (x) => {
          const f = getPrimeFactors(x);
          let sum = 0;
          for (const k in f) {
            const p = Number(k);
            sum += f[k] * (2 * Math.pow(p - 1, 2) / p);
          }
          return sum;
        };
        return 1 / (1 + indigestibility(n) + indigestibility(d));
      }
    },

    tenney: {
      desc: '<b>Tenney:</b> 1 / (1 + log₂(N×D)). Favors small numbers.',
      calc(n, d) {
        return 1 / (1 + Math.log2(n * d));
      }
    },

    harmUtility: {
      desc: '<b>HarmUtility:</b> 1 / (1 + Sum(count × ln(p))). Logarithmic prime penalty.',
      calc(n, d) {
        const complexity = (x) => {
          const f = getPrimeFactors(x);
          let sum = 0;
          for (const k in f) sum += f[k] * Math.log(Number(k));
          return sum;
        };
        return 1 / (1 + complexity(n) + complexity(d));
      }
    }
  };

  // Быстрый доступ для computeConsonance
  const consonanceMethods = {};
  for (const key in Methods) {
    consonanceMethods[key] = (n, d) => Methods[key].calc(n, d);
  }
  // Aliases for backward compatibility
  consonanceMethods['he-classic'] = consonanceMethods.heClassic;
  consonanceMethods.original = consonanceMethods.heClassic;
  consonanceMethods.default = consonanceMethods.heClassic;

  function computeConsonance(num, den, method = 'default') {
    const key = `${num}/${den}::${method}`;
    if (_consCache.has(key)) return _consCache.get(key);
    const fn = consonanceMethods[method] || consonanceMethods.default;
    const val = fn(num, den);
    _consCache.set(key, val);
    return val;
  }

  function clearCache() { 
    _consCache.clear(); 
    _factorsCache.clear();
  }

  function getNoteName(midiNote) { 
    const n = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']; 
    return n[(midiNote % 12 + 12) % 12] + (Math.floor(midiNote / 12) - 1); 
  }

  /* ==================================================
     ✅ RATIONAL INTERVAL CLASS (СОВМЕСТИМОСТЬ С CORE)
     ================================================== */

  class RationalInterval {
    constructor(numerator, denominator) {
      this.numerator = Math.abs(Math.floor(numerator));
      this.denominator = Math.abs(Math.floor(denominator));
      this.simplify();
    }

    simplify() {
      const g = gcd(this.numerator, this.denominator) || 1;
      this.numerator = Math.floor(this.numerator / g);
      this.denominator = Math.floor(this.denominator / g);
      return this;
    }

    normalize() {
      let num = this.numerator;
      let den = this.denominator;
      while (num >= 2 * den) num /= 2;
      while (num < den) num *= 2;
      return new RationalInterval(num, den);
    }

    // ✅ NEW: Умножение интервалов (a/b * c/d = ac/bd)
    multiply(other) {
      return new RationalInterval(
        this.numerator * other.numerator,
        this.denominator * other.denominator
      );
    }

    // ✅ NEW: Деление интервалов (a/b ÷ c/d = ad/bc)
    divide(other) {
      return new RationalInterval(
        this.numerator * other.denominator,
        this.denominator * other.numerator
      );
    }

    // ✅ NEW: Инверсия интервала (a/b → b/a)
    invert() {
      return new RationalInterval(this.denominator, this.numerator);
    }

    // ✅ NEW: Сравнение интервалов
    equals(other) {
      return this.numerator === other.numerator && 
             this.denominator === other.denominator;
    }

    toDecimal() {
      return this.numerator / this.denominator;
    }

    toCents() {
      return 1200 * Math.log2(this.numerator / this.denominator);
    }

    toSemitones() {
      return toSemitones(this.numerator, this.denominator);
    }

    toString() {
      return `${this.numerator}/${this.denominator}`;
    }

    consonance(method = 'euler', options = {}) {
      const calc = Methods[method]?.calc;
      if (!calc) throw new Error(`Unknown method: ${method}`);
      return calc(this.numerator, this.denominator);
    }
  }

  /* ==================================================
     EXPORT OBJECT
     ================================================== */

  const jiLib = {
    // Math Core
    gcd,
    lcm,
    gcdOfRationals,
    primeFactors: getPrimeFactors,
    primeFactorsFull: getPrimeFactors,
    toSemitones,
    
    // Ratio Core
    createRatio,
    normalizeRatio: normalize,
    divideRatios: divide,
    multiplyRatios: multiply,
    
    adjustRatioOctave(r, shift) {
      let n = r.num;
      let d = r.den;
      if (shift > 0) n *= Math.pow(2, shift);
      else if (shift < 0) d *= Math.pow(2, Math.abs(shift));
      return createRatio(n, d);
    },

    // Conversions
    ratioToCents: toCents,
    ratioToSemitones,
    ratioToDecimal: toDecimal,
    getNoteName,

    // Analysis
    primeLimit,
    consonanceMethods,
    computeConsonance,

    // ✅ Class
    RationalInterval,

    // Tools
    clearCache
  };

  global.jiLib = jiLib;
  global.Methods = Methods;

})(typeof globalThis !== 'undefined' ? globalThis : window);