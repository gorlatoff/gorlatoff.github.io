document.addEventListener('DOMContentLoaded', () => {
    
    // === DOM References ===
    const ui = {
        app: document.getElementById('app'),
        svg: document.getElementById('main-svg'),
        svgGroup: document.getElementById('svg-content'),
        overlay: document.getElementById('start-overlay'),
        btnDual: document.getElementById('btn-dual'),
        btnInfo: document.getElementById('btn-info'),
        infoOverlay: document.getElementById('info-overlay'),
        infoContent: document.getElementById('info-text'),
        statusText: document.getElementById('status-text')
    };

    // === State ===
    const state = {
        mode: 'tonnetz',
        activePitches: new Set(), // MIDI Note Numbers (0-127)
        audioStarted: false
    };

    const viewport = new ViewportController(ui.svg, ui.svgGroup);
    const renderer = new TonnetzRenderer(ui.svgGroup);

    function renderScene() {
        const bounds = viewport.getBounds();
        renderer.render(bounds, state.mode);
        updateActiveClasses();
    }

    // === Visual Feedback Logic ===
    function updateActiveClasses() {
        // 1. Сброс (используем classList.remove('active') вместо удаления специфичных классов)
        const allActive = ui.svgGroup.querySelectorAll('.active');
        allActive.forEach(el => el.classList.remove('active'));

        // Собираем Pitch Classes (0-11) активных нот
        const activePCs = new Set();
        state.activePitches.forEach(p => activePCs.add(Tonnetz.Math.mod(p, 12)));
        const activePCArr = Array.from(activePCs).sort((a,b) => a-b);

        // 2. Подсветка Нот (по Pitch Class)
        activePCs.forEach(pc => {
            const nodes = ui.svgGroup.querySelectorAll(`.node[data-pc="${pc}"]`);
            nodes.forEach(n => n.classList.add('active'));
        });

        // 3. Подсветка Дикордов (Линий)
        // Ключ формата "pc1-pc2" (отсортирован)
        for (let i = 0; i < activePCArr.length; i++) {
            for (let j = i + 1; j < activePCArr.length; j++) {
                const key = `${activePCArr[i]}-${activePCArr[j]}`;
                const lines = ui.svgGroup.querySelectorAll(`.dichord[data-key="${key}"]`);
                lines.forEach(l => l.classList.add('active'));
            }
        }

        // 4. Подсветка Трикордов (Треугольников)
        if (state.mode === 'tonnetz') {
             for (let i = 0; i < activePCArr.length; i++) {
                for (let j = i + 1; j < activePCArr.length; j++) {
                    for (let k = j + 1; k < activePCArr.length; k++) {
                        const key = `${activePCArr[i]}-${activePCArr[j]}-${activePCArr[k]}`;
                        const polys = ui.svgGroup.querySelectorAll(`.trichord[data-key="${key}"]`);
                        polys.forEach(p => p.classList.add('active'));
                    }
                }
            }
        }
    }

    // === MIDI Setup ===
    window.midiBus.init();

    window.midiBus.on('midi-event', (msg) => {
        if (msg.isNoteOn) state.activePitches.add(msg.note);
        else if (msg.isNoteOff) state.activePitches.delete(msg.note);
        updateActiveClasses();
    });

    window.midiBus.on('local-note-on', (pitches) => {
        pitches.forEach(p => state.activePitches.add(p));
        updateActiveClasses();
    });
    
    window.midiBus.on('local-note-off', (pitches) => {
        pitches.forEach(p => state.activePitches.delete(p));
        updateActiveClasses();
    });

    // === Interaction: Click to Play ===
    let playingPitches = null;

    ui.svgGroup.addEventListener('pointerdown', (e) => {
        // Ищем ближайший элемент тоннетца (нота, линия или треугольник)
        const target = e.target.closest('.tonnetz-el');
        
        if (target && target.dataset.pitches) {
            e.stopPropagation(); // Останавливаем драг карты
            
            // Парсим массив нот из data-attribute
            const pitches = JSON.parse(target.dataset.pitches);
            
            // Нормализация в диапазон 0-127 (на всякий случай)
            const validPitches = pitches.map(p => {
                while(p < 0) p += 12;
                while(p > 127) p -= 12;
                return p;
            });

            playingPitches = validPitches;
            window.midiBus.sendNoteOn(playingPitches);
            
            // Захват указателя, чтобы отпустить ноту даже если увели мышь
            if(target.setPointerCapture) target.setPointerCapture(e.pointerId);
        }
    });

    const stopPlaying = (e) => {
        if (playingPitches) {
            window.midiBus.sendNoteOff(playingPitches);
            playingPitches = null;
            if(e.target && e.target.releasePointerCapture) {
                 // try catch на случай если элемент уже пропал или не захвачен
                 try { e.target.releasePointerCapture(e.pointerId); } catch(err){}
            }
        }
    };

    document.addEventListener('pointerup', stopPlaying);
    // document.addEventListener('pointercancel', stopPlaying); // Опционально

    // === UI Controls ===
    function initAudio() {
        if (state.audioStarted) return;
        state.audioStarted = true;
        ui.overlay.style.display = 'none';

        if (!window.JZZ) return;
        const synth = JZZ.synth.Tiny();
        window.midiBus.connect(synth);

        JZZ().or(() => { ui.statusText.textContent = "MIDI Engine Failed"; })
             .and(function() {
                const info = this.info();
                ui.statusText.textContent = (info.inputs.length > 0) ? "MIDI Active" : "No MIDI Inputs";
                ui.statusText.classList.toggle('connected', info.inputs.length > 0);
             });
             
        JZZ().openMidiIn().connect(function(msg) {
            if (msg.isNoteOn() || msg.isNoteOff()) {
                window.midiBus.emit('midi-event', {
                    isNoteOn: msg.isNoteOn(),
                    isNoteOff: msg.isNoteOff(),
                    note: msg.getNote()
                });
            }
        });
    }

    ui.overlay.addEventListener('click', initAudio);

    ui.btnDual.addEventListener('click', () => {
        state.mode = (state.mode === 'tonnetz') ? 'rectangular' : 'tonnetz';
        ui.btnDual.classList.toggle('active', state.mode === 'rectangular');
        renderScene();
    });

    ui.btnInfo.addEventListener('click', () => {
        const isHidden = ui.infoOverlay.style.display === 'none';
        ui.infoOverlay.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
            const key = state.mode === 'tonnetz' ? 'infos.tonnetz' : 'infos.rectangular';
            ui.infoContent.innerHTML = Tonnetz.Strings.get(key);
            ui.btnInfo.textContent = Tonnetz.Strings.get('infoClose');
        } else {
            ui.btnInfo.textContent = Tonnetz.Strings.get('info');
        }
    });
    
    ui.infoOverlay.addEventListener('click', (e) => {
        if(e.target === ui.infoOverlay) ui.btnInfo.click();
    });

    ui.svg.addEventListener('pointerup', () => requestAnimationFrame(renderScene));

    // Init
    renderScene();
});