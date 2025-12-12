(function(global) {
  'use strict';

  /* --- MATH CORE --- */
  
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { let t = b; b = a % b; a = t; }
    return a;
  }

  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    const prod = Math.abs(a * b);
    return prod / gcd(a, b);
  }

  function gcdArray(arr) {
    if (!arr.length) return 1;
    let r = arr[0];
    for (let i = 1; i < arr.length; i++) r = gcd(r, arr[i]);
    return r;
  }

  function lcmArray(arr) {
    if (!arr.length) return 1;
    let r = arr[0];
    for (let i = 1; i < arr.length; i++) {
        r = lcm(r, arr[i]);
        if (r > 1e14) return r; 
    }
    return r;
  }

  function getOddPart(n) {
    n = Math.abs(n);
    if (n === 0) return 0;
    while ((n & 1) === 0) n >>= 1; 
    return n;
  }

  /* --- PRIMES & EULER --- */

  const primeCache = new Map();

  function getPrimeFactors(n) {
    if (n === 1) return {};
    if (primeCache.has(n)) return primeCache.get(n);

    const factors = {};
    let d = 2;
    let temp = n;
    while (d * d <= temp) {
      while (temp % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        temp /= d;
      }
      d++;
    }
    if (temp > 1) factors[temp] = (factors[temp] || 0) + 1;
    
    if (n < 10000) primeCache.set(n, factors);
    return factors;
  }

  /**
   * Максимальный простой делитель числа
   */
  function getMaxPrime(n) {
    if (n <= 1) return 1;
    const factors = getPrimeFactors(n);
    const primes = Object.keys(factors).map(Number);
    return primes.length > 0 ? Math.max(...primes) : 1;
  }

  /**
   * Euler's Gradus Suavitatis
   * Чем МЕНЬШЕ, тем консонантнее
   */
  function eulerGradus(n, d) {
    const val = n * d;
    const factors = getPrimeFactors(val);
    let gradus = 1;
    
    for (let p in factors) {
        const k = factors[p];
        const prime = parseInt(p);
        gradus += (prime - 1) * k;
    }
    return gradus;
  }

  /* --- RATIO TOOLS --- */

  function createRatio(num, den) {
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return { num: 1, den: 1 };
    const c = gcd(num, den);
    return { num: Math.abs(num/c), den: Math.abs(den/c) };
  }

  function adjustRatioOctave(r, shift) {
    let n = r.num;
    let d = r.den;
    if (shift > 0) n *= Math.pow(2, shift);
    else if (shift < 0) d *= Math.pow(2, Math.abs(shift));
    return createRatio(n, d);
  }

  function forceRatioToKey(r, semitoneDist) {
    const val = r.num / r.den;
    const currentCents = 1200 * Math.log2(val);
    const targetCents = semitoneDist * 100;
    const diff = targetCents - currentCents;
    const shifts = Math.round(diff / 1200);
    return adjustRatioOctave(r, shifts);
  }

  /* --- COMPLEXITY --- */

  /**
   * @param {Array} ratios - массив {num, den}
   * @param {boolean} useLCM - учитывать LCM factor
   * @param {boolean} useGCD - учитывать GCD factor
   * @param {boolean} ignoreOctaves - игнорировать степени 2
   */
  function computeComplexity(ratios, useLCM, useGCD, ignoreOctaves = false) {
    if (ratios.length === 0) return 1;
    
    const nums = [];
    const dens = [];
    for (let i = 0; i < ratios.length; i++) {
        nums.push(ignoreOctaves ? getOddPart(ratios[i].num) : ratios[i].num);
        dens.push(ignoreOctaves ? getOddPart(ratios[i].den) : ratios[i].den);
    }

    let complexity = 1.0;

    if (useLCM) {
        const lNum = lcmArray(nums);
        const lDen = gcdArray(dens);
        complexity *= (lDen === 0 ? 9999 : lNum / lDen);
    }

    if (useGCD) {
        const gNum = gcdArray(nums);
        const gDen = lcmArray(dens);
        complexity *= (gNum === 0 ? 9999 : gDen / gNum);
    }
    
    return complexity;
  }

  /**
   * Расширенная метрика с настраиваемым весом GCD
   * @param {number} gcdWeight - вес GCD (1.0 = равный, 2.0 = GCD вдвое важнее)
   */
  function computeWeightedComplexity(ratios, useLCM, useGCD, gcdWeight = 1.0) {
    if (ratios.length === 0) return 1;
    
    const nums = ratios.map(r => r.num);
    const dens = ratios.map(r => r.den);

    let complexity = 1.0;

    if (useLCM) {
        const lNum = lcmArray(nums);
        const lDen = gcdArray(dens);
        complexity *= (lDen === 0 ? 9999 : lNum / lDen);
    }

    if (useGCD) {
        const gNum = gcdArray(nums);
        const gDen = lcmArray(dens);
        const gcdFactor = (gNum === 0 ? 9999 : gDen / gNum);
        complexity *= Math.pow(gcdFactor, gcdWeight);
    }
    
    return complexity;
  }

  /* --- EXPORTS --- */
  
  global.jiLib = {
    gcd, lcm, gcdArray, lcmArray, getOddPart,
    createRatio, forceRatioToKey, adjustRatioOctave,
    computeComplexity, computeWeightedComplexity,
    eulerGradus, getPrimeFactors, getMaxPrime,
    
    ratioToCents: (r) => 1200 * Math.log2(r.num / r.den),
    getNoteName: (m) => ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][m % 12]
  };

})(window);