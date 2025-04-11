class RationalInterval {
  static acousticTonic = new RationalInterval(1, 1);
  constructor(numerator, denominator) {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
      throw new Error("Числитель и знаменатель должны быть целыми числами");
    }
    this.numerator = numerator;
    this.denominator = denominator;
    this.simplify();
  }
  gcd(a, b) { return b ? this.gcd(b, a % b) : a; }
  simplify() {
    const common = this.gcd(this.numerator, this.denominator);
    this.numerator = Math.floor(this.numerator / common);
    this.denominator = Math.floor(this.denominator / common);
  }
  multiply(other) {
    const result = new RationalInterval(this.numerator * other.numerator, this.denominator * other.denominator);
    result.simplify();
    return result;
  }
  divide(other) {
    const result = new RationalInterval(this.numerator * other.denominator, this.denominator * other.numerator);
    result.simplify();
    return result;
  }
  normalize() {
    let num = this.numerator;
    let den = this.denominator;
    let ratio = num / den;
    while (ratio < 1) { num *= 2; ratio = num / den; }
    while (ratio >= 4) { den *= 2; ratio = num / den; }
    const common = this.gcd(num, den);
    return new RationalInterval(num / common, den / common);
  }
  toCents() { return 1200 * Math.log2(this.numerator / this.denominator); }
  toObject() { return { numerator: this.numerator, denominator: this.denominator }; }
  adjustOctave(shift) {
    if (shift >= 0) { return new RationalInterval(this.numerator * (2 ** shift), this.denominator); }
    else { return new RationalInterval(this.numerator, this.denominator * (2 ** Math.abs(shift))); }
  }
  static setAcousticTonic(numerator, denominator) {
    RationalInterval.acousticTonic = new RationalInterval(numerator, denominator);
  }
}

// Простейшая функция НОД для чисел
function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

// Простейшая факторизация натурального числа
function factorize(n) {
  let factors = [];
  let d = 2;
  while (n > 1 && d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

// Проверка: знаменатель должен быть степенью двойки, а количество простых множителей не превышать заданные лимиты.
function primeLimit(ratio, limits) {
  if (!isPow2(ratio.denominator)) return false;
  const factors = factorize(ratio.numerator);
  const count3 = factors.filter(x => x === 3).length;
  const count5 = factors.filter(x => x === 5).length;
  const count7 = factors.filter(x => x === 7).length;
  const countExtra = factors.filter(x => x > 7).length;
  return (
    count3 <= limits[3] &&
    count5 <= limits[5] &&
    count7 <= limits[7] &&
    countExtra <= limits.extra
  );
}

// Проверка, является ли число степенью двойки
function isPow2(n) {
  return (n & (n - 1)) === 0;
}


function consonance(num, den) {
  return 1 / den + 1 / num;
}

// **Измененная функция: цвет зависит от консонантности и веса**
function getColorFromConsonanceAndWeight(cons, weight) {
  const maxWeight = 10; // Максимальный вес для нормализации
  const normalizedCons = Math.min(cons / 2, 1); // Консонантность от 0 до 1
  const normalizedWeight = Math.min(weight / maxWeight, 1); // Вес от 0 до 1
  const hue = 30 + normalizedCons * 100; // Оттенок от 30 (низкая консонантность) до 130 (высокая)
  const saturation = 50 + normalizedWeight * 50; // Насыщенность от 50% (серый) до 100% (яркий)
  const lightness = 42; // Фиксированная светлота
  const alpha = 0.9; // Фиксированная прозрачность
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}
// ============================================================
// Вспомогательные функции для НОД и НОК рациональных чисел
// ============================================================
function gcdInteger(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcmInteger(a, b) {
  return Math.abs(a * b) / gcdInteger(a, b);
}

function gcdRationals(...rationals) {
  if (rationals.length < 1) return { a: 1, b: 1 };
  
  let current = rationals[0];
  for (let i = 1; i < rationals.length; i++) {
    const num = current.a * rationals[i].b;
    const den = current.b * rationals[i].a;
    const g = gcdInteger(num, den);
    current = {
      a: gcdInteger(current.a * rationals[i].a, num / g),
      b: lcmInteger(current.b, rationals[i].b)
    };
  }
  const g = gcdInteger(current.a, current.b);
  return { a: current.a / g, b: current.b / g };
}

// Перевод рационального интервала в полутоны
function ratioToCents(ratio) {
  return 1200 * Math.log2(ratio.a / ratio.b);
}


const MAX_DENOM = 46;
const EDO = 12;
const PRIME_LIMITS = { 3: 4, 5: 2, 7: 1, extra: 0 };
const TONIC = new RationalInterval(1, 45);

const xScale = 50;
const yScale = 100;
const WHITE_KEY_HEIGHT = 2;
const BLACK_KEY_RELATIVE_HEIGHT = 0.8;
const LABEL_BLACK_POS_Y = 0.4;
const LABEL_WHITE_POS_Y = 0.6;
const LABEL_RADIUS_X = 20;
const LABEL_RADIUS_Y = 30;
const NUM_OCTAVES = 2;
const START_OCTAVE = 3;

const edoStepToJI = new Map();
// Генерация интервалов и вывод результата в виде простого текстового списка
function generateIntervals() {
  const intervals = new Map();

  for (let den = 1; den <= MAX_DENOM; den++) {
    for (let num = 1; num <= MAX_DENOM; num++) {
      if (num === den || gcd(num, den) !== 1) continue;

      // Генерируем базовый интервал и нормализуем его
      let candidate = new RationalInterval(num, den).normalize();
      // Приводим к пространству, где тоника равна 1/45
      let candidateDiv = candidate.divide(TONIC);
      // Пропускаем интервалы, не удовлетворяющие лимитам простых множителей
      if (!primeLimit(candidateDiv, PRIME_LIMITS)) continue;
      // Восстанавливаем исходное отношение
      let finalInterval = candidateDiv.multiply(TONIC);
      const cents = finalInterval.toCents();
      const edoStep = Math.round(cents / (1200 / EDO));
      if (edoStep < 0 || edoStep > 24) continue;

      if (!intervals.has(edoStep)) {
        intervals.set(edoStep, []);
      }
      intervals.get(edoStep).push({
        ratio: `${finalInterval.numerator}/${finalInterval.denominator}`,
        cents: cents.toFixed(1)
      });
    }
  }

  // Загружаем уникальные интервалы в edoStepToJI
  for (const [step, intervalList] of intervals.entries()) {
    const uniqueIntervals = intervalList
      .filter((item, index, self) =>
        self.findIndex(i => i.ratio === item.ratio) === index)
      .map(item => {
        const [num, den] = item.ratio.split('/').map(Number);
        return { num, den };
      });
    
    edoStepToJI.set(step, uniqueIntervals);
  }
}


class FractionLabel {
  constructor(numerator, denominator) {
    this.n = numerator;
    this.d = denominator;
  }
  draw(ctx, x, y) {
    ctx.save();
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    const numOffsetX = -3;
    const numOffsetY = -6;
    const denOffsetX = 6;
    const denOffsetY = 14;
    ctx.fillText(this.n, x + numOffsetX, y + numOffsetY);
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 2);
    ctx.lineTo(x + 8, y - 4);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillText(this.d, x + denOffsetX, y + denOffsetY);
    ctx.restore();
  }
}

// ============================================================
// Функция для генерации клавиш для нескольких октав
// ============================================================
function generateKeys(octaves = 1, startOctave = 4) {
  const baseKeys = [
    { note: 'C',  isBlack: false, midiOffset: 0 },
    { note: 'C#', isBlack: true,  midiOffset: 1 },
    { note: 'D',  isBlack: false, midiOffset: 2 },
    { note: 'D#', isBlack: true,  midiOffset: 3 },
    { note: 'E',  isBlack: false, midiOffset: 4 },
    { note: 'F',  isBlack: false, midiOffset: 5 },
    { note: 'F#', isBlack: true,  midiOffset: 6 },
    { note: 'G',  isBlack: false, midiOffset: 7 },
    { note: 'G#', isBlack: true,  midiOffset: 8 },
    { note: 'A',  isBlack: false, midiOffset: 9 },
    { note: 'A#', isBlack: true,  midiOffset: 10 },
    { note: 'B',  isBlack: false, midiOffset: 11 }
  ];
  
  const keys = [];
  for (let octave = 0; octave < octaves; octave++) {
    baseKeys.forEach((baseKey, index) => {
      const midiNote = 12 * (startOctave + octave) + baseKey.midiOffset;
      
      keys.push({
        ...baseKey,
        midiNote,
        edoStep: baseKey.midiOffset,
        octave: startOctave + octave,
        isActive: false
      });
    });
  }
  
  // Добавляем последнюю C для завершения клавиатуры
  keys.push({
    note: 'C',
    isBlack: false,
    midiOffset: 0,
    midiNote: 12 * (startOctave + octaves),
    edoStep: 0,
    octave: startOctave + octaves,
    isActive: false
  });
  
  return keys;
}


const playedNotes = [];
let bestInterpretations = [];
const allKeys = generateKeys(NUM_OCTAVES, START_OCTAVE).map(key => ({
  ...key,
  weight: 0,
  jiRatio: null,
  isAcousticTonic: false
}));
let tonicKeyIndex = 0;
let acousticTonicStep = null;
let acousticTonicRatio = null;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const synth = JZZ.synth.Tiny();
JZZ().openMidiOut().connect(synth);

function playNote(frequency, duration) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function playMidiNote(midiNote) {
  const noteOn = JZZ.MIDI.noteOn(0, midiNote, 100);
  synth.send(noteOn);
  setTimeout(() => {
    const noteOff = JZZ.MIDI.noteOff(0, midiNote, 100);
    synth.send(noteOff);
  }, 300); // длительность звука 300 мс
}

function playNoteByStep(step, midiNote) {
  // Используем MIDI синтезатор для более качественного звука
  playMidiNote(midiNote);
  
  playedNotes.push({
    edoStep: step % 12,  // Нормализуем до одной октавы
    midiNote: midiNote,
    startTime: Date.now() / 1000,
    duration: 1
  });
  
  updatePlayedNotesDisplay();
  calculateBestInterpretations();
}

// Функция получения названия ноты из MIDI номера
function getNoteName(midiNote) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteName = noteNames[midiNote % 12];
  const octave = Math.floor(midiNote / 12) - 1;
  return `${noteName}${octave}`;
}

// Функция перевода полутонов в ноту относительно C
function getAbsoluteNoteName(step) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const normalizedStep = ((step % 12) + 12) % 12; // Нормализуем шаг в пределах октавы
  const octave = Math.floor(step / 12) + 4; // Базовая октава 4
  return `${noteNames[normalizedStep]}${octave}`;
}

// ============================================================
// Отображение проигранных нот с учетом функции забывания
// ============================================================
function updatePlayedNotesDisplay() {
  const currentTime = Date.now() / 1000;
  const forgetTime = parseFloat(document.getElementById('forgetSlider').value);
  
  const activeNotes = playedNotes
    .map((note, idx) => ({
      ...note,
      index: idx,
      weight: note.duration * Math.max(0, 1 - (currentTime - note.startTime) / forgetTime)
    }))
    .filter(note => note.weight > 0);
  
  document.getElementById('playedNotes').textContent = activeNotes
    .map(n => {
      const noteName = getNoteName(n.midiNote);
      return `Нота ${noteName}: Полутон ${n.edoStep} (Вес: ${n.weight.toFixed(2)})`;
    })
    .join('\n');
}

// ============================================================
// Расчет наилучших JI интерпретаций
// ============================================================
function calculateBestInterpretations() {
  const currentTime = Date.now() / 1000;
  const forgetTime = parseFloat(document.getElementById('forgetSlider').value);
  const activeNotes = playedNotes
    .map(note => ({
      ...note,
      weight: note.duration * Math.max(0, 1 - (currentTime - note.startTime) / forgetTime)
    }))
    .filter(note => note.weight > 0);

  if (activeNotes.length < 2) {
    document.getElementById('bestInterpretations').innerHTML = 
      '<p>Сыграйте не менее двух нот для получения JI интерпретаций</p>';
    acousticTonicStep = null;
    acousticTonicRatio = null;
    document.getElementById('acoustic-tonic-display').textContent = '-';
    updateKeyboardJILabels();
    return;
  }

  const interpretations = [];
  const seen = new Set();

  // Группируем ноты по шагам, сохраняя индексы
  const stepGroups = new Map();
  activeNotes.forEach((note, idx) => {
    const normalizedStep = note.edoStep % 12;
    if (!stepGroups.has(normalizedStep)) {
      stepGroups.set(normalizedStep, []);
    }
    stepGroups.get(normalizedStep).push(idx);
  });

  // Перебираем уникальные шаги для root и ref
  const uniqueSteps = Array.from(stepGroups.keys());
  for (const rootStep of uniqueSteps) {
    for (const refStep of uniqueSteps) {
      if (rootStep === refStep) continue;

      const interval = Math.abs(refStep - rootStep) % 12;
      const jiOptions = edoStepToJI.get(interval) || [];
      
      for (const ji of jiOptions) {
        // Берем первый индекс из каждой группы для root и ref
        const rootIdx = stepGroups.get(rootStep)[0];
        const refIdx = stepGroups.get(refStep)[0];
        
        const noteJIs = Array(activeNotes.length).fill(null);
        noteJIs[rootIdx] = { num: 1, den: 1 };
        
        // Заполняем ref ноту
        noteJIs[refIdx] = refStep > rootStep ? 
          { num: ji.num, den: ji.den } : 
          { num: ji.den, den: ji.num };

        // Заполняем остальные ноты
        for (let i = 0; i < activeNotes.length; i++) {
          if (i === rootIdx || i === refIdx) continue;
          
          const step = activeNotes[i].edoStep % 12;
          const intervalToRoot = Math.abs(step - rootStep) % 12;
          const jiOptionsToRoot = edoStepToJI.get(intervalToRoot) || [];
          
          if (jiOptionsToRoot.length > 0) {
            let bestConsonance = -1;
            let bestJI = null;
            
            jiOptionsToRoot.forEach(option => {
              const cons = consonance(option.num, option.den);
              if (cons > bestConsonance) {
                bestConsonance = cons;
                bestJI = step > rootStep ? 
                  { num: option.num, den: option.den } : 
                  { num: option.den, den: option.num };
              }
            });
            
            noteJIs[i] = bestJI;
          }
        }

        // Проверка на валидность и уникальность
        if (noteJIs.some(ji => !ji)) continue;
        const key = noteJIs.map(ji => `${ji.num}/${ji.den}`).join('|');
        if (seen.has(key)) continue;
        seen.add(key);

        // Расчет консонанса
        let totalConsonance = 0;
        let totalWeight = 0;
        
        for (let i = 0; i < activeNotes.length; i++) {
          for (let j = i + 1; j < activeNotes.length; j++) {
            const num = noteJIs[j].num * noteJIs[i].den;
            const den = noteJIs[j].den * noteJIs[i].num;
            const c = consonance(num, den);
            const weight = activeNotes[i].weight * activeNotes[j].weight;
            totalConsonance += c * weight;
            totalWeight += weight;
          }
        }
        
        interpretations.push({
          consonance: totalWeight > 0 ? totalConsonance / totalWeight : 0,
          noteJIs,
          rootStep,
          refStep,
          activeNotes
        });
      }
    }
  }

  bestInterpretations = interpretations
    .sort((a, b) => b.consonance - a.consonance)
    .slice(0, 3);

  updateBestInterpretations();
  updateKeyboardJILabels();
}

// Обновление отображения лучших интерпретаций
function updateBestInterpretations() {
  if (bestInterpretations.length === 0) {
    document.getElementById('bestInterpretations').innerHTML =
      '<p>Нет доступных JI интерпретаций</p>';
    return;
  }

  document.getElementById('bestInterpretations').innerHTML = bestInterpretations
    .map((interpretation, index) => {
      const rootNoteIdx = interpretation.activeNotes.findIndex(
        (note, idx) => interpretation.noteJIs[idx].num === 1 && interpretation.noteJIs[idx].den === 1
      );
      const rootNoteName = getNoteName(interpretation.activeNotes[rootNoteIdx].midiNote);

      // Собираем уникальные интервалы для расчета акустической тоники
      const uniqueRatios = Array.from(new Set(interpretation.noteJIs.map(ji => `${ji.num}/${ji.den}`)))
        .map(s => {
          const [a, b] = s.split('/').map(Number);
          return { a, b };
        });

      // Вычисляем акустическую тонику через gcdRationals и устанавливаем её в классе
      const gcdResult = gcdRationals(...uniqueRatios);
      const tonicRatio = new RationalInterval(gcdResult.a, gcdResult.b);
      const tonicSteps = Math.round(tonicRatio.toCents() / (1200 / 12)); // Округление до целых шагов

      // Обновляем акустическую тонику и глобальные переменные для главной интерпретации
      if (index === 0) {
        RationalInterval.setAcousticTonic(gcdResult.a, gcdResult.b);
        acousticTonicStep = tonicSteps;
        acousticTonicRatio = tonicRatio;
        document.getElementById('acoustic-tonic-display').textContent =
          `${tonicRatio.numerator}/${tonicRatio.denominator} (${getAbsoluteNoteName(tonicSteps)})`;
      }

      return `
        <div class="interpretation">
          <div class="interpretation-header">
            #${index + 1} Консонанс: ${interpretation.consonance.toFixed(4)}
          </div>
          <div>Тоника: ${rootNoteName} (1/1)</div>
          <div>Акустическая тоника: ${tonicRatio.numerator}/${tonicRatio.denominator} ≈ ${getAbsoluteNoteName(tonicSteps)}</div>
          <div class="note-mapping">
            ${interpretation.activeNotes.map((note, idx) => {
              const noteName = getNoteName(note.midiNote);
              return `${noteName} → ${interpretation.noteJIs[idx].num}/${interpretation.noteJIs[idx].den}`;
            }).join('<br>')}
          </div>
        </div>
      `;
    })
    .join('');
}


const canvasHeightUnits = Math.max(WHITE_KEY_HEIGHT, BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT);
const canvas = document.getElementById('keyboard-canvas');
canvas.width = (allKeys.length / 12) * 12 * xScale;
canvas.height = canvasHeightUnits * yScale;
const ctx = canvas.getContext('2d');

// ============================================================
// Построение полигонов для клавиш
// ============================================================
function buildPolygons() {
  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i];
    if (key.isBlack) {
      // Чёрная клавиша: прямоугольник от y = 0 до y = BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT
      key.polygon = [
        { x: i,     y: 0 },
        { x: i+1,   y: 0 },
        { x: i+1,   y: BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT },
        { x: i,     y: BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT }
      ];
    } else {
      // Белая клавиша: многоугольник с расширением снизу, если рядом есть чёрная клавиша
      let leftExpand  = 0;
      let rightExpand = 0;
      if (i > 0 && allKeys[i-1].isBlack) {
        leftExpand = 0.5;
      }
      if (i < allKeys.length - 1 && allKeys[i+1].isBlack) {
        rightExpand = 0.5;
      }
      key.polygon = [
        { x: i,                y: 0 },
        { x: i+1,              y: 0 },
        { x: i+1,              y: 1 },
        { x: i+1 + rightExpand,y: 1 },
        { x: i+1 + rightExpand,y: WHITE_KEY_HEIGHT },
        { x: i - leftExpand,   y: WHITE_KEY_HEIGHT },
        { x: i - leftExpand,   y: 1 },
        { x: i,                y: 1 }
      ];
    }
  }
}


function updateKeyWeights() {
  const currentTime = Date.now() / 1000;
  const forgetTime = parseFloat(document.getElementById('forgetSlider').value) || 5;
  allKeys.forEach(key => { key.weight = 0; });
  playedNotes.forEach(note => {
    const timeDiff = currentTime - note.startTime;
    const weightContribution = note.duration * Math.max(0, 1 - timeDiff / forgetTime);
    const keyIndex = allKeys.findIndex(key => key.midiNote === note.midiNote);
    if (keyIndex !== -1) {
      allKeys[keyIndex].weight += weightContribution;
    }
  });
}

function calculateKeyConsonance(key) {
  if (!key.jiRatio || tonicKeyIndex === null) return 0;
  const tonicKey = allKeys[tonicKeyIndex];
  if (!tonicKey.jiRatio) return 0;
  const interval = new RationalInterval(
    key.jiRatio.numerator * tonicKey.jiRatio.denominator,
    key.jiRatio.denominator * tonicKey.jiRatio.numerator
  );
  return consonance(interval.numerator, interval.denominator);
}

// ============================================================
// Функция обновления JI-соотношений для клавиш на основе лучшей интерпретации
// ============================================================
function updateKeyboardJILabels() {
  // Сбрасываем все JI соотношения
  allKeys.forEach(key => {
    key.jiRatio = null;
    key.isAcousticTonic = false;
  });

  if (bestInterpretations.length === 0) {
    drawAll();
    return;
  }

  // Берем лучшую интерпретацию
  const bestInterpretation = bestInterpretations[0];

  // Находим тонику (1/1)
  const rootNoteIdx = bestInterpretation.activeNotes.findIndex(
    (note, idx) => bestInterpretation.noteJIs[idx].num === 1 && bestInterpretation.noteJIs[idx].den === 1
  );
  if (rootNoteIdx === -1) return;

  const rootMidiNote = bestInterpretation.activeNotes[rootNoteIdx].midiNote;
  const rootKeyIdx = allKeys.findIndex(key => key.midiNote === rootMidiNote);
  tonicKeyIndex = rootKeyIdx;
  document.getElementById('tonic-display').textContent = getNoteName(rootMidiNote);

  // Обрабатываем проигранные ноты
  bestInterpretation.activeNotes.forEach((note, noteIdx) => {
    const jiRatio = bestInterpretation.noteJIs[noteIdx];
    const relativeEdoStep = (note.edoStep - bestInterpretation.activeNotes[rootNoteIdx].edoStep + 12) % 12;
    allKeys.forEach(key => {
      const keyRelativeEdoStep = (key.edoStep - allKeys[rootKeyIdx].edoStep + 12) % 12;
      if (keyRelativeEdoStep === relativeEdoStep) {
        const octaveShift = Math.floor((key.midiNote - rootMidiNote) / 12);
        const baseInterval = new RationalInterval(jiRatio.num, jiRatio.den);
        const adjustedInterval = baseInterval.adjustOctave(octaveShift);
        key.jiRatio = { numerator: adjustedInterval.numerator, denominator: adjustedInterval.denominator };
      }
    });
  });

  // Обрабатываем непроигранные ноты
  const playedSteps = new Set(bestInterpretation.activeNotes.map(note => note.edoStep % 12));
  allKeys.forEach(key => {
    const keyStep = key.edoStep % 12;
    if (!playedSteps.has(keyStep) && key.jiRatio === null) {
      const intervalToRoot = (keyStep - allKeys[rootKeyIdx].edoStep + 12) % 12;
      const jiOptions = edoStepToJI.get(intervalToRoot) || [];
      if (jiOptions.length > 0) {
        let bestConsonance = -1;
        let bestJI = null;
        jiOptions.forEach(option => {
          const candidateJI = keyStep > allKeys[rootKeyIdx].edoStep ? option : { num: option.den, den: option.num };
          const candidateInterval = new RationalInterval(candidateJI.num, candidateJI.den);
          let totalCons = 0;
          bestInterpretation.noteJIs.forEach(playedJI => {
            const playedInterval = new RationalInterval(playedJI.num, playedJI.den);
            const intervalBetween = candidateInterval.divide(playedInterval);
            totalCons += consonance(intervalBetween.numerator, intervalBetween.denominator);
          });
          if (totalCons > bestConsonance) {
            bestConsonance = totalCons;
            bestJI = candidateJI;
          }
        });
        if (bestJI) {
          const octaveShift = Math.floor((key.midiNote - rootMidiNote) / 12);
          const baseInterval = new RationalInterval(bestJI.num, bestJI.den);
          const adjustedInterval = baseInterval.adjustOctave(octaveShift);
          key.jiRatio = { numerator: adjustedInterval.numerator, denominator: adjustedInterval.denominator };
        }
      }
    }
  });

  // Помечаем акустическую тонику, если она есть
  if (acousticTonicStep !== null) {
    allKeys.forEach(key => {
      if ((key.edoStep % 12) === ((acousticTonicStep % 12) + 12) % 12) {
        key.isAcousticTonic = true;
      }
    });
  }

  drawAll();
}


function drawAll() {
  ctx.fillStyle = '#21252b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < allKeys.length; i++) {
    if (!allKeys[i].isBlack) drawKey(allKeys[i], i === tonicKeyIndex);
  }
  for (let i = 0; i < allKeys.length; i++) {
    if (allKeys[i].isBlack) drawKey(allKeys[i], i === tonicKeyIndex);
  }
}

// **Измененная функция: отрисовка клавиши с учетом веса**
function drawKey(key, isTonic = false) {
  let polygonPx = key.polygon.map(pt => ({ x: pt.x * xScale, y: pt.y * yScale }));

  ctx.beginPath();
  ctx.moveTo(polygonPx[0].x, polygonPx[0].y);
  for (let i = 1; i < polygonPx.length; i++) {
    ctx.lineTo(polygonPx[i].x, polygonPx[i].y);
  }
  ctx.closePath();

  // Отрисовка клавиши (чёрной или белой)
  if (key.isBlack) {
    let grad = ctx.createLinearGradient(0, polygonPx[0].y, 0, polygonPx[2].y);
    grad.addColorStop(0, '#444');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
  } else {
    let grad = ctx.createLinearGradient(0, 0, 0, WHITE_KEY_HEIGHT * yScale);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(1, '#bbb');
    ctx.fillStyle = grad;
  }
  ctx.fill();

  // Отрисовка тоники и активных нот
  if (key.isAcousticTonic) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--tonic-color');
    ctx.fill();
  }
  if (key.isActive) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--active-color');
    ctx.fill();
  }
  if (isTonic) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--root-color');
    ctx.fill();
  }

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Отрисовка JI метки
  if (key.jiRatio) {
    const cons = calculateKeyConsonance(key);
    let color;
    if (key.weight > 0) {
      color = getColorFromConsonanceAndWeight(cons, key.weight); // Цвет для проигранных нот
    } else {
      color = 'hsla(0, 0%, 50%, 0.9)'; // Полностью серый для непроигранных
    }

    let centerX = polygonPx.reduce((sum, pt) => sum + pt.x, 0) / polygonPx.length;
    const labelY = key.isBlack
      ? BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT * yScale * LABEL_BLACK_POS_Y
      : WHITE_KEY_HEIGHT * yScale * LABEL_WHITE_POS_Y;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(centerX, labelY, LABEL_RADIUS_X, LABEL_RADIUS_Y, 0, 0, Math.PI * 2);
    ctx.fill();

    const label = new FractionLabel(key.jiRatio.numerator, key.jiRatio.denominator);
    label.draw(ctx, centerX, labelY);
  }
}


// ============================================================
// Обработка событий мыши
// ============================================================
function updateActiveKey(evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = evt.clientX - rect.left;
  const mouseY = evt.clientY - rect.top;
  
  // Сначала ищем черную клавишу (она сверху)
  let newActiveKey = null;
  for (let i = 0; i < allKeys.length; i++) {
    if (allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
      newActiveKey = i;
      break;
    }
  }
  
  // Если не нашли черную, ищем белую
  if (newActiveKey === null) {
    for (let i = 0; i < allKeys.length; i++) {
      if (!allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
        newActiveKey = i;
        break;
      }
    }
  }
  
  let changed = false;
  if (newActiveKey !== null) {
    for (let i = 0; i < allKeys.length; i++) {
      if (i === newActiveKey) {
        if (!allKeys[i].isActive) {
          allKeys[i].isActive = true;
          playNoteByStep(allKeys[i].edoStep, allKeys[i].midiNote);
          changed = true;
        }
      } else {
        if (allKeys[i].isActive) {
          allKeys[i].isActive = false;
          changed = true;
        }
      }
    }
  }
  
  if (changed) {
    drawAll();
  }
}


canvas.addEventListener('mousedown', (evt) => {
  if (evt.button === 0) { // Левая кнопка - играем ноту
    updateActiveKey(evt);
  } else if (evt.button === 2) { // Правая кнопка - устанавливаем тонику
    const rect = canvas.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const mouseY = evt.clientY - rect.top;
    
    // Находим клавишу под курсором
    for (let i = 0; i < allKeys.length; i++) {
      if (allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
        tonicKeyIndex = i;
        document.getElementById('tonic-display').textContent = 
          `${allKeys[i].note}${allKeys[i].octave}`;
        drawAll();
        break;
      }
    }
    
    // Если не нашли черную, ищем белую
    for (let i = 0; i < allKeys.length; i++) {
      if (!allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
        tonicKeyIndex = i;
        document.getElementById('tonic-display').textContent = 
          `${allKeys[i].note}${allKeys[i].octave}`;
        drawAll();
        break;
      }
    }
  }
});

// При движении мыши с зажатой кнопкой обновляем активную клавишу
canvas.addEventListener('mousemove', (evt) => {
  if (evt.buttons === 1) {
    updateActiveKey(evt);
  }
});

// При отпускании кнопки мыши -- снимаем активность всех клавиш
canvas.addEventListener('mouseup', () => {
  allKeys.forEach(key => key.isActive = false);
  drawAll();
});

// Если курсор уходит с canvas -- сбрасываем активность
canvas.addEventListener('mouseleave', () => {
  allKeys.forEach(key => key.isActive = false);
  drawAll();
});

// Предотвращаем появление контекстного меню при правом клике
canvas.addEventListener('contextmenu', (evt) => {
  evt.preventDefault();
});




// ============================================================
// Функция проверки попадания точки в многоугольник (алгоритм "ray casting")
// ============================================================
function pointInPolygon(px, py, polygon) {
  let polyPx = polygon.map(pt => ({ x: pt.x * xScale, y: pt.y * yScale }));
  let inside = false;
  for (let i = 0, j = polyPx.length - 1; i < polyPx.length; j = i++) {
    const xi = polyPx[i].x, yi = polyPx[i].y;
    const xj = polyPx[j].x, yj = polyPx[j].y;
    const intersect = ((yi > py) !== (yj > py)) &&
                      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// ============================================================
// Обработчик изменения слайдера функции забывания
// ============================================================
function setupSlider() {
  document.getElementById('forgetSlider').oninput = function() {
    document.getElementById('forgetValue').textContent = this.value;
    updatePlayedNotesDisplay();
    calculateBestInterpretations();
  };
}


// **Измененная функция: непрерывное обновление**
function periodicUpdate() {
  updateKeyWeights(); // Обновляем веса клавиш
  updatePlayedNotesDisplay(); // Обновляем отображение нот
  calculateBestInterpretations(); // Пересчитываем интерпретации
  drawAll(); // Перерисовываем клавиатуру
  requestAnimationFrame(periodicUpdate); // Планируем следующий кадр
}

function init() {
  generateIntervals();
  buildPolygons();
  setupSlider();
  drawAll();
  requestAnimationFrame(periodicUpdate); // Запускаем непрерывное обновление
}

window.onload = init;





// // ============================================================
// // Класс для работы с рациональными интервалами
// // ============================================================
// class RationalInterval {
//   constructor(numerator, denominator) {
//     this.numerator = numerator;
//     this.denominator = denominator;
//     this.simplify();
//   }

//   // Рекурсивный алгоритм НОД
//   gcd(a, b) {
//     return b ? this.gcd(b, a % b) : a;
//   }

//   simplify() {
//     const common = this.gcd(this.numerator, this.denominator);
//     this.numerator /= common;
//     this.denominator /= common;
//   }

//   // Умножение рациональных интервалов с сокращением
//   multiply(other) {
//     const result = new RationalInterval(
//       this.numerator * other.numerator,
//       this.denominator * other.denominator
//     );
//     result.simplify();
//     return result;
//   }

// divide(other) {
//   const result = new RationalInterval(
//     this.numerator * other.denominator,
//     this.denominator * other.numerator
//   );
//   result.simplify();
//   return result;
// }

//   // Нормализация: интервал приводится к диапазону [1, 4)
//   normalize() {
//     let num = this.numerator;
//     let den = this.denominator;
//     let ratio = num / den;
//     while (ratio < 1) {
//       num *= 2;
//       ratio = num / den;
//     }
//     while (ratio >= 4) {
//       den *= 2;
//       ratio = num / den;
//     }
//     const common = this.gcd(num, den);
//     return new RationalInterval(num / common, den / common);
//   }

//   toCents() {
//     return 1200 * Math.log2(this.numerator / this.denominator);
//   }

//   // Метод для получения объекта {a: numerator, b: denominator}
//   toObject() {
//     return { a: this.numerator, b: this.denominator };
//   }
// }

// // Простейшая функция НОД для чисел
// function gcd(a, b) {
//   return b ? gcd(b, a % b) : a;
// }

// // Простейшая факторизация натурального числа
// function factorize(n) {
//   let factors = [];
//   let d = 2;
//   while (n > 1 && d * d <= n) {
//     while (n % d === 0) {
//       factors.push(d);
//       n /= d;
//     }
//     d++;
//   }
//   if (n > 1) factors.push(n);
//   return factors;
// }

// // Проверка: знаменатель должен быть степенью двойки, а количество простых множителей не превышать заданные лимиты.
// function primeLimit(ratio, limits) {
//   if (!isPow2(ratio.denominator)) return false;
//   const factors = factorize(ratio.numerator);
//   const count3 = factors.filter(x => x === 3).length;
//   const count5 = factors.filter(x => x === 5).length;
//   const count7 = factors.filter(x => x === 7).length;
//   const countExtra = factors.filter(x => x > 7).length;
//   return (
//     count3 <= limits[3] &&
//     count5 <= limits[5] &&
//     count7 <= limits[7] &&
//     countExtra <= limits.extra
//   );
// }

// // Проверка, является ли число степенью двойки
// function isPow2(n) {
//   return (n & (n - 1)) === 0;
// }

// // Функция консонанса для оценки гармоничности интервала
// function consonance(num, den) {
//   return 1 / den + 1 / num;
// }

// // Функция для получения цвета на основе консонанса
// function getColorFromConsonance(cons) {
//   const normalized = cons / 2; 
//   const hue = 30 + normalized * 100; 
//   const saturation = 100;
//   const lightness = 42;
//   const alpha = 0.9;
//   return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
// }

// // ============================================================
// // Вспомогательные функции для НОД и НОК рациональных чисел
// // ============================================================
// function gcdInteger(a, b) {
//   a = Math.abs(a);
//   b = Math.abs(b);
//   while (b) {
//     [a, b] = [b, a % b];
//   }
//   return a;
// }

// function lcmInteger(a, b) {
//   return Math.abs(a * b) / gcdInteger(a, b);
// }

// function gcdRationals(...rationals) {
//   if (rationals.length < 1) return { a: 1, b: 1 };
  
//   let current = rationals[0];
//   for (let i = 1; i < rationals.length; i++) {
//     const num = current.a * rationals[i].b;
//     const den = current.b * rationals[i].a;
//     const g = gcdInteger(num, den);
//     current = {
//       a: gcdInteger(current.a * rationals[i].a, num / g),
//       b: lcmInteger(current.b, rationals[i].b)
//     };
//   }
//   const g = gcdInteger(current.a, current.b);
//   return { a: current.a / g, b: current.b / g };
// }

// // Перевод рационального интервала в полутоны
// function ratioToCents(ratio) {
//   return 1200 * Math.log2(ratio.a / ratio.b);
// }

// // ============================================================
// // Константы (значения вместо инпутов)
// // ============================================================
// const MAX_DENOM = 46;
// const EDO = 12;
// const PRIME_LIMITS = { 3: 4, 5: 2, 7: 1, extra: 0 };
// // Тоника -- выбрана как 1/45 (согласно выбранному значению в оригинале)
// const TONIC = new RationalInterval(1, 45);

// // ============================================================
// // Константы для размеров клавиатуры
// // ============================================================
// const xScale = 50;   // 1 единица ширины = 50 пикселей
// const yScale = 100;  // 1 единица высоты = 100 пикселей
// // Полная высота белой клавиши в наших логических единицах
// const WHITE_KEY_HEIGHT = 2;
// // Относительная высота чёрной клавиши (в долях от белой)
// const BLACK_KEY_RELATIVE_HEIGHT = 0.8; 
// // Константы для позиций меток
// const LABEL_BLACK_POS_Y = 0.4; // Позиция метки на черной клавише (относительно высоты черной клавиши)
// const LABEL_WHITE_POS_Y = 0.6; // Позиция метки на белой клавише (относительно высоты белой клавиши)
// // Константы для размеров меток
// const LABEL_RADIUS_X = 20;
// const LABEL_RADIUS_Y = 30;

// // Размер клавиатуры - сколько октав показывать
// const NUM_OCTAVES = 2;
// const START_OCTAVE = 3;

// // ============================================================
// // Генерация интервалов и маппинг EDO-шага к возможным JI интерпретациям
// // ============================================================
// const edoStepToJI = new Map();

// // Генерация интервалов и вывод результата в виде простого текстового списка
// function generateIntervals() {
//   const intervals = new Map();

//   for (let den = 1; den <= MAX_DENOM; den++) {
//     for (let num = 1; num <= MAX_DENOM; num++) {
//       if (num === den || gcd(num, den) !== 1) continue;

//       // Генерируем базовый интервал и нормализуем его
//       let candidate = new RationalInterval(num, den).normalize();
//       // Приводим к пространству, где тоника равна 1/45
//       let candidateDiv = candidate.divide(TONIC);
//       // Пропускаем интервалы, не удовлетворяющие лимитам простых множителей
//       if (!primeLimit(candidateDiv, PRIME_LIMITS)) continue;
//       // Восстанавливаем исходное отношение
//       let finalInterval = candidateDiv.multiply(TONIC);
//       const cents = finalInterval.toCents();
//       const edoStep = Math.round(cents / (1200 / EDO));
//       if (edoStep < 0 || edoStep > 24) continue;

//       if (!intervals.has(edoStep)) {
//         intervals.set(edoStep, []);
//       }
//       intervals.get(edoStep).push({
//         ratio: `${finalInterval.numerator}/${finalInterval.denominator}`,
//         cents: cents.toFixed(1)
//       });
//     }
//   }

//   // Загружаем уникальные интервалы в edoStepToJI
//   for (const [step, intervalList] of intervals.entries()) {
//     const uniqueIntervals = intervalList
//       .filter((item, index, self) =>
//         self.findIndex(i => i.ratio === item.ratio) === index)
//       .map(item => {
//         const [num, den] = item.ratio.split('/').map(Number);
//         return { num, den };
//       });
    
//     edoStepToJI.set(step, uniqueIntervals);
//   }
// }

// // ============================================================
// // Класс для рисования дробей
// // ============================================================
// class FractionLabel {
//   constructor(numerator, denominator) {
//     this.n = numerator;
//     this.d = denominator;
//   }
  
//   draw(ctx, x, y) {
//     ctx.save();
//     ctx.font = "bold 16px 'JetBrains Mono', monospace";
//     ctx.textAlign = "center";
//     ctx.fillStyle = "rgba(255, 255, 255, 0.9)";

//     const numOffsetX = -3;
//     const numOffsetY = -6;
//     const denOffsetX = 6;
//     const denOffsetY = 14;

//     ctx.fillText(this.n, x + numOffsetX, y + numOffsetY);
//     ctx.beginPath();
//     ctx.moveTo(x - 5, y + 2);
//     ctx.lineTo(x + 8, y - 4);
//     ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
//     ctx.lineWidth = 2;
//     ctx.stroke();
//     ctx.fillText(this.d, x + denOffsetX, y + denOffsetY);

//     ctx.restore();
//   }
// }

// // ============================================================
// // Функция для генерации клавиш для нескольких октав
// // ============================================================
// function generateKeys(octaves = 1, startOctave = 4) {
//   const baseKeys = [
//     { note: 'C',  isBlack: false, midiOffset: 0 },
//     { note: 'C#', isBlack: true,  midiOffset: 1 },
//     { note: 'D',  isBlack: false, midiOffset: 2 },
//     { note: 'D#', isBlack: true,  midiOffset: 3 },
//     { note: 'E',  isBlack: false, midiOffset: 4 },
//     { note: 'F',  isBlack: false, midiOffset: 5 },
//     { note: 'F#', isBlack: true,  midiOffset: 6 },
//     { note: 'G',  isBlack: false, midiOffset: 7 },
//     { note: 'G#', isBlack: true,  midiOffset: 8 },
//     { note: 'A',  isBlack: false, midiOffset: 9 },
//     { note: 'A#', isBlack: true,  midiOffset: 10 },
//     { note: 'B',  isBlack: false, midiOffset: 11 }
//   ];
  
//   const keys = [];
//   for (let octave = 0; octave < octaves; octave++) {
//     baseKeys.forEach((baseKey, index) => {
//       const midiNote = 12 * (startOctave + octave) + baseKey.midiOffset;
      
//       keys.push({
//         ...baseKey,
//         midiNote,
//         edoStep: baseKey.midiOffset,
//         octave: startOctave + octave,
//         isActive: false
//       });
//     });
//   }
  
//   // Добавляем последнюю C для завершения клавиатуры
//   keys.push({
//     note: 'C',
//     isBlack: false,
//     midiOffset: 0,
//     midiNote: 12 * (startOctave + octaves),
//     edoStep: 0,
//     octave: startOctave + octaves,
//     isActive: false
//   });
  
//   return keys;
// }

// // ============================================================
// // Воспроизведение звука и запись нот
// // ============================================================
// // Глобальные переменные
// const playedNotes = [];
// let bestInterpretations = [];
// const allKeys = generateKeys(NUM_OCTAVES, START_OCTAVE);
// let tonicKeyIndex = 0; // По умолчанию тоника - первая C
// let acousticTonicStep = null; // Шаг акустической тоники (относительно C)
// let acousticTonicRatio = null; // Соотношение акустической тоники

// // Инициализация аудио контекста
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// // Инициализация синтезатора
// const synth = JZZ.synth.Tiny();
// JZZ().openMidiOut().connect(synth);

// function playNote(frequency, duration) {
//   const oscillator = audioContext.createOscillator();
//   const gainNode = audioContext.createGain();
//   oscillator.connect(gainNode);
//   gainNode.connect(audioContext.destination);
//   oscillator.type = 'sine';
//   oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
//   gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
//   gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
//   oscillator.start();
//   oscillator.stop(audioContext.currentTime + duration);
// }

// function playMidiNote(midiNote) {
//   const noteOn = JZZ.MIDI.noteOn(0, midiNote, 100);
//   synth.send(noteOn);
//   setTimeout(() => {
//     const noteOff = JZZ.MIDI.noteOff(0, midiNote, 100);
//     synth.send(noteOff);
//   }, 300); // длительность звука 300 мс
// }

// function playNoteByStep(step, midiNote) {
//   // Используем MIDI синтезатор для более качественного звука
//   playMidiNote(midiNote);
  
//   playedNotes.push({
//     edoStep: step % 12,  // Нормализуем до одной октавы
//     midiNote: midiNote,
//     startTime: Date.now() / 1000,
//     duration: 1
//   });
  
//   updatePlayedNotesDisplay();
//   calculateBestInterpretations();
// }

// // Функция получения названия ноты из MIDI номера
// function getNoteName(midiNote) {
//   const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
//   const noteName = noteNames[midiNote % 12];
//   const octave = Math.floor(midiNote / 12) - 1;
//   return `${noteName}${octave}`;
// }

// // Функция перевода полутонов в ноту относительно C
// function getAbsoluteNoteName(step) {
//   const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
//   const normalizedStep = ((step % 12) + 12) % 12; // Нормализуем шаг в пределах октавы
//   const octave = Math.floor(step / 12) + 4; // Базовая октава 4
//   return `${noteNames[normalizedStep]}${octave}`;
// }

// // ============================================================
// // Отображение проигранных нот с учетом функции забывания
// // ============================================================
// function updatePlayedNotesDisplay() {
//   const currentTime = Date.now() / 1000;
//   const forgetTime = parseFloat(document.getElementById('forgetSlider').value);
  
//   const activeNotes = playedNotes
//     .map((note, idx) => ({
//       ...note,
//       index: idx,
//       weight: note.duration * Math.max(0, 1 - (currentTime - note.startTime) / forgetTime)
//     }))
//     .filter(note => note.weight > 0);
  
//   document.getElementById('playedNotes').textContent = activeNotes
//     .map(n => {
//       const noteName = getNoteName(n.midiNote);
//       return `Нота ${noteName}: Полутон ${n.edoStep} (Вес: ${n.weight.toFixed(2)})`;
//     })
//     .join('\n');
// }

// // ============================================================
// // Расчет наилучших JI интерпретаций
// // ============================================================
// function calculateBestInterpretations() {
//   const currentTime = Date.now() / 1000;
//   const forgetTime = parseFloat(document.getElementById('forgetSlider').value);
//   const activeNotes = playedNotes
//     .map(note => ({
//       ...note,
//       weight: note.duration * Math.max(0, 1 - (currentTime - note.startTime) / forgetTime)
//     }))
//     .filter(note => note.weight > 0);

//   if (activeNotes.length < 2) {
//     document.getElementById('bestInterpretations').innerHTML = 
//       '<p>Сыграйте не менее двух нот для получения JI интерпретаций</p>';
//     acousticTonicStep = null;
//     acousticTonicRatio = null;
//     document.getElementById('acoustic-tonic-display').textContent = '-';
//     updateKeyboardJILabels();
//     return;
//   }

//   const interpretations = [];
//   const seen = new Set();

//   // Группируем ноты по шагам, сохраняя индексы
//   const stepGroups = new Map();
//   activeNotes.forEach((note, idx) => {
//     const normalizedStep = note.edoStep % 12;
//     if (!stepGroups.has(normalizedStep)) {
//       stepGroups.set(normalizedStep, []);
//     }
//     stepGroups.get(normalizedStep).push(idx);
//   });

//   // Перебираем уникальные шаги для root и ref
//   const uniqueSteps = Array.from(stepGroups.keys());
//   for (const rootStep of uniqueSteps) {
//     for (const refStep of uniqueSteps) {
//       if (rootStep === refStep) continue;

//       const interval = Math.abs(refStep - rootStep) % 12;
//       const jiOptions = edoStepToJI.get(interval) || [];
      
//       for (const ji of jiOptions) {
//         // Берем первый индекс из каждой группы для root и ref
//         const rootIdx = stepGroups.get(rootStep)[0];
//         const refIdx = stepGroups.get(refStep)[0];
        
//         const noteJIs = Array(activeNotes.length).fill(null);
//         noteJIs[rootIdx] = { num: 1, den: 1 };
        
//         // Заполняем ref ноту
//         noteJIs[refIdx] = refStep > rootStep ? 
//           { num: ji.num, den: ji.den } : 
//           { num: ji.den, den: ji.num };

//         // Заполняем остальные ноты
//         for (let i = 0; i < activeNotes.length; i++) {
//           if (i === rootIdx || i === refIdx) continue;
          
//           const step = activeNotes[i].edoStep % 12;
//           const intervalToRoot = Math.abs(step - rootStep) % 12;
//           const jiOptionsToRoot = edoStepToJI.get(intervalToRoot) || [];
          
//           if (jiOptionsToRoot.length > 0) {
//             let bestConsonance = -1;
//             let bestJI = null;
            
//             jiOptionsToRoot.forEach(option => {
//               const cons = consonance(option.num, option.den);
//               if (cons > bestConsonance) {
//                 bestConsonance = cons;
//                 bestJI = step > rootStep ? 
//                   { num: option.num, den: option.den } : 
//                   { num: option.den, den: option.num };
//               }
//             });
            
//             noteJIs[i] = bestJI;
//           }
//         }

//         // Проверка на валидность и уникальность
//         if (noteJIs.some(ji => !ji)) continue;
//         const key = noteJIs.map(ji => `${ji.num}/${ji.den}`).join('|');
//         if (seen.has(key)) continue;
//         seen.add(key);

//         // Расчет консонанса
//         let totalConsonance = 0;
//         let totalWeight = 0;
        
//         for (let i = 0; i < activeNotes.length; i++) {
//           for (let j = i + 1; j < activeNotes.length; j++) {
//             const num = noteJIs[j].num * noteJIs[i].den;
//             const den = noteJIs[j].den * noteJIs[i].num;
//             const c = consonance(num, den);
//             const weight = activeNotes[i].weight * activeNotes[j].weight;
//             totalConsonance += c * weight;
//             totalWeight += weight;
//           }
//         }
        
//         interpretations.push({
//           consonance: totalWeight > 0 ? totalConsonance / totalWeight : 0,
//           noteJIs,
//           rootStep,
//           refStep,
//           activeNotes
//         });
//       }
//     }
//   }

//   bestInterpretations = interpretations
//     .sort((a, b) => b.consonance - a.consonance)
//     .slice(0, 3);

//   updateBestInterpretations();
//   updateKeyboardJILabels();
// }

// // Обновление отображения лучших интерпретаций
// function updateBestInterpretations() {
//   if (bestInterpretations.length === 0) {
//     document.getElementById('bestInterpretations').innerHTML = 
//       '<p>Нет доступных JI интерпретаций</p>';
//     return;
//   }
  
//   document.getElementById('bestInterpretations').innerHTML = bestInterpretations
//     .map((interpretation, index) => {
//       const rootNoteName = getNoteName(interpretation.activeNotes[interpretation.activeNotes.findIndex(
//         (note, idx) => interpretation.noteJIs[idx].num === 1 && interpretation.noteJIs[idx].den === 1
//       )].midiNote);
      
//       // Собираем уникальные интервалы для расчета акустической тоники
//       const uniqueRatios = Array.from(new Set(interpretation.noteJIs.map(ji => 
//         `${ji.num}/${ji.den}`
//       ))).map(s => {
//         const [a, b] = s.split('/').map(Number);
//         return { a, b };
//       });
      
//       // Вычисляем акустическую тонику
//       const tonicRatio = gcdRationals(...uniqueRatios);
//       const tonicCents = ratioToCents(tonicRatio);
//       const tonicSteps = Math.round(tonicCents / (1200 / 12)); // Округление до целых
      
//       // Обновляем глобальные переменные акустической тоники для главной интерпретации
//       if (index === 0) {
//         acousticTonicStep = tonicSteps;
//         acousticTonicRatio = tonicRatio;
//         document.getElementById('acoustic-tonic-display').textContent = 
//           `${tonicRatio.a}/${tonicRatio.b} (${getAbsoluteNoteName(tonicSteps)})`;
//       }
      
//       return `
//         <div class="interpretation">
//           <div class="interpretation-header">
//             #${index + 1} Консонанс: ${interpretation.consonance.toFixed(4)}
//           </div>
//           <div>Тоника: ${rootNoteName} (1/1)</div>
//           <div>Акустическая тоника: ${tonicRatio.a}/${tonicRatio.b} ≈ ${getAbsoluteNoteName(tonicSteps)}</div>
//           <div class="note-mapping">
//             ${interpretation.activeNotes.map((note, idx) => {
//               const noteName = getNoteName(note.midiNote);
//               return `${noteName} → ${interpretation.noteJIs[idx].num}/${interpretation.noteJIs[idx].den}`;
//             }).join('<br>')}
//           </div>
//         </div>
//       `;
//     })
//     .join('');
// }

// // ============================================================
// // Настройка canvas для клавиатуры
// // ============================================================
// const canvasHeightUnits = Math.max(WHITE_KEY_HEIGHT, BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT);
// const canvas = document.getElementById('keyboard-canvas');
// canvas.width = (allKeys.length / 12) * 12 * xScale;
// canvas.height = canvasHeightUnits * yScale;
// const ctx = canvas.getContext('2d');

// // ============================================================
// // Построение полигонов для клавиш
// // ============================================================
// function buildPolygons() {
//   for (let i = 0; i < allKeys.length; i++) {
//     const key = allKeys[i];
//     if (key.isBlack) {
//       // Чёрная клавиша: прямоугольник от y = 0 до y = BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT
//       key.polygon = [
//         { x: i,     y: 0 },
//         { x: i+1,   y: 0 },
//         { x: i+1,   y: BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT },
//         { x: i,     y: BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT }
//       ];
//     } else {
//       // Белая клавиша: многоугольник с расширением снизу, если рядом есть чёрная клавиша
//       let leftExpand  = 0;
//       let rightExpand = 0;
//       if (i > 0 && allKeys[i-1].isBlack) {
//         leftExpand = 0.5;
//       }
//       if (i < allKeys.length - 1 && allKeys[i+1].isBlack) {
//         rightExpand = 0.5;
//       }
//       key.polygon = [
//         { x: i,                y: 0 },
//         { x: i+1,              y: 0 },
//         { x: i+1,              y: 1 },
//         { x: i+1 + rightExpand,y: 1 },
//         { x: i+1 + rightExpand,y: WHITE_KEY_HEIGHT },
//         { x: i - leftExpand,   y: WHITE_KEY_HEIGHT },
//         { x: i - leftExpand,   y: 1 },
//         { x: i,                y: 1 }
//       ];
//     }
//   }
// }

// // ============================================================
// // Функция обновления JI-соотношений для клавиш на основе лучшей интерпретации
// // ============================================================
// function updateKeyboardJILabels() {
//   // Сначала сбрасываем все JI отношения и акустическую тонику
//   allKeys.forEach(key => {
//     key.jiRatio = null;
//     key.isAcousticTonic = false;
//   });
  
//   if (bestInterpretations.length === 0) {
//     drawAll();
//     return;
//   }
  
//   // Берем лучшую интерпретацию
//   const bestInterpretation = bestInterpretations[0];
  
//   // Находим индекс корневой ноты (тоники) в активных нотах
//   const rootNoteIdx = bestInterpretation.activeNotes.findIndex(
//     (note, idx) => bestInterpretation.noteJIs[idx].num === 1 && bestInterpretation.noteJIs[idx].den === 1
//   );
  
//   if (rootNoteIdx === -1) return;
  
//   // Получаем MIDI номер тоники
//   const rootMidiNote = bestInterpretation.activeNotes[rootNoteIdx].midiNote;
  
//   // Находим индекс клавиши, соответствующей тонике
//   const rootKeyIdx = allKeys.findIndex(key => key.midiNote === rootMidiNote);
//   tonicKeyIndex = rootKeyIdx;
  
//   // Устанавливаем тонику в информационное поле
//   document.getElementById('tonic-display').textContent = getNoteName(rootMidiNote);
  
//   // Для каждой активной ноты в интерпретации
//   bestInterpretation.activeNotes.forEach((note, noteIdx) => {
//     const jiRatio = bestInterpretation.noteJIs[noteIdx];
    
//     // Находим все клавиши с соответствующим edoStep относительно тоники
//     const relativeEdoStep = (note.edoStep - bestInterpretation.activeNotes[rootNoteIdx].edoStep + 12) % 12;
    
//     allKeys.forEach(key => {
//       const keyRelativeEdoStep = (key.edoStep - allKeys[rootKeyIdx].edoStep + 12) % 12;
//       if (keyRelativeEdoStep === relativeEdoStep) {
//         // Применяем корректировку JI соотношения в зависимости от октавы
//         const octaveShift = Math.floor((key.midiNote - rootMidiNote) / 12);
//         const adjustedNumerator = jiRatio.num * Math.pow(2, octaveShift);
//         key.jiRatio = { numerator: adjustedNumerator, denominator: jiRatio.den };
//       }
//     });
//   });
  
//   // Помечаем клавиши, соответствующие акустической тонике
//   if (acousticTonicStep !== null) {
//     allKeys.forEach(key => {
//       // Если шаг клавиши % 12 соответствует шагу акустической тоники % 12
//       if ((key.edoStep % 12) === ((acousticTonicStep % 12) + 12) % 12) {
//         key.isAcousticTonic = true;
//       }
//     });
//   }
  
//   // Перерисовываем клавиатуру с обновленными JI отношениями
//   drawAll();
// }

// // ============================================================
// // Отрисовка клавиш
// // ============================================================
// function drawAll() {
//   ctx.fillStyle = '#21252b';
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   // Сначала белые клавиши (сзади)
//   for (let i = 0; i < allKeys.length; i++) {
//     if (!allKeys[i].isBlack) {
//       drawKey(allKeys[i], i === tonicKeyIndex);
//     }
//   }
//   // Затем черные (сверху)
//   for (let i = 0; i < allKeys.length; i++) {
//     if (allKeys[i].isBlack) {
//       drawKey(allKeys[i], i === tonicKeyIndex);
//     }
//   }
// }

// function drawKey(key, isTonic = false) {
//   let polygonPx = key.polygon.map(pt => ({
//     x: pt.x * xScale,
//     y: pt.y * yScale
//   }));

//   // Рисуем основную форму клавиши
//   ctx.beginPath();
//   ctx.moveTo(polygonPx[0].x, polygonPx[0].y);
//   for (let i = 1; i < polygonPx.length; i++) {
//     ctx.lineTo(polygonPx[i].x, polygonPx[i].y);
//   }
//   ctx.closePath();

//   // Заливаем клавишу градиентом
//   if (key.isBlack) {
//     let grad = ctx.createLinearGradient(0, polygonPx[0].y, 0, polygonPx[2].y);
//     grad.addColorStop(0, '#444');
//     grad.addColorStop(1, '#000');
//     ctx.fillStyle = grad;
//   } else {
//     let grad = ctx.createLinearGradient(0, 0, 0, WHITE_KEY_HEIGHT * yScale);
//     grad.addColorStop(0, '#fff');
//     grad.addColorStop(1, '#bbb');
//     ctx.fillStyle = grad;
//   }
//   ctx.fill();

//   // Показываем акустическую тонику (перед активным состоянием, чтобы активное было сверху)
//   if (key.isAcousticTonic) {
//     ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--tonic-color');
//     ctx.beginPath();
//     ctx.moveTo(polygonPx[0].x, polygonPx[0].y);
//     for (let i = 1; i < polygonPx.length; i++) {
//       ctx.lineTo(polygonPx[i].x, polygonPx[i].y);
//     }
//     ctx.closePath();
//     ctx.fill();
//   }

//   // Показываем активное состояние (нажатие)
//   if (key.isActive) {
//     ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--active-color');
//     ctx.beginPath();
//     ctx.moveTo(polygonPx[0].x, polygonPx[0].y);
//     for (let i = 1; i < polygonPx.length; i++) {
//       ctx.lineTo(polygonPx[i].x, polygonPx[i].y);
//     }
//     ctx.closePath();
//     ctx.fill();
//   }
  
//   // Показываем тонику
//   if (isTonic) {
//     ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--root-color');
//     ctx.beginPath();
//     ctx.moveTo(polygonPx[0].x, polygonPx[0].y);
//     for (let i = 1; i < polygonPx.length; i++) {
//       ctx.lineTo(polygonPx[i].x, polygonPx[i].y);
//     }
//     ctx.closePath();
//     ctx.fill();
//   }

//   // Рисуем обводку клавиши
//   ctx.strokeStyle = '#000';
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(polygonPx[0].x, polygonPx[0].y);
//   for (let i = 1; i < polygonPx.length; i++) {
//     ctx.lineTo(polygonPx[i].x, polygonPx[i].y);
//   }
//   ctx.closePath();
//   ctx.stroke();
  
//   // Рисуем JI соотношение, если оно есть
//   if (key.jiRatio) {
//     // Рассчитываем консонантность
//     const cons = consonance(key.jiRatio.numerator, key.jiRatio.denominator);
//     const color = getColorFromConsonance(cons);
    
//     // Вычисляем центр клавиши для позиционирования метки
//     let centerX = 0;
//     for (let pt of polygonPx) {
//       centerX += pt.x;
//     }
//     centerX /= polygonPx.length;
    
//     // Определяем позицию метки по Y в зависимости от типа клавиши
//     const labelY = key.isBlack
//       ? BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT * yScale * LABEL_BLACK_POS_Y
//       : WHITE_KEY_HEIGHT * yScale * LABEL_WHITE_POS_Y;
    
//     // Рисуем фоновый овал с цветом, зависящим от консонантности
//     ctx.beginPath();
//     ctx.fillStyle = color;
//     ctx.ellipse(centerX, labelY, LABEL_RADIUS_X, LABEL_RADIUS_Y, 0, 0, Math.PI * 2);
//     ctx.fill();
    
//     // Рисуем дробь (соотношение)
//     const label = new FractionLabel(key.jiRatio.numerator, key.jiRatio.denominator);
//     label.draw(ctx, centerX, labelY);
//   }
// }

// // ============================================================
// // Обработка событий мыши
// // ============================================================
// function updateActiveKey(evt) {
//   const rect = canvas.getBoundingClientRect();
//   const mouseX = evt.clientX - rect.left;
//   const mouseY = evt.clientY - rect.top;
  
//   // Сначала ищем черную клавишу (она сверху)
//   let newActiveKey = null;
//   for (let i = 0; i < allKeys.length; i++) {
//     if (allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
//       newActiveKey = i;
//       break;
//     }
//   }
  
//   // Если не нашли черную, ищем белую
//   if (newActiveKey === null) {
//     for (let i = 0; i < allKeys.length; i++) {
//       if (!allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
//         newActiveKey = i;
//         break;
//       }
//     }
//   }
  
//   let changed = false;
//   if (newActiveKey !== null) {
//     for (let i = 0; i < allKeys.length; i++) {
//       if (i === newActiveKey) {
//         if (!allKeys[i].isActive) {
//           allKeys[i].isActive = true;
//           playNoteByStep(allKeys[i].edoStep, allKeys[i].midiNote);
//           changed = true;
//         }
//       } else {
//         if (allKeys[i].isActive) {
//           allKeys[i].isActive = false;
//           changed = true;
//         }
//       }
//     }
//   }
  
//   if (changed) {
//     drawAll();
//   }
// }

// canvas.addEventListener('mousedown', (evt) => {
//   if (evt.button === 0) { // Левая кнопка - играем ноту
//     updateActiveKey(evt);
//   } else if (evt.button === 2) { // Правая кнопка - устанавливаем тонику
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = evt.clientX - rect.left;
//     const mouseY = evt.clientY - rect.top;
    
//     // Находим клавишу под курсором
//     for (let i = 0; i < allKeys.length; i++) {
//       if (allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
//         tonicKeyIndex = i;
//         document.getElementById('tonic-display').textContent = 
//           `${allKeys[i].note}${allKeys[i].octave}`;
//         drawAll();
//         break;
//       }
//     }
    
//     // Если не нашли черную, ищем белую
//     for (let i = 0; i < allKeys.length; i++) {
//       if (!allKeys[i].isBlack && pointInPolygon(mouseX, mouseY, allKeys[i].polygon)) {
//         tonicKeyIndex = i;
//         document.getElementById('tonic-display').textContent = 
//           `${allKeys[i].note}${allKeys[i].octave}`;
//         drawAll();
//         break;
//       }
//     }
//   }
// });

// // При движении мыши с зажатой кнопкой обновляем активную клавишу
// canvas.addEventListener('mousemove', (evt) => {
//   if (evt.buttons === 1) {
//     updateActiveKey(evt);
//   }
// });

// // При отпускании кнопки мыши -- снимаем активность всех клавиш
// canvas.addEventListener('mouseup', () => {
//   allKeys.forEach(key => key.isActive = false);
//   drawAll();
// });

// // Если курсор уходит с canvas -- сбрасываем активность
// canvas.addEventListener('mouseleave', () => {
//   allKeys.forEach(key => key.isActive = false);
//   drawAll();
// });

// // Предотвращаем появление контекстного меню при правом клике
// canvas.addEventListener('contextmenu', (evt) => {
//   evt.preventDefault();
// });

// // ============================================================
// // Функция проверки попадания точки в многоугольник (алгоритм "ray casting")
// // ============================================================
// function pointInPolygon(px, py, polygon) {
//   let polyPx = polygon.map(pt => ({ x: pt.x * xScale, y: pt.y * yScale }));
//   let inside = false;
//   for (let i = 0, j = polyPx.length - 1; i < polyPx.length; j = i++) {
//     const xi = polyPx[i].x, yi = polyPx[i].y;
//     const xj = polyPx[j].x, yj = polyPx[j].y;
//     const intersect = ((yi > py) !== (yj > py)) &&
//                       (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
//     if (intersect) inside = !inside;
//   }
//   return inside;
// }

// // ============================================================
// // Обработчик изменения слайдера функции забывания
// // ============================================================
// function setupSlider() {
//   document.getElementById('forgetSlider').oninput = function() {
//     document.getElementById('forgetValue').textContent = this.value;
//     updatePlayedNotesDisplay();
//     calculateBestInterpretations();
//   };
// }

// // ============================================================
// // Функция периодического обновления для учета "забывания"
// // ============================================================
// function periodicUpdate() {
//   updatePlayedNotesDisplay();
//   calculateBestInterpretations();
//   setTimeout(periodicUpdate, 1000); // Обновляем каждую секунду
// }

// // ============================================================
// // Инициализация
// // ============================================================
// function init() {
//   generateIntervals();
//   buildPolygons();
//   setupSlider();
//   drawAll();
  
//   // Запускаем периодическое обновление
//   periodicUpdate();
// }

// // Запуск приложения при загрузке страницы
// window.onload = init;
