// ============================================
// audio-lib.js - Optimized & Safe
// ============================================

const Utils = {
  initAudio() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    return new Ctx();
  },
  
  // Конвертация центов в частоту
  centsToFrequency(centsOffset, baseFrequency = 440) {
    return baseFrequency * Math.pow(2, centsOffset / 1200);
  },
  
  // Генерация импульса для реверберации
  createImpulse(ctx, duration = 2, decay = 2) {
    const sr = ctx.sampleRate;
    const len = sr * duration;
    const impulse = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return impulse;
  }
};

const Envelope = {
  attack(param, now, target, time) {
    param.cancelScheduledValues(now);
    param.setValueAtTime(0, now);
    param.linearRampToValueAtTime(target, now + time);
  },

  release(param, now, time) {
    param.cancelAndHoldAtTime(now);
    
    // FIX: Экспоненциальный спад звучит натуральнее и убирает "ступеньку" в конце
    param.exponentialRampToValueAtTime(0.001, now + time);
    param.linearRampToValueAtTime(0, now + time + 0.05); // Гарантированный ноль
  },
    
  // release(param, now, time) {
  //   param.cancelScheduledValues(now);
    
  //   // FIX: Безопасное начало релиза с текущего уровня громкости
  //   if (param.cancelAndHoldAtTime) {
  //     param.cancelAndHoldAtTime(now);
  //   } else {
  //     // Fallback для старых браузеров
  //     param.setValueAtTime(param.value, now); 
  //   }
    
  //   // FIX: Экспоненциальный спад звучит натуральнее и убирает "ступеньку" в конце
  //   param.exponentialRampToValueAtTime(0.001, now + time);
  //   param.linearRampToValueAtTime(0, now + time + 0.05); // Гарантированный ноль
  // },
  
  adsr(param, now, a, d, s, target) {
    param.cancelScheduledValues(now);
    param.setValueAtTime(0, now);
    param.linearRampToValueAtTime(target, now + a);
    // sustain не может быть чистым 0 для exponentialRamp
    param.exponentialRampToValueAtTime(Math.max(target * s, 0.001), now + a + d);
  }
};

class Voice {
  constructor(ctx, freq, opts = {}) {
    this.ctx = ctx;
    this.osc = ctx.createOscillator();
    this.gain = ctx.createGain();
    this.vibrato = null;
    this.onEnded = null; // Внутренний колбэк
    
    this.osc.type = opts.type || 'sine';
    this.osc.frequency.value = freq;
    
    // LFO Vibrato logic
    if (opts.vibrato) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = opts.vibrato.rate || 5;
      lfoGain.gain.value = freq * (opts.vibrato.depth || 0.001);
      lfo.connect(lfoGain);
      lfoGain.connect(this.osc.frequency);
      lfo.start();
      this.vibrato = { lfo, lfoGain };
    }
    
    if (opts.filter) {
      this.osc.connect(opts.filter);
      opts.filter.connect(this.gain);
    } else {
      this.osc.connect(this.gain);
    }
    
    this.gain.gain.value = 0;
    
    // FIX: Используем нативное событие для очистки ресурсов
    this.osc.onended = () => {
      this.disconnect();
      if (this.onEnded) this.onEnded();
    };
  }
  
  start(when = this.ctx.currentTime) {
    this.osc.start(when);
  }
  
  stop(when = this.ctx.currentTime) {
    try {
      this.osc.stop(when);
      if (this.vibrato) this.vibrato.lfo.stop(when);
    } catch(e) {} // Игнорируем, если уже остановлен
  }
  
  disconnect() {
    if (this.vibrato) {
      this.vibrato.lfo.disconnect();
      this.vibrato.lfoGain.disconnect();
    }
    this.osc.disconnect();
    // Gain не отключаем, так как он может еще доигрывать хвост релиза
  }
  
  connect(node) {
    this.gain.connect(node);
  }
  
  setFrequency(freq, when, glide = 0) {
    if (glide > 0) {
      this.osc.frequency.linearRampToValueAtTime(freq, when + glide);
    } else {
      this.osc.frequency.setValueAtTime(freq, when);
    }
  }
}

class Synth {
  constructor(ctxOrConfig, opts = {}) {
    const isStableMode = ctxOrConfig?.destination !== undefined;
    
    if (isStableMode) {
      this.ctx = ctxOrConfig;
      this.opts = opts;
      this.voices = new Map();
      
      // === FIX: ВНУТРЕННЯЯ ЦЕПОЧКА ОБРАБОТКИ ===
      // Voices -> Limiter -> Output
      this.output = this.ctx.createGain();
      this.output.gain.value = 0.5; // Headroom по умолчанию (чтобы не было клиппинга сразу)
      
      // Встроенный компрессор для защиты от перегруза
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.value = -10;
      this.limiter.knee.value = 10;
      this.limiter.ratio.value = 12;
      this.limiter.attack.value = 0.005;
      this.limiter.release.value = 0.1;
      
      this.limiter.connect(this.output);
      // Все голоса будем подключать к лимитеру, а не напрямую к выходу
      this.internalBus = this.limiter; 
      
    } else {
      // ... (Legacy/Extended mode initialization kept as is) ...
       this.output = null; 
       // Simple fallback for extended mode just in case
    }
  }
  
  _parsePartials(partials, baseFreq) {
    if (!partials || partials.length === 0) return [{ ratio: 1, amp: 1 }];
    if (typeof partials === 'function') partials = partials(baseFreq);
    if (typeof partials[0] === 'number') {
      partials = partials.map((amp, i) => ({ ratio: i + 1, amp }));
    }
    
    // FIX: АВТО-НОРМАЛИЗАЦИЯ
    // Если юзер подал 16 гармоник с громкостью 1.0 каждая, 
    // мы их скалируем, чтобы сумма была = 1.0
    const totalAmp = partials.reduce((sum, p) => sum + (p.amp || 0), 0);
    if (totalAmp > 1.0) {
      const scale = 1.0 / totalAmp;
      // Не меняем исходный массив (он может использоваться повторно), создаем копию
      return partials.map(p => ({ ...p, amp: (p.amp || 0) * scale }));
    }
    
    return partials;
  }
  
  noteOn(id, freq, velocity = 1) {
    // FIX: Предотвращение наслоения нот с одинаковым ID
    if (this.voices.has(id)) {
      // Мгновенная остановка предыдущей ноты без релиза
      const oldVoice = this.voices.get(id);
      try {
        oldVoice.master.gain.cancelScheduledValues(this.ctx.currentTime);
        oldVoice.master.gain.setValueAtTime(0, this.ctx.currentTime);
        oldVoice.voices.forEach(v => v.stop(this.ctx.currentTime));
      } catch(e){}
      this.voices.delete(id);
    }
    
    const now = this.ctx.currentTime;
    const partials = this._parsePartials(this.opts.partials, freq);
    const master = this.ctx.createGain();
    const activeVoices = [];
    
    // Начальная громкость мастера 0
    master.gain.value = 0;
    // Подключаем к внутренней шине (компрессору), а не сразу на выход
    master.connect(this.internalBus || this.output);
    
    // Счетчик живых осцилляторов для Garbage Collection
    let pendingVoices = partials.length;

    partials.forEach(p => {
      const voice = new Voice(this.ctx, freq * (p.ratio || 1), {
        type: this.opts.type || 'sine',
        vibrato: this.opts.vibrato,
        filter: p.filter || this.opts.filter
      });
      
      voice.gain.gain.value = p.amp || 0;
      voice.connect(master);
      
      // Когда голос закончит играть, уменьшаем счетчик
      voice.onEnded = () => {
        pendingVoices--;
        if (pendingVoices <= 0) {
          // Когда все гармоники затихли, отключаем мастер-шину ноты
          master.disconnect();
        }
      };

      const startTime = now + (p.startDelay || 0);
      voice.start(startTime);
      
      // Применяем ADSR к каждой гармонике индивидуально
      if (p.attack !== undefined) {
        if (p.decay !== undefined && p.sustain !== undefined) {
          Envelope.adsr(voice.gain.gain, startTime, p.attack, p.decay, p.sustain, p.amp);
        } else {
          Envelope.attack(voice.gain.gain, startTime, p.amp, p.attack);
        }
      }
      
      activeVoices.push(voice);
    });
    
    // Глобальная огибающая на мастер ноды
    const hasIndividualEnv = partials.some(p => p.attack !== undefined);
    if (!hasIndividualEnv && this.opts.envelope) {
      const env = this.opts.envelope;
      if (env.decay !== undefined && env.sustain !== undefined) {
        Envelope.adsr(master.gain, now, env.attack, env.decay, env.sustain, velocity);
      } else if (env.attack !== undefined) {
        Envelope.attack(master.gain, now, velocity, env.attack);
      } else {
        master.gain.setValueAtTime(velocity, now);
      }
    } else {
      master.gain.setValueAtTime(velocity, now);
    }
    
    this.voices.set(id, { voices: activeVoices, master, partials });
  }
  
  noteOff(id, when = this.ctx.currentTime) {
    if (!this.voices.has(id)) return;
    
    const { voices, master, partials } = this.voices.get(id);
    const release = this.opts.envelope?.release || 0.1;
    
    // Безопасное время остановки (релиз + небольшой буфер)
    const stopTime = when + release + 0.2;
    
    const hasIndividualEnv = partials.some(p => p.release !== undefined);
    if (hasIndividualEnv) {
      voices.forEach((voice, i) => {
        const r = partials[i].release || release;
        Envelope.release(voice.gain.gain, when, r);
        voice.stop(when + r + 0.2);
      });
    } else {
      Envelope.release(master.gain, when, release);
      voices.forEach(voice => voice.stop(stopTime));
    }
    
    // Удаляем из Map сразу, очистка ресурсов произойдет автоматически через onEnded
    this.voices.delete(id);
  }
  
  triggerAttackRelease(id, freq, duration, velocity = 1) {
    this.noteOn(id, freq, velocity);
    this.noteOff(id, this.ctx.currentTime + duration);
  }

  // ... Остальные методы без изменений (connect, disconnect, setFrequency) ...
  setFrequency(id, freq, glide = 0) {
    if (!this.voices.has(id)) return;
    const { voices, partials } = this.voices.get(id);
    voices.forEach((voice, i) => {
      voice.setFrequency(freq * (partials[i].ratio || 1), this.ctx.currentTime, glide);
    });
  }
  
  connect(node) { 
    this.output?.connect(node); 
  }
  
  disconnect() { 
    this.output?.disconnect(); 
  }
}

// ============================================
// AudioSession - High-level API for entropy app
// (Replaces legacy audio.js)
// ============================================
class AudioSession {
  constructor(config = {}) {
    this.ctx = null;
    this.synths = [null, null];
    this.filters = [null, null];
    this.analysers = [null, null];
    this.reverbNode = null;
    this.reverbMix = null;
    
    this.baseFrequency = config.baseFrequency || 440;
    this.isMouseDown = false;
    
    this.params = {
      oscillatorType: "sawtooth",
      filterFrequency: 1000,
      filterType: "lowpass",
      gainAttackTime: 0.05,
      gainSustainLevel: 0.5,
      gainReleaseTime: 0.2,
      ...config.params
    };
    
    this.noteIndicators = [
      { noteIndex: 0, x: null, opacity: 0 },
      { noteIndex: 1, x: 0, opacity: 0 },
    ];
    
    this._animationId = null;
    this._chartRenderer = null;
  }
  
  async init() {
    if (this.ctx) return;
    
    this.ctx = Utils.initAudio();
    
    // Reverb (shared)
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = Utils.createImpulse(this.ctx, 1.0, 2.0);
    this.reverbMix = this.ctx.createGain();
    this.reverbMix.gain.value = 0.3;
    this.reverbNode.connect(this.reverbMix);
    this.reverbMix.connect(this.ctx.destination);
    
    // Two independent synths with filter + analyser each
    for (let i = 0; i < 2; i++) {
      this.synths[i] = new Synth(this.ctx, {
        type: this.params.oscillatorType,
        envelope: {
          attack: this.params.gainAttackTime,
          release: this.params.gainReleaseTime,
        }
      });
      
      this.filters[i] = this.ctx.createBiquadFilter();
      this.filters[i].type = this.params.filterType;
      this.filters[i].frequency.value = this.params.filterFrequency;
      
      this.analysers[i] = this.ctx.createAnalyser();
      this.analysers[i].fftSize = 256;
      
      // Chain: Synth -> Filter -> Analyser -> Destination
      //                       \-> Reverb
      this.synths[i].connect(this.filters[i]);
      this.filters[i].connect(this.analysers[i]);
      this.filters[i].connect(this.reverbNode);
      this.analysers[i].connect(this.ctx.destination);
    }
  }
  
  centsToFrequency(centsOffset) {
    return Utils.centsToFrequency(centsOffset, this.baseFrequency);
  }
  
  createNote(frequency, startTime, noteIndex) {
    const synth = this.synths[noteIndex];
    if (!synth) return null;
    
    synth.noteOn(0, frequency, this.params.gainSustainLevel);
    return { noteIndex };
  }
  
  stopNote(note, stopTime) {
    if (note && note.noteIndex !== undefined) {
      const synth = this.synths[note.noteIndex];
      if (synth) {
        synth.noteOff(0, stopTime);
      }
    }
  }
  
  getAnalyserLevel(noteIndex) {
    const analyser = this.analysers[noteIndex];
    if (!analyser) return 0;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);
    
    let level = 0;
    for (let i = 0; i < dataArray.length; i++) {
      level += Math.abs(dataArray[i] - 128);
    }
    level = dataArray.length > 0 ? level / dataArray.length : 0;
    return Math.min(1, Math.max(0, level / 40));
  }
  
  startVisualization(chartRenderer) {
    this._chartRenderer = chartRenderer;
    this._updateLoop();
  }
  
  _updateLoop() {
    let needsRedraw = false;
    
    for (let i = 0; i < 2; i++) {
      if (!this.noteIndicators[i]) continue;
      
      const newOpacity = this.getAnalyserLevel(i);
      if (Math.abs(this.noteIndicators[i].opacity - newOpacity) > 0.01) {
        this.noteIndicators[i].opacity = newOpacity;
        needsRedraw = true;
      }
    }
    
    if ((needsRedraw || this.isMouseDown) && this._chartRenderer) {
      this._chartRenderer.setNoteIndicators(this.noteIndicators);
      this._chartRenderer.requestDraw();
    }
    
    this._animationId = requestAnimationFrame(() => this._updateLoop());
  }
  
  get currentTime() {
    return this.ctx?.currentTime || 0;
  }
}

// Export
if (typeof window !== 'undefined') {
  window.AudioLib = { Utils, Envelope, Synth, AudioSession };
}
