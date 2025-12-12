'use strict';

/* ================= CONFIG ================= */
const BEAM_WIDTH = 50;   
const MAX_CANDS = 6;     
const VISUAL_GHOSTS = 3;
const CENTS_THRESHOLD = 35; 
const PRIME_LIMIT = 7;  // Отсекаем 11-limit и выше

// Базовая частота для расчёта Hz (A4 = 440Hz)
const A4_FREQ = 440;
const A4_MIDI = 69;

/**
 * Конвертация частоты в ближайшую MIDI ноту и центы отклонения
 */
function freqToNoteInfo(freq) {
    if (freq <= 0) return null;
    const midiFloat = A4_MIDI + 12 * Math.log2(freq / A4_FREQ);
    const midi = Math.round(midiFloat);
    const cents = Math.round((midiFloat - midi) * 100);
    const octave = Math.floor(midi / 12) - 1;
    const noteName = jiLib.getNoteName(midi);
    return {
        midi,
        noteName,
        octave,
        cents,
        display: `${noteName}${octave}${cents !== 0 ? (cents > 0 ? '+' : '') + cents + '¢' : ''}`
    };
}

const State = {
    allKeys: [],
    playedNotes: [], 
    tonicKeyIndex: null,
    lastTonicIndex: null,  // Для hysteresis
    intervalCandidates: new Map(), 
    
    config: {
        maxOdd: 45,
        autoTonic: true,
        useLCM: true,
        useGCD: true,
        gcdWeight: 1.5,      // Вес GCD (1.0 = равный, 2.0 = GCD вдвое важнее)
        hysteresis: 0.2      // Порог смены тоники (0 = без hysteresis, 0.5 = нужно 50% улучшение)
    }
};

const UI = {
    playedPre: document.getElementById('playedNotes'),
    perfRes: document.getElementById('perfResult'),
    lcmValue: document.getElementById('lcmValue'),
    gcdValue: document.getElementById('gcdValue'),
    fundamentalInfo: document.getElementById('fundamentalInfo'),
    lcmInfo: document.getElementById('lcmInfo'),
    gcdInfo: document.getElementById('gcdInfo'),
    inputs: {
        maxDenom: document.getElementById('maxDenom'),
        autoTonic: document.getElementById('flagAutoTonic'),
        lcm: document.getElementById('flagLCM'),
        gcd: document.getElementById('flagGCD'),
        gcdWeight: document.getElementById('gcdWeight'),
        gcdWeightVal: document.getElementById('gcdWeightVal'),
        hysteresis: document.getElementById('hysteresis'),
        hysteresisVal: document.getElementById('hysteresisVal'),
        perfBtn: document.getElementById('perfButton')
    }
};

/* ================= INIT ================= */

function init() {
    if (window.Keyboard) {
        Keyboard.init('keyboard-canvas', 2, 3, {
            onToggleKey: () => scheduleUpdate(),
            onSetTonic: (idx) => { 
                State.tonicKeyIndex = idx;
                State.lastTonicIndex = idx;
                scheduleUpdate(); 
            }
        });
        State.allKeys = Keyboard.allKeys;
    }

    UI.inputs.maxDenom.addEventListener('change', () => { 
        generateCandidates(); 
        scheduleUpdate(); 
    });
    
    UI.inputs.autoTonic.addEventListener('change', () => {
        if (UI.inputs.autoTonic.checked) {
            State.allKeys.forEach(k => k.isTonic = false);
            State.tonicKeyIndex = null;
        }
        scheduleUpdate();
    });
    
    UI.inputs.lcm.addEventListener('change', scheduleUpdate);
    UI.inputs.gcd.addEventListener('change', scheduleUpdate);
    
    // GCD Weight slider
    if (UI.inputs.gcdWeight) {
        UI.inputs.gcdWeight.addEventListener('input', () => {
            State.config.gcdWeight = parseFloat(UI.inputs.gcdWeight.value);
            if (UI.inputs.gcdWeightVal) {
                UI.inputs.gcdWeightVal.textContent = State.config.gcdWeight.toFixed(1);
            }
            scheduleUpdate();
        });
    }
    
    // Hysteresis slider
    if (UI.inputs.hysteresis) {
        UI.inputs.hysteresis.addEventListener('input', () => {
            State.config.hysteresis = parseFloat(UI.inputs.hysteresis.value);
            if (UI.inputs.hysteresisVal) {
                UI.inputs.hysteresisVal.textContent = Math.round(State.config.hysteresis * 100) + '%';
            }
            scheduleUpdate();
        });
    }
    
    if (UI.inputs.perfBtn) {
        UI.inputs.perfBtn.addEventListener('click', runBenchmark);
    }

    generateCandidates();
    scheduleUpdate();
}

/* ================= DEBOUNCED UPDATE ================= */

let pendingUpdate = false;

function scheduleUpdate() {
    if (!pendingUpdate) {
        pendingUpdate = true;
        requestAnimationFrame(() => {
            pendingUpdate = false;
            update();
        });
    }
}

/* ================= GENERATION ================= */

function generateCandidates() {
    State.intervalCandidates.clear();
    const maxOdd = parseInt(UI.inputs.maxDenom.value) || 45;
    State.config.maxOdd = maxOdd;

    for (let d = 1; d <= maxOdd; d++) {
        for (let n = d; n < d * 2; n++) { 
            if (jiLib.getOddPart(n) > maxOdd || jiLib.getOddPart(d) > maxOdd) continue;
            if (jiLib.gcd(n, d) !== 1) continue;
            
            // Prime Limit фильтр
            const maxPrime = Math.max(jiLib.getMaxPrime(n), jiLib.getMaxPrime(d));
            if (maxPrime > PRIME_LIMIT) continue;

            const cents = jiLib.ratioToCents({num: n, den: d});
            let step = Math.round(cents / 100);
            const deviation = Math.abs(cents - step * 100);
            
            if (deviation > CENTS_THRESHOLD) continue;
            if (step === 12) step = 0;

            if (!State.intervalCandidates.has(step)) State.intervalCandidates.set(step, []);
            
            const list = State.intervalCandidates.get(step);
            const exists = list.some(c => c.num === n && c.den === d);
            
            if (!exists) {
                list.push({ 
                    num: n, 
                    den: d, 
                    weight: jiLib.eulerGradus(n, d) 
                });
            }
        }
    }

    for (let [s, arr] of State.intervalCandidates) {
        arr.sort((a, b) => a.weight - b.weight);
        if (arr.length > MAX_CANDS) arr.length = MAX_CANDS; 
    }
}

/* ================= UPDATE LOOP ================= */

function update() {
    State.config.autoTonic = UI.inputs.autoTonic.checked;
    State.config.useLCM = UI.inputs.lcm.checked;
    State.config.useGCD = UI.inputs.gcd.checked;

    State.playedNotes = State.allKeys
        .map((k, i) => ({ k, i, midi: k.midiNote }))
        .filter(obj => obj.k.isActive)
        .map(obj => ({
            keyIndex: obj.i,
            midi: obj.midi,
            step: obj.k.edoStep
        }));

    let tonicOptions = [];
    if (State.config.autoTonic) {
        if (State.playedNotes.length > 0) {
            tonicOptions = State.playedNotes.map(n => n.keyIndex);
        } else if (State.tonicKeyIndex !== null) {
            tonicOptions = [State.tonicKeyIndex];
        }
    } else {
        if (State.tonicKeyIndex !== null) {
            tonicOptions = [State.tonicKeyIndex];
        } else {
            applyVisuals(new Map());
            updateLCMGCDDisplay(null, null, null);
            if (UI.playedPre) UI.playedPre.textContent = "Right-click to set tonic";
            if (window.Keyboard) {
                Keyboard.hintData = { colors: [], lcmKeys: [], gcdKeys: [] };
            }
            return;
        }
    }

    let result = { 
        map: new Map(), 
        score: 1.0, 
        tonicIndex: null, 
        analysisMap: new Map(),
        lcmValue: null,
        gcdValue: null,
        gcdHz: null,
        lcmHz: null,
        lcmKeys: [],
        gcdKeys: []
    };
    
    if (tonicOptions.length > 0) {
        result = solveGlobal(State.playedNotes, tonicOptions);
    }

    renderText(result.map, result.tonicIndex);
    updateLCMGCDDisplay(result);
    
    const { visualData, hintColors } = mapAnalysisToVisuals(result.analysisMap, result.map, result.tonicIndex);
    applyVisuals(visualData);
    
    // Передаём hint data в Keyboard
    if (window.Keyboard) {
        Keyboard.hintData = {
            colors: hintColors,
            lcmKeys: result.lcmKeys || [],
            gcdKeys: result.gcdKeys || []
        };
    }
}

/* ================= LCM/GCD DISPLAY ================= */

function updateLCMGCDDisplay(result) {
    if (UI.lcmValue) {
        UI.lcmValue.textContent = (result.lcmValue !== null) ? result.lcmValue : '—';
    }
    if (UI.gcdValue) {
        UI.gcdValue.textContent = (result.gcdValue !== null) ? result.gcdValue : '—';
    }
    
    // LCM info (Cover - высокая нота)
    if (UI.lcmInfo) {
        if (result.lcmHz !== null) {
            const noteInfo = freqToNoteInfo(result.lcmHz);
            UI.lcmInfo.textContent = noteInfo 
                ? `${result.lcmHz.toFixed(1)}Hz ≈ ${noteInfo.display}`
                : `${result.lcmHz.toFixed(1)}Hz`;
        } else {
            UI.lcmInfo.textContent = '';
        }
    }
    
    // GCD info (Fundamental - низкая нота)  
    if (UI.gcdInfo) {
        if (result.gcdHz !== null) {
            const noteInfo = freqToNoteInfo(result.gcdHz);
            UI.gcdInfo.textContent = noteInfo 
                ? `${result.gcdHz.toFixed(1)}Hz ≈ ${noteInfo.display}`
                : `${result.gcdHz.toFixed(1)}Hz`;
        } else {
            UI.gcdInfo.textContent = '';
        }
    }
}

/* ================= VISUAL MAPPING ================= */

function mapAnalysisToVisuals(analysisMap, solutionMap, tonicIndex) {
    const visuals = new Map();
    const hintColors = new Array(State.allKeys.length).fill(null);

    analysisMap.forEach((candidatesData, keyIndex) => {
        if (!candidatesData || candidatesData.length === 0) return;

        const isActive = State.allKeys[keyIndex].isActive;
        const isTonic = (keyIndex === tonicIndex);
        
        // Лучший score
        let minScore = Infinity;
        for (const c of candidatesData) {
            if (c.score < minScore) minScore = c.score;
        }

        // Hint color для ВСЕХ клавиш (и активных, и неактивных)
        const best = candidatesData[0];
        const gradus = jiLib.eulerGradus(best.num, best.den);
        // Hue: 120 (зелёный) для простых, 0 (красный) для сложных
        const hue = Math.max(0, Math.min(120, 120 - (gradus - 3) * 8));
        // Alpha: активные ярче, неактивные тусклее
        let alpha = isActive ? 0.85 : 0.45;
        if (isTonic) alpha = 1.0;
        hintColors[keyIndex] = { hue, alpha };

        const items = candidatesData.map((c, idx) => {
            const isSelected = solutionMap.has(keyIndex) && 
                (solutionMap.get(keyIndex).num === c.num && 
                 solutionMap.get(keyIndex).den === c.den);

            let alpha = 0;

            if (isSelected) {
                alpha = 1.0;
            } else if (isActive) {
                // Альтернативы для активных нот
                if (idx < 4) {
                    const ratio = (minScore > 0 && c.score > 0) ? minScore / c.score : 1;
                    alpha = 0.25 + 0.35 * ratio;
                }
            } else {
                // Призраки
                if (idx < VISUAL_GHOSTS) {
                    const ratio = (minScore > 0 && c.score > 0) ? minScore / c.score : 1;
                    alpha = 0.4 * Math.pow(ratio, 2);
                }
            }

            if (alpha < 0.08) alpha = 0;

            return { num: c.num, den: c.den, alpha: alpha };
        });

        visuals.set(keyIndex, items);
    });

    return { visualData: visuals, hintColors };
}

/* ================= SOLVER ================= */

function solveGlobal(notes, possibleTonics) {
    let bestGlobalScore = Infinity;
    let bestGlobalMap = new Map();
    let bestTonicIdx = null;
    let bestLCM = null;
    let bestGCD = null;
    let gcdHz = null;
    let lcmHz = null;
    let lcmKeys = [];
    let gcdKeys = [];
    
    const activeTonics = (notes.length === 0 && possibleTonics.length > 0) 
        ? [possibleTonics[0]] 
        : possibleTonics;

    // Сохраняем score текущей тоники для hysteresis
    let currentTonicScore = Infinity;

    for (let tIdx of activeTonics) {
        const tonicKey = State.allKeys[tIdx];
        if (!tonicKey) continue;

        const problemSpace = notes.map(n => {
            if (n.keyIndex === tIdx) return [{ num: 1, den: 1, key: n.keyIndex }];
            
            const relStep = (n.step - tonicKey.edoStep + 12) % 12;
            const octShift = Math.floor((n.midi - tonicKey.midiNote) / 12);
            const rawCands = State.intervalCandidates.get(relStep) || [];
            
            if (rawCands.length === 0) return [{ num: 1, den: 1, key: n.keyIndex }];

            return rawCands.map(c => {
                const r = jiLib.adjustRatioOctave({num: c.num, den: c.den}, octShift);
                return { num: r.num, den: r.den, key: n.keyIndex };
            });
        });

        if (problemSpace.length === 0) {
            if (1 < bestGlobalScore) {
                bestGlobalScore = 1;
                bestTonicIdx = tIdx;
                bestGlobalMap = new Map();
            }
            continue;
        }

        // Beam Search
        let beam = [{ ratios: [], score: 1 }]; 
        for (let i = 0; i < problemSpace.length; i++) {
            const layerCands = problemSpace[i];
            const nextBeam = [];
            for (let beamNode of beam) {
                for (let cand of layerCands) {
                    const newRatios = [...beamNode.ratios, cand];
                    const complexity = jiLib.computeWeightedComplexity(
                        newRatios, 
                        State.config.useLCM, 
                        State.config.useGCD,
                        State.config.gcdWeight
                    );
                    nextBeam.push({ ratios: newRatios, score: complexity });
                }
            }
            nextBeam.sort((a, b) => a.score - b.score);
            beam = nextBeam.slice(0, BEAM_WIDTH);
        }

        if (beam.length > 0) {
            const bestLocal = beam[0];
            
            // Hysteresis: если это текущая тоника, сохраняем её score
            if (tIdx === State.lastTonicIndex) {
                currentTonicScore = bestLocal.score;
            }
            
            if (bestLocal.score < bestGlobalScore) {
                bestGlobalScore = bestLocal.score;
                bestTonicIdx = tIdx;
                const m = new Map();
                bestLocal.ratios.forEach(r => m.set(r.key, r));
                bestGlobalMap = m;
            }
        }
    }

    // Hysteresis: не менять тонику если улучшение меньше порога
    if (State.lastTonicIndex !== null && 
        bestTonicIdx !== State.lastTonicIndex && 
        State.config.hysteresis > 0) {
        
        const improvement = 1 - (bestGlobalScore / currentTonicScore);
        if (improvement < State.config.hysteresis && currentTonicScore < Infinity) {
            // Возвращаем старую тонику
            bestTonicIdx = State.lastTonicIndex;
            // Пересчитываем map для старой тоники
            const oldResult = solveForTonic(notes, State.lastTonicIndex);
            bestGlobalMap = oldResult.map;
            bestGlobalScore = oldResult.score;
        }
    }
    
    // Обновляем lastTonicIndex
    if (bestTonicIdx !== null) {
        State.lastTonicIndex = bestTonicIdx;
    }

    // Compute LCM/GCD для отображения
    if (bestGlobalMap.size > 0 && bestTonicIdx !== null) {
        const ratios = Array.from(bestGlobalMap.values());
        const nums = ratios.map(r => r.num);
        const dens = ratios.map(r => r.den);
        bestLCM = jiLib.lcmArray(nums);
        bestGCD = jiLib.gcdArray(dens);
        
        // Частота тоники
        const tonicMidi = State.allKeys[bestTonicIdx].midiNote;
        const tonicHz = A4_FREQ * Math.pow(2, (tonicMidi - A4_MIDI) / 12);
        
        // GCD (Fundamental) - низкая нота: тоника / LCM(nums)
        // Это частота, где все числители совпадают
        gcdHz = tonicHz / bestLCM;
        
        // LCM (Cover) - высокая нота: тоника * LCM(nums) / GCD(nums)
        // Упрощаем: показываем период = тоника * LCM / GCD
        const gcdNums = jiLib.gcdArray(nums);
        lcmHz = tonicHz * bestLCM / gcdNums;
        
        // Находим клавиши, соответствующие этим частотам (в пределах клавиатуры)
        gcdKeys = findKeysForFreq(gcdHz);
        lcmKeys = findKeysForFreq(lcmHz);
    }

    // Contextual Analysis
    const analysisMap = new Map();

    if (bestTonicIdx !== null) {
        const tonicKey = State.allKeys[bestTonicIdx];
        const optimalRatios = Array.from(bestGlobalMap.values());

        for (let i = 0; i < State.allKeys.length; i++) {
            const key = State.allKeys[i];
            
            if (i === bestTonicIdx) {
                analysisMap.set(i, [{num: 1, den: 1, score: bestGlobalScore}]);
                continue;
            }

            const relStep = (key.edoStep - tonicKey.edoStep + 12) % 12;
            const octShift = Math.floor((key.midiNote - tonicKey.midiNote) / 12);
            const rawCands = State.intervalCandidates.get(relStep);

            if (!rawCands || rawCands.length === 0) continue;

            let context = optimalRatios;
            if (bestGlobalMap.has(i)) {
                context = optimalRatios.filter(r => r.key !== i);
            }

            const scoredCands = rawCands.map(c => {
                const r = jiLib.adjustRatioOctave({num: c.num, den: c.den}, octShift);
                const testSet = [...context, { num: r.num, den: r.den }];
                const score = jiLib.computeWeightedComplexity(
                    testSet, 
                    State.config.useLCM, 
                    State.config.useGCD,
                    State.config.gcdWeight
                );
                return { num: r.num, den: r.den, score: score };
            });

            analysisMap.set(i, scoredCands);
        }
    }

    return { 
        map: bestGlobalMap, 
        score: bestGlobalScore, 
        tonicIndex: bestTonicIdx,
        analysisMap: analysisMap,
        lcmValue: bestLCM,
        gcdValue: bestGCD,
        gcdHz: gcdHz,
        lcmHz: lcmHz,
        lcmKeys: lcmKeys,
        gcdKeys: gcdKeys
    };
}

/**
 * Найти индексы клавиш, соответствующих частоте (во всех октавах)
 */
function findKeysForFreq(freq) {
    if (!freq || freq <= 0) return [];
    
    const keys = [];
    const midiFloat = A4_MIDI + 12 * Math.log2(freq / A4_FREQ);
    const baseMidi = Math.round(midiFloat);
    const step = baseMidi % 12;
    
    // Находим все клавиши с этим step
    State.allKeys.forEach((key, idx) => {
        if (key.edoStep === step) {
            keys.push(idx);
        }
    });
    
    return keys;
}

/**
 * Вспомогательная функция для пересчёта с конкретной тоникой
 */
function solveForTonic(notes, tonicIdx) {
    const tonicKey = State.allKeys[tonicIdx];
    if (!tonicKey) return { map: new Map(), score: Infinity };

    const problemSpace = notes.map(n => {
        if (n.keyIndex === tonicIdx) return [{ num: 1, den: 1, key: n.keyIndex }];
        
        const relStep = (n.step - tonicKey.edoStep + 12) % 12;
        const octShift = Math.floor((n.midi - tonicKey.midiNote) / 12);
        const rawCands = State.intervalCandidates.get(relStep) || [];
        
        if (rawCands.length === 0) return [{ num: 1, den: 1, key: n.keyIndex }];

        return rawCands.map(c => {
            const r = jiLib.adjustRatioOctave({num: c.num, den: c.den}, octShift);
            return { num: r.num, den: r.den, key: n.keyIndex };
        });
    });

    if (problemSpace.length === 0) {
        return { map: new Map(), score: 1 };
    }

    let beam = [{ ratios: [], score: 1 }]; 
    for (let i = 0; i < problemSpace.length; i++) {
        const layerCands = problemSpace[i];
        const nextBeam = [];
        for (let beamNode of beam) {
            for (let cand of layerCands) {
                const newRatios = [...beamNode.ratios, cand];
                const complexity = jiLib.computeWeightedComplexity(
                    newRatios, 
                    State.config.useLCM, 
                    State.config.useGCD,
                    State.config.gcdWeight
                );
                nextBeam.push({ ratios: newRatios, score: complexity });
            }
        }
        nextBeam.sort((a, b) => a.score - b.score);
        beam = nextBeam.slice(0, BEAM_WIDTH);
    }

    if (beam.length > 0) {
        const m = new Map();
        beam[0].ratios.forEach(r => m.set(r.key, r));
        return { map: m, score: beam[0].score };
    }
    
    return { map: new Map(), score: Infinity };
}

/* ================= BENCHMARK ================= */

function runBenchmark() {
    if (UI.perfRes) UI.perfRes.textContent = "Running...";
    const mockNotes = [
        { keyIndex: 0, midi: 48, step: 0 },
        { keyIndex: 4, midi: 52, step: 4 },
        { keyIndex: 7, midi: 55, step: 7 },
        { keyIndex: 10, midi: 58, step: 10 },
        { keyIndex: 14, midi: 62, step: 2 }
    ];
    const tonicOpts = [0, 4, 7, 10, 14];

    setTimeout(() => {
        const t0 = performance.now();
        for(let i = 0; i < 100; i++) solveGlobal(mockNotes, tonicOpts);
        const dt = performance.now() - t0;
        if (UI.perfRes) UI.perfRes.textContent = `${(dt/100).toFixed(2)}ms avg`;
    }, 50);
}

/* ================= UI UTILS ================= */

function renderText(map, tonicIdx) {
    if (!UI.playedPre) return;
    
    if (map.size === 0) {
        UI.playedPre.textContent = "Click keys or use MIDI";
        return;
    }
    
    // Упрощённый вывод: только тоника и количество нот
    if (tonicIdx !== null) {
        const tonicName = jiLib.getNoteName(State.allKeys[tonicIdx].midiNote);
        const octave = State.allKeys[tonicIdx].octave;
        UI.playedPre.textContent = `Tonic: ${tonicName}${octave} | Notes: ${map.size}`;
    } else {
        UI.playedPre.textContent = `Notes: ${map.size}`;
    }
}

function applyVisuals(data) {
    State.allKeys.forEach((k, i) => {
        k.jiRatios = data.get(i) || [];
    });
}

// Start
init();