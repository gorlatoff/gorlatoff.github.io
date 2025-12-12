// keyboard.js — клавиатура: генерация, прорисовка, полигоны, mouse/MIDI
// Экспортирует глобально: Keyboard

(function(global){
  'use strict';

  const X_SCALE = 50;
  const Y_SCALE = 100;
  const WHITE_KEY_HEIGHT = 2;
  const BLACK_KEY_RELATIVE_HEIGHT = 0.8;
  const HINT_BAR_HEIGHT = 12;  // Высота подсказочной панели в пикселях

  const Keyboard = {
    allKeys: [],
    canvas: null,
    ctx: null,
    
    colorMode: false,
    
    // Данные для hint bar (передаются из ji-interpretations)
    hintData: {
      colors: [],    // [{hue, alpha}, ...] для каждой клавиши
      lcmKeys: [],   // Индексы клавиш для LCM маркера
      gcdKeys: []    // Индексы клавиш для GCD маркера
    },
    
    callbacks: {
      onToggleKey: null,
      onSetTonic: null
    },
    
    init(canvasId, octaves = 2, startOctave = 3, callbacks = {}) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) throw new Error('Canvas not found: ' + canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.callbacks.onToggleKey = callbacks.onToggleKey || function(){};
      this.callbacks.onSetTonic = callbacks.onSetTonic || function(){};

      this.allKeys = this.generateKeys(octaves, startOctave);
      this.resizeCanvas();
      this.buildPolygons();
      this.setupListeners();
      this.loop();
      this.initWebMIDI();
    },

    generateKeys(octaves, startOctave){
      const base = [
        { note:'C', isBlack:false, midiOffset:0 },
        { note:'C#', isBlack:true, midiOffset:1 },
        { note:'D', isBlack:false, midiOffset:2 },
        { note:'D#', isBlack:true, midiOffset:3 },
        { note:'E', isBlack:false, midiOffset:4 },
        { note:'F', isBlack:false, midiOffset:5 },
        { note:'F#', isBlack:true, midiOffset:6 },
        { note:'G', isBlack:false, midiOffset:7 },
        { note:'G#', isBlack:true, midiOffset:8 },
        { note:'A', isBlack:false, midiOffset:9 },
        { note:'A#', isBlack:true, midiOffset:10 },
        { note:'B', isBlack:false, midiOffset:11 }
      ];
      const keys = [];
      for (let o = 0; o < octaves; o++){
        base.forEach(b => {
          const midiNote = 12 * (startOctave + o) + b.midiOffset;
          keys.push({ 
            ...b, 
            midiNote, 
            edoStep: b.midiOffset, 
            octave: startOctave + o, 
            isActive: false, 
            isTonic: false,
            jiRatios: [] 
          });
        });
      }
      // Завершающая C
      keys.push({ 
        note:'C', isBlack:false, midiOffset:0, 
        midiNote: 12*(startOctave+octaves), 
        edoStep:0, octave:startOctave+octaves, 
        isActive:false, isTonic:false, jiRatios:[] 
      });
      return keys;
    },

    resizeCanvas(){
      if (!this.canvas) return;
      const logicalWidth = this.allKeys.length * X_SCALE;
      const keyboardHeight = Math.max(WHITE_KEY_HEIGHT, BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT) * Y_SCALE;
      this.canvas.width = logicalWidth;
      this.canvas.height = HINT_BAR_HEIGHT + keyboardHeight;
      
      const dpr = window.devicePixelRatio || 1;
      if (dpr > 1) {
        const sw = this.canvas.width, sh = this.canvas.height;
        this.canvas.style.width = sw + 'px';
        this.canvas.style.height = sh + 'px';
        this.canvas.width = sw * dpr;
        this.canvas.height = sh * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } else {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    },

    buildPolygons(){
      this.allKeys.forEach((key, i) => {
        if (key.isBlack) {
          key.polygon = [
            { x: i, y: 0 }, 
            { x: i + 1, y: 0 }, 
            { x: i + 1, y: BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT }, 
            { x: i, y: BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT }
          ];
        } else {
          let l = 0, r = 0;
          if (i > 0 && this.allKeys[i - 1].isBlack) l = 0.5;
          if (i < this.allKeys.length - 1 && this.allKeys[i + 1].isBlack) r = 0.5;
          key.polygon = [
            { x: i, y: 0 }, 
            { x: i + 1, y: 0 }, 
            { x: i + 1, y: 1 }, 
            { x: i + 1 + r, y: 1 }, 
            { x: i + 1 + r, y: WHITE_KEY_HEIGHT }, 
            { x: i - l, y: WHITE_KEY_HEIGHT }, 
            { x: i - l, y: 1 }, 
            { x: i, y: 1 }
          ];
        }
      });
    },

    draw(){
      const ctx = this.ctx;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Рисуем hint bar сначала
      this.drawHintBar();
      
      // Белые клавиши
      this.allKeys.forEach((k, i) => { if (!k.isBlack) this.drawKey(k, i); });
      // Чёрные сверху
      this.allKeys.forEach((k, i) => { if (k.isBlack) this.drawKey(k, i); });
    },

    drawHintBar() {
      const ctx = this.ctx;
      const colors = this.hintData.colors || [];
      
      // Фон панели
      ctx.fillStyle = '#11111b';
      ctx.fillRect(0, 0, this.allKeys.length * X_SCALE, HINT_BAR_HEIGHT);
      
      // Цветовые подсказки для каждой клавиши
      this.allKeys.forEach((key, i) => {
        const hint = colors[i];
        if (!hint || hint.alpha < 0.05) return;
        
        const x = i * X_SCALE;
        const width = X_SCALE;
        
        ctx.fillStyle = `hsla(${hint.hue}, 70%, 50%, ${hint.alpha})`;
        ctx.fillRect(x + 1, 1, width - 2, HINT_BAR_HEIGHT - 2);
      });
      
      // GCD маркеры (синий ромб) - Fundamental
      const gcdKeys = this.hintData.gcdKeys || [];
      gcdKeys.forEach(i => {
        if (i < 0 || i >= this.allKeys.length) return;
        const x = i * X_SCALE + X_SCALE / 2;
        const y = HINT_BAR_HEIGHT / 2;
        
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + 5, y);
        ctx.lineTo(x, y + 5);
        ctx.lineTo(x - 5, y);
        ctx.closePath();
        ctx.fillStyle = '#89b4fa';
        ctx.fill();
        ctx.strokeStyle = '#1e1e2e';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // LCM маркеры (жёлтый треугольник вверх) - Cover
      const lcmKeys = this.hintData.lcmKeys || [];
      lcmKeys.forEach(i => {
        if (i < 0 || i >= this.allKeys.length) return;
        const x = i * X_SCALE + X_SCALE / 2;
        ctx.beginPath();
        ctx.moveTo(x, HINT_BAR_HEIGHT - 2);
        ctx.lineTo(x + 5, 3);
        ctx.lineTo(x - 5, 3);
        ctx.closePath();
        ctx.fillStyle = '#f9e2af';
        ctx.fill();
      });
    },

    getRatioColor(ratio, isBlack, alpha) {
      if (!this.colorMode) {
        const baseColor = isBlack ? [255, 255, 255] : [0, 0, 0];
        return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
      }
      
      const gradus = jiLib.eulerGradus(ratio.num, ratio.den);
      const hue = Math.max(0, 120 - (gradus - 1) * 5);
      const sat = 80;
      const light = isBlack ? 65 : 40;
      
      return `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
    },

    drawKey(key, idx){
      const ctx = this.ctx;
      const isTonic = key.isTonic;
      
      // Смещаем всё вниз на высоту hint bar
      const poly = key.polygon.map(p => ({ x: p.x * X_SCALE, y: p.y * Y_SCALE + HINT_BAR_HEIGHT }));
      
      ctx.beginPath();
      ctx.moveTo(poly[0].x, poly[0].y);
      poly.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      
      // Градиент фона
      if (key.isBlack) {
        const g = ctx.createLinearGradient(0, poly[0].y, 0, poly[2].y); 
        g.addColorStop(0, '#444'); 
        g.addColorStop(1, '#000'); 
        ctx.fillStyle = g;
      } else {
        const g = ctx.createLinearGradient(0, HINT_BAR_HEIGHT, 0, HINT_BAR_HEIGHT + WHITE_KEY_HEIGHT * Y_SCALE); 
        g.addColorStop(0, '#fff'); 
        g.addColorStop(1, '#bbb'); 
        ctx.fillStyle = g;
      }
      ctx.fill();
      
      // Подсветка активных нот
      if (key.isActive) { 
        ctx.fillStyle = 'rgba(97,175,239,0.6)'; 
        ctx.fill(); 
      }
      
      // Подсветка тоники
      if (isTonic) { 
        ctx.fillStyle = 'rgba(229,192,123,0.7)'; 
        ctx.fill(); 
      }
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Рисуем JI ratios
      if (key.jiRatios && key.jiRatios.length) {
        const centerX = poly.reduce((s, p) => s + p.x, 0) / poly.length;
        const labelY = key.isBlack 
          ? HINT_BAR_HEIGHT + BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT * Y_SCALE * 0.4 
          : HINT_BAR_HEIGHT + WHITE_KEY_HEIGHT * Y_SCALE * 0.6;
        const fontSize = 12;
        ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`; 
        ctx.textAlign = 'center';
        
        // Считаем количество видимых ratios
        const visibleRatios = key.jiRatios.filter(r => r.alpha > 0.05);
        let yOff = -((visibleRatios.length - 1) * (fontSize + 2)) / 2;
        
        for (const r of key.jiRatios) {
          if (r.alpha < 0.05) continue;
          
          ctx.fillStyle = this.getRatioColor(r, key.isBlack, r.alpha);
          ctx.fillText(`${r.num}/${r.den}`, centerX, labelY + yOff);
          yOff += fontSize + 2;
        }
      }
    },

    pointInPolygon(px, py, polygon) {
      // Учитываем смещение на HINT_BAR_HEIGHT
      const poly = polygon.map(p => ({ x: p.x * X_SCALE, y: p.y * Y_SCALE + HINT_BAR_HEIGHT }));
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
        if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
      }
      return inside;
    },

    getKeyAtPosition(x, y) {
      // Сначала проверяем чёрные (они сверху)
      for (let i = 0; i < this.allKeys.length; i++) {
        if (this.allKeys[i].isBlack && this.pointInPolygon(x, y, this.allKeys[i].polygon)) return i;
      }
      for (let i = 0; i < this.allKeys.length; i++) {
        if (!this.allKeys[i].isBlack && this.pointInPolygon(x, y, this.allKeys[i].polygon)) return i;
      }
      return null;
    },

    setupListeners(){
      this.canvas.addEventListener('mousedown', (evt) => {
        const rect = this.canvas.getBoundingClientRect();
        
        const logicalWidth = this.allKeys.length * X_SCALE;
        const keyboardHeight = Math.max(WHITE_KEY_HEIGHT, BLACK_KEY_RELATIVE_HEIGHT * WHITE_KEY_HEIGHT) * Y_SCALE;
        const logicalHeight = HINT_BAR_HEIGHT + keyboardHeight;
        
        const mouseX = (evt.clientX - rect.left);
        const mouseY = (evt.clientY - rect.top);
        
        const polygonX = (mouseX / rect.width) * logicalWidth;
        const polygonY = (mouseY / rect.height) * logicalHeight;

        // Игнорируем клики на hint bar
        if (polygonY < HINT_BAR_HEIGHT) return;

        const keyIndex = this.getKeyAtPosition(polygonX, polygonY);
        if (keyIndex === null) return;
        
        if (evt.button === 0) {
          // ЛКМ: toggle активности
          this.allKeys[keyIndex].isActive = !this.allKeys[keyIndex].isActive;
          if (this.callbacks.onToggleKey) this.callbacks.onToggleKey(keyIndex);
        } else if (evt.button === 2) {
          // ПКМ: установка тоники + отключение Auto Tonic
          this.allKeys.forEach(k => k.isTonic = false);
          this.allKeys[keyIndex].isTonic = true;
          
          const autoTonicCheckbox = document.getElementById('flagAutoTonic');
          if (autoTonicCheckbox && autoTonicCheckbox.checked) {
            autoTonicCheckbox.checked = false;
          }
          
          if (this.callbacks.onSetTonic) this.callbacks.onSetTonic(keyIndex);
        }
      });
      
      this.canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); });

      window.addEventListener('resize', () => {
        this.resizeCanvas();
        this.buildPolygons();
      });
    },

    handleMIDIMessage(evt) {
      const [status, note, velocity] = evt.data;
      const cmd = status & 0xf0;
      const isNoteOn = (cmd === 0x90 && velocity > 0);
      const isNoteOff = (cmd === 0x80 || (cmd === 0x90 && velocity === 0));
      const keyIndex = this.allKeys.findIndex(k => k.midiNote === note);
      if (keyIndex === -1) return;
      
      if (isNoteOn) {
        this.allKeys[keyIndex].isActive = true;
        if (this.callbacks.onToggleKey) this.callbacks.onToggleKey(keyIndex);
      }
      else if (isNoteOff) {
        this.allKeys[keyIndex].isActive = false;
        if (this.callbacks.onToggleKey) this.callbacks.onToggleKey(keyIndex);
      }
    },

    initWebMIDI() {
      if (!navigator.requestMIDIAccess) return;
      navigator.requestMIDIAccess().then((midi) => {
        midi.inputs.forEach(input => input.onmidimessage = (e) => this.handleMIDIMessage(e));
        midi.onstatechange = () => { 
          midi.inputs.forEach(input => input.onmidimessage = (e) => this.handleMIDIMessage(e)); 
        };
      }).catch((err) => console.warn('MIDI not available', err));
    },

    loop() {
      this.draw();
      requestAnimationFrame(() => this.loop());
    }
  };

  global.Keyboard = Keyboard;
})(window);