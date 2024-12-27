
let lastClickTime = 0;
const DOUBLE_CLICK_DELAY = 300; // миллисекунды

// Основные настройки
const PIXELS_PER_BEAT = 100;
const NOTE_HEIGHT = 20;
const MIN_DURATION = 0.25; // минимальная длительность ноты в долях
const DEFAULT_OCTAVE = 4;

// Структуры данных
const trackData = {
    instruments: new Map(),
    currentTime: 0,
    playing: false,
    loopStart: null,
    loopEnd: null
};

const synthMap = new Map();
let currentInstrument = null;
let mouseDownNote = null;
let mouseDownTime = null;
let isDragging = false;

// Инициализация Canvas
const canvas = document.getElementById('noteCanvas');
const ctx = canvas.getContext('2d');
const cursorCanvas = document.getElementById('cursorCanvas');
const cursorCtx = cursorCanvas.getContext('2d');

// Утилиты для работы с нотами
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const allNotes = [];
for (let octave = 0; octave < 8; octave++) {
    noteNames.forEach(note => allNotes.push(`${note}${octave}`));
}

// Функции для работы с MIDI-данными
function addNoteToTrack(instrumentId, note, time, duration) {
    if (!trackData.instruments.has(instrumentId)) {
        trackData.instruments.set(instrumentId, []);
    }
    const notes = trackData.instruments.get(instrumentId);
    notes.push({ note, time, duration });
    notes.sort((a, b) => a.time - b.time);
}

function removeNoteFromTrack(instrumentId, note, time) {
    if (trackData.instruments.has(instrumentId)) {
        const notes = trackData.instruments.get(instrumentId);
        const index = notes.findIndex(n => 
            n.note === note && Math.abs(n.time - time) < 0.01
        );
        if (index !== -1) {
            notes.splice(index, 1);
        }
    }
}

function getNoteAt(instrumentId, x, y) {
    if (!trackData.instruments.has(instrumentId)) return null;
    
    const time = x / PIXELS_PER_BEAT;
    const noteIndex = Math.floor(y / NOTE_HEIGHT);
    const note = allNotes[noteIndex];
    
    const notes = trackData.instruments.get(instrumentId);
    return notes.find(n => 
        n.note === note &&
        time >= n.time &&
        time <= n.time + n.duration
    );
}

// Функции рендеринга
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Горизонтальные линии для нот
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    for (let i = 0; i <= canvas.height; i += NOTE_HEIGHT) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();
    
    // Вертикальные линии для тактов
    ctx.strokeStyle = '#999';
    const beatsPerMeasure = 4;
    for (let i = 0; i <= canvas.width; i += PIXELS_PER_BEAT * beatsPerMeasure) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        
        // Номер такта
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText(Math.floor(i / (PIXELS_PER_BEAT * beatsPerMeasure)) + 1, i + 5, 15);
    }
}

function drawNotes() {
    trackData.instruments.forEach((notes, instrumentId) => {
        const isCurrentInstrument = instrumentId === currentInstrument;
        ctx.fillStyle = isCurrentInstrument ? '#4CAF50' : '#2196F3';
        
        notes.forEach(note => {
            const noteIndex = allNotes.indexOf(note.note);
            // Инвертируем y-координату
            const y = (allNotes.length - noteIndex - 1) * NOTE_HEIGHT;
            const x = note.time * PIXELS_PER_BEAT;
            const width = note.duration * PIXELS_PER_BEAT;
            
            ctx.fillRect(x, y, width, NOTE_HEIGHT - 1);
        });
    });
}

function drawCursor(time) {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    if (time !== null) {
        cursorCtx.beginPath();
        const x = time * PIXELS_PER_BEAT;
        cursorCtx.moveTo(x, 0);
        cursorCtx.lineTo(x, cursorCanvas.height);
        cursorCtx.strokeStyle = '#ff0000';
        cursorCtx.stroke();
    }
}

function render() {
    drawGrid();
    drawNotes();
}

// Функции воспроизведения
function playTrack(startTime = 0) {
    if (trackData.playing) return;
    
    trackData.playing = true;
    trackData.currentTime = startTime;
    const startOffset = Tone.now();
    
    trackData.instruments.forEach((notes, instrumentId) => {
        const synth = synthMap.get(instrumentId);
        notes.forEach(note => {
            if (note.time >= startTime) {
                synth.triggerAttackRelease(
                    note.note,
                    note.duration,
                    startOffset + (note.time - startTime)
                );
            }
        });
    });
    
    // Анимация курсора
    function updateCursor() {
        if (!trackData.playing) return;
        
        const currentTime = Tone.now() - startOffset + startTime;
        trackData.currentTime = currentTime;
        drawCursor(currentTime);
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
}

function stopTrack() {
    trackData.playing = false;
    trackData.currentTime = 0;
    drawCursor(null);
    
    // Остановка всех синтезаторов
    synthMap.forEach(synth => {
        synth.releaseAll();
    });
}


let draggedNote = null;
let dragStartX = null;
let dragStartY = null;
let dragMode = null; // 'move', 'resize-left', 'resize-right'


function handleMouseMove(e) {
    if (draggedNote) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const dx = (x - dragStartX) / PIXELS_PER_BEAT;
        const dy = Math.floor((dragStartY - y) / NOTE_HEIGHT);
        
        if (dragMode === 'move') {
            const newNote = allNotes[allNotes.length - Math.floor(y / NOTE_HEIGHT) - 1];
            const newTime = draggedNote.time + dx;
            
            removeNoteFromTrack(currentInstrument, draggedNote.note, draggedNote.time);
            addNoteToTrack(currentInstrument, newNote, newTime, draggedNote.duration);
            draggedNote = getNoteAt(currentInstrument, x, y);
            dragStartX = x;
            dragStartY = y;
        } else if (dragMode === 'resize-left') {
            const newTime = draggedNote.time + dx;
            const newDuration = draggedNote.duration - dx;
            if (newDuration >= MIN_DURATION) {
                removeNoteFromTrack(currentInstrument, draggedNote.note, draggedNote.time);
                addNoteToTrack(currentInstrument, draggedNote.note, newTime, newDuration);
                draggedNote = getNoteAt(currentInstrument, x, y);
                dragStartX = x;
            }
        } else if (dragMode === 'resize-right') {
            const newDuration = draggedNote.duration + dx;
            if (newDuration >= MIN_DURATION) {
                removeNoteFromTrack(currentInstrument, draggedNote.note, draggedNote.time);
                addNoteToTrack(currentInstrument, draggedNote.note, draggedNote.time, newDuration);
                draggedNote = getNoteAt(currentInstrument, x, y);
                dragStartX = x;
            }
        }
        
        render();
    } else if (isDragging && mouseDownNote) {
        // Существующий код для рисования новой ноты
    }
}

function handleMouseUp() {
    draggedNote = null;
    dragMode = null;
    if (isDragging && mouseDownNote) {
        // Существующий код для завершения рисования новой ноты
    }
    isDragging = false;
    mouseDownNote = null;
    mouseDownTime = null;
    render();
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickTime = new Date().getTime();
    
    // Проверяем все инструменты на наличие ноты в точке клика
    let foundNote = null;
    let foundInstrument = null;
    
    trackData.instruments.forEach((notes, instrumentId) => {
        const note = getNoteAt(instrumentId, x, y);
        if (note) {
            foundNote = note;
            foundInstrument = instrumentId;
        }
    });
    
    if (foundNote) {
        // Если нашли ноту - активируем её инструмент и проигрываем звук
        currentInstrument = foundInstrument;
        updateInstrumentPanel(); // Обновляем UI панели инструментов
        
        if (clickTime - lastClickTime < DOUBLE_CLICK_DELAY) {
            // Двойной клик - удаляем ноту
            removeNoteFromTrack(foundInstrument, foundNote.note, foundNote.time);
        } else {
            // Одиночный клик - проигрываем ноту
            const synth = synthMap.get(foundInstrument);
            synth.triggerAttackRelease(foundNote.note, foundNote.duration);
            
            // Начинаем перетаскивание
            draggedNote = foundNote;
            dragStartX = x;
            dragStartY = y;
            
            const noteX = foundNote.time * PIXELS_PER_BEAT;
            const noteWidth = foundNote.duration * PIXELS_PER_BEAT;
            
            if (Math.abs(x - noteX) < 10) {
                dragMode = 'resize-left';
            } else if (Math.abs(x - (noteX + noteWidth)) < 10) {
                dragMode = 'resize-right';
            } else {
                dragMode = 'move';
            }
        }
    } else if (currentInstrument) {
        // Если ноты нет и есть выбранный инструмент - начинаем рисовать новую
        mouseDownNote = allNotes[allNotes.length - Math.floor(y / NOTE_HEIGHT) - 1];
        mouseDownTime = x / PIXELS_PER_BEAT;
        isDragging = true;
        const synth = synthMap.get(currentInstrument);
        synth.triggerAttack(mouseDownNote);
    }
    
    lastClickTime = clickTime;
    render();
}

function handleMouseMove(e) {
    if (!isDragging || !mouseDownNote || !currentInstrument) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const duration = Math.max(MIN_DURATION, (x / PIXELS_PER_BEAT) - mouseDownTime);
    
    render();
    
    // Предварительный просмотр ноты
    ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
    ctx.fillRect(
        mouseDownTime * PIXELS_PER_BEAT,
        allNotes.indexOf(mouseDownNote) * NOTE_HEIGHT,
        duration * PIXELS_PER_BEAT,
        NOTE_HEIGHT - 1
    );
}

function handleMouseUp(e) {
    if (!currentInstrument || !mouseDownNote) return;
    
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const duration = Math.max(MIN_DURATION, (x / PIXELS_PER_BEAT) - mouseDownTime);
        
        addNoteToTrack(currentInstrument, mouseDownNote, mouseDownTime, duration);
        const synth = synthMap.get(currentInstrument);
        synth.triggerRelease(mouseDownNote);
    }
    
    isDragging = false;
    mouseDownNote = null;
    mouseDownTime = null;
    
    render();
}


// Обновлённая функция playTrack
function playTrack(startTime = 0) {
    if (trackData.playing) return;
    
    Tone.start().then(() => {
        trackData.playing = true;
        trackData.currentTime = startTime;
        const startOffset = Tone.now();
        
        trackData.instruments.forEach((notes, instrumentId) => {
            const synth = synthMap.get(instrumentId);
            notes.forEach(note => {
                if (note.time >= startTime) {
                    synth.triggerAttackRelease(
                        note.note,
                        note.duration,
                        startOffset + (note.time - startTime)
                    );
                }
            });
        });
        
        function updateCursor() {
            if (!trackData.playing) return;
            
            const currentTime = Tone.now() - startOffset + startTime;
            trackData.currentTime = currentTime;
            drawCursor(currentTime);
            
            requestAnimationFrame(updateCursor);
        }
        updateCursor();
    });
}

// Добавим функции для работы с панелью инструментов
function updateInstrumentPanel() {
    const panel = document.querySelector('.instrument-panel');
    panel.innerHTML = '';
    
    trackData.instruments.forEach((notes, id) => {
        const div = document.createElement('div');
        div.className = 'instrument';
        if (id === currentInstrument) {
            div.classList.add('active');
        }
        div.textContent = `Инструмент ${id.slice(-4)}`;
        div.dataset.instrumentId = id;
        
        div.addEventListener('click', () => {
            document.querySelectorAll('.instrument').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            currentInstrument = id;
        });
        
        panel.appendChild(div);
    });
}

function createInstrument(name = 'Synth') {
    const id = Date.now().toString();
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synthMap.set(id, synth);
    trackData.instruments.set(id, []);
    updateInstrumentPanel();
    return id;
}

// Обновим функцию removeInstrument
function removeInstrument(id) {
    const synth = synthMap.get(id);
    if (synth) {
        synth.dispose();
        synthMap.delete(id);
        trackData.instruments.delete(id);
        if (currentInstrument === id) {
            currentInstrument = Array.from(trackData.instruments.keys())[0] || null;
        }
        updateInstrumentPanel();
    }
}

// Инициализация интерфейса
function setupInstrumentPanel() {
    const panel = document.querySelector('.instrument-panel');
    
    panel.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="menu-item add-instrument">Добавить инструмент</div>
            ${currentInstrument ? '<div class="menu-item remove-instrument">Удалить инструмент</div>' : ''}
        `;
        
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        document.body.appendChild(menu);
        
        menu.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-instrument')) {
                const id = createInstrument();
                currentInstrument = id;
                render();
            } else if (e.target.classList.contains('remove-instrument')) {
                removeInstrument(currentInstrument);
                render();
            }
            menu.remove();
        });
        
        const closeMenu = () => {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        };
        document.addEventListener('click', closeMenu);
    });
}

// Инициализация приложения
function init() {
    // Настройка размеров canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth - 200; // 200px для панели инструментов
        canvas.height = window.innerHeight;
        cursorCanvas.width = canvas.width;
        cursorCanvas.height = canvas.height;
        render();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Добавление обработчиков событий
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    // Создание первого инструмента
    currentInstrument = createInstrument();
    document.getElementById('playButton').addEventListener('click', () => playTrack());
    document.getElementById('stopButton').addEventListener('click', stopTrack);
    
    // Создание первого инструмента и обновление панели
    updateInstrumentPanel();
    
    setupInstrumentPanel();
    render();
}

// Запуск приложения
init();