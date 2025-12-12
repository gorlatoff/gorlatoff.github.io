/**
 * generate_modes.js - Генератор JI ладов
 * Зависит от: ji-lib.js (должен быть загружен первым)
 */
(function(global) {
  'use strict';

  const jiLib = global.jiLib;
  if (!jiLib) throw new Error('ji-lib.js must be loaded before generate_modes.js');

  const RationalInterval = jiLib.RationalInterval;
  const primeFactorsFull = jiLib.primeFactorsFull;
  const consonanceMethods = jiLib.consonanceMethods;

  /* ==================================================
     CONSTANTS
     ================================================== */
  
  const MAX_SCALES = 100;

  /* ==================================================
     HELPER FUNCTIONS
     ================================================== */

  /**
   * Вычисляет консонанс интервала указанным методом
   * @param {RationalInterval} r - интервал
   * @param {string} method - название метода ('murzin', 'euler', etc.)
   * @returns {number}
   */
  function intervalConsonance(r, method = 'murzin') {
    const fn = consonanceMethods[method] || consonanceMethods['murzin'];
    return fn(r.numerator, r.denominator);
  }

  /**
   * Вычисляет среднюю консонансу лада (всех пар интервалов)
   * @param {RationalInterval[]} scale - массив интервалов
   * @param {string} method - метод консонанса
   * @returns {number}
   */
  function scaleConsonance(scale, method = 'murzin') {
    const sorted = scale.slice().sort((a, b) => a.toDecimal() - b.toDecimal());
    const pairs = [];
    
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const ratio = sorted[j].divide(sorted[i]).normalize();
        pairs.push(intervalConsonance(ratio, method));
      }
    }
    
    return pairs.length > 0 
      ? pairs.reduce((a, b) => a + b, 0) / pairs.length 
      : 1.0;
  }

  /**
   * Проверка odd-limit
   * @param {number} limit - максимальный odd-limit
   * @param {RationalInterval} r - интервал
   * @returns {boolean}
   */
  function oddLimit(limit, r) {
    return r.numerator <= limit || r.denominator <= limit;
  }

  /**
   * Проверка prime-limit для генерации ладов
   * Запрет простых >7, ограничения на экспоненты
   * @param {RationalInterval} r - интервал
   * @returns {boolean}
   */
  function checkPrimeLimit(r) {
    const fnum = primeFactorsFull(r.numerator);
    const fden = primeFactorsFull(r.denominator);

    // Запрет любых простых > 7
    const combinedPrimes = new Set([
      ...Object.keys(fnum).map(Number), 
      ...Object.keys(fden).map(Number)
    ]);
    
    for (const p of combinedPrimes) {
      if (p > 7) return false;
    }

    // Суммарные экспоненты для 3, 5, 7
    const exp3 = (fnum[3] || 0) + (fden[3] || 0);
    const exp5 = (fnum[5] || 0) + (fden[5] || 0);
    const exp7 = (fnum[7] || 0) + (fden[7] || 0);

    // Ограничения
    if (exp3 > 4) return false;           // не более 4 троек
    if ((exp5 + exp7) > 2) return false;  // не более 2 пятёрок/семёрок суммарно
    if (exp7 > 1) return false;           // не более 1 семёрки

    return true;
  }

  /**
   * Вставка лада в отсортированный массив (по консонансу)
   * @param {Array} scales - массив ладов
   * @param {RationalInterval[]} newScale - новый лад
   * @param {number} cons - консонанс
   * @returns {boolean} - был ли добавлен
   */
  function insertScale(scales, newScale, cons) {
    const key = newScale.map(r => r.toString()).sort().join('|');
    
    // Проверка дубликатов
    if (scales.some(entry => entry.key === key)) return false;
    
    const newEntry = { 
      consonance: cons, 
      scale: newScale, 
      key, 
      n: newScale.length 
    };
    
    // Бинарный поиск позиции для вставки
    let pos = scales.findIndex(entry => entry.consonance < cons);
    if (pos === -1) {
      scales.push(newEntry);
    } else {
      scales.splice(pos, 0, newEntry);
    }
    
    // Ограничение размера
    if (scales.length > MAX_SCALES) scales.pop();
    
    return true;
  }

  /**
   * Генерация базовых интервалов для построения ладов
   * @param {number} cutoff - ограничение odd-limit
   * @returns {RationalInterval[]}
   */
  function generateBaseIntervals(cutoff) {
    const baseRatios = [];
    
    for (let i = 3; i <= 45; i++) {
      for (let j = i + 1; j <= 45; j++) {
        baseRatios.push(new RationalInterval(j, i));
      }
    }
    
    // Фильтрация: применяем primeLimit и oddLimit
    const filtered = baseRatios.filter(r => 
      checkPrimeLimit(r) && oddLimit(cutoff, r)
    );

    // Удаление дубликатов после нормализации
    const seen = new Set();
    const intervals = [];
    
    for (const r of filtered) {
      const nr = r.normalize();
      const key = nr.toString();
      if (!seen.has(key)) {
        seen.add(key);
        intervals.push(nr);
      }
    }
    
    return intervals;
  }

  /**
   * Основная функция генерации ладов
   * @param {Object} options - параметры генерации
   * @param {number} options.minNotes - минимальное число нот (default: 3)
   * @param {number} options.maxNotes - максимальное число нот (default: 8)
   * @param {number} options.searchLimit - ограничение odd-limit (default: 32)
   * @param {number} options.minConsonance - минимальная консонанса (default: 0.2)
   * @param {string} options.method - метод консонанса (default: 'murzin')
   * @param {Function} options.onProgress - callback для прогресса (optional)
   * @returns {Promise<Object>} - объект scalesDB где ключи — число нот
   */
  async function generateScales(options = {}) {
    const {
      minNotes = 3,
      maxNotes = 8,
      searchLimit = 32,
      minConsonance = 0.2,
      method = 'murzin',
      onProgress = null
    } = options;

    const scalesDB = {};
    const unison = new RationalInterval(1, 1);
    
    // База: лад из одной ноты (унисон)
    scalesDB[1] = [{ 
      consonance: 1.0, 
      scale: [unison], 
      key: unison.toString(), 
      n: 1 
    }];
    
    const intervals = generateBaseIntervals(searchLimit);

    // Рекурсивная генерация от 2 до maxNotes
    for (let n = 2; n <= maxNotes; n++) {
      // Callback прогресса
      if (onProgress && n >= minNotes) {
        onProgress(n, maxNotes);
        // Даём браузеру шанс отрисовать
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      const newScales = [];
      const prev = scalesDB[n - 1] || [];
      
      for (const entry of prev) {
        const scale = entry.scale;
        
        for (const baseNote of scale) {
          for (const interval of intervals) {
            // Пробуем добавить интервал вверх и вниз
            const newNoteUp = baseNote.multiply(interval).normalize();
            const newNoteDown = baseNote.divide(interval).normalize();
            
            for (const newNote of [newNoteUp, newNoteDown]) {
              // Проверка: нота ещё не в ладе
              if (scale.some(r => r.toString() === newNote.toString())) continue;
              
              // Создаём кандидата
              const candidate = scale.slice();
              candidate.push(newNote);
              candidate.sort((a, b) => a.toDecimal() - b.toDecimal());
              
              if (candidate.length === n) {
                const cons = scaleConsonance(candidate, method);
                if (cons >= minConsonance) {
                  insertScale(newScales, candidate, cons);
                }
              }
            }
          }
        }
      }
      
      scalesDB[n] = newScales;
    }
    
    return scalesDB;
  }

  /**
   * Преобразует scalesDB в плоский массив
   * @param {Object} scalesDB - результат generateScales
   * @param {number} minNotes - минимальное число нот для включения
   * @returns {Array}
   */
  function flattenScales(scalesDB, minNotes = 3) {
    const result = [];
    
    for (const n in scalesDB) {
      if (parseInt(n) < minNotes) continue;
      
      for (const entry of scalesDB[n]) {
        result.push({ 
          n: parseInt(n), 
          consonance: entry.consonance, 
          scale: entry.scale, 
          key: entry.key 
        });
      }
    }
    
    // Сортировка: по консонансу (desc), затем по числу нот (asc)
    result.sort((a, b) => {
      if (b.consonance !== a.consonance) return b.consonance - a.consonance;
      return a.n - b.n;
    });
    
    return result;
  }

  /**
   * JI-интервал → ближайший темперированный полутон
   * @param {RationalInterval} r
   * @returns {number}
   */
  function jiToSemitone(r) {
    return Math.round(Math.log2(r.toDecimal()) * 12);
  }

  /**
   * Создаёт ключ для поиска названия лада
   * @param {number[]} semitones - массив полутонов
   * @returns {string}
   */
  // function makeKeyFromSemitones(semitones) {
  //   const classes = semitones
  //     .map(s => ((s % 12) + 12) % 12)
  //     .sort((a, b) => a - b);
  //   return `{${classes.join(', ')}}`;
  // }

    function makeKeyFromSemitones(semitones) {
      const classes = [...new Set(
        semitones
          .map(s => ((s % 12) + 12) % 12)
          .sort((a, b) => a - b)
      )];
      return `{${classes.join(', ')}}`;
    }


  /**
   * Генерирует название лада
   * @param {RationalInterval[]} scale - лад
   * @param {Object} namesMap - карта названий (optional)
   * @returns {string}
   */
  function generateScaleName(scale, namesMap = null) {
    const semitones = scale.map(jiToSemitone);
    const key = makeKeyFromSemitones(semitones);
    
    // Используем глобальную карту если не передана
    const map = namesMap || (typeof scalesNamesMap !== 'undefined' ? scalesNamesMap : null);
    const names = map ? map[key] : null;
    
    return (names && names.length > 0) 
      ? names.join(', ') 
      : ('Лад ' + scale.length);
  }

  /* ==================================================
     EXPORT
     ================================================== */

  const ModeGenerator = {
    // Основные функции
    generateScales,
    flattenScales,
    
    // Утилиты для анализа
    scaleConsonance,
    intervalConsonance,
    checkPrimeLimit,
    oddLimit,
    
    // Утилиты для именования
    jiToSemitone,
    makeKeyFromSemitones,
    generateScaleName,
    
    // Константы
    MAX_SCALES
  };

  global.ModeGenerator = ModeGenerator;

})(typeof globalThis !== 'undefined' ? globalThis : window);