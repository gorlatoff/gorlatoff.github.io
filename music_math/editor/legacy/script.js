
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

const canvas = document.createElement('canvas');
canvas.width = 1200;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const controlWidth = 200; // Ширина панели инструментов слева
const pianoRollHeight = canvas.height; // Высота piano-roll
const noteWidth = 40; // Ширина ячейки ноты
const noteHeight = 20; // Высота ячейки ноты

let instruments = [
  { name: 'Piano', color: 'blue', midi: 0, volume: 0.5, enabled: true },
];
let activeInstrument = 0;
const notes = [];
const midiPresets = Array(128).fill(null).map((_, i) => `Instrument ${i}`);

// Управление проигрыванием
let isPlaying = false;
let playHeadX = controlWidth;
let playInterval = null;

// WebMidi
let midiOutput = null;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  alert('Web MIDI API is not supported in this browser.');
}

function onMIDISuccess(midiAccess) {
  const outputs = Array.from(midiAccess.outputs.values());
  if (outputs.length > 0) {
    midiOutput = outputs[0]; // Выбираем первое доступное устройство
    console.log('MIDI output detected:', midiOutput.name);
  } else {
    console.log('No MIDI outputs available.');
  }
}

function onMIDIFailure() {
  console.log('Failed to access MIDI devices.');
}

// Воспроизведение MIDI-ноты
function playMidi(midi, volume = 0.5, duration = 0.5) {
  if (!midiOutput) {
    console.log('No MIDI output available.');
    return;
  }

  const velocity = Math.floor(volume * 127); // Громкость от 0 до 127
  midiOutput.send([0x90, midi, velocity]); // Начало ноты
  setTimeout(() => midiOutput.send([0x80, midi, 0]), duration * 1000); // Конец ноты
}

// Рисуем интерфейс
function drawInterface() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Панель инструментов
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, controlWidth, canvas.height);

  // Кнопки управления
  drawControlButtons();

  // Кнопки инструментов
  instruments.forEach((inst, i) => {
    const y = 100 + i * 50;

    // Кнопка включения/выключения
    ctx.fillStyle = inst.enabled ? 'green' : 'red';
    ctx.fillRect(10, y, 30, 30);

    // Цвет и название инструмента
    ctx.fillStyle = inst.color;
    ctx.fillRect(50, y, 140, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(inst.name, 60, y + 20);
  });

  // Piano-roll
  drawPianoRoll();
}

// Кнопки управления
function drawControlButtons() {
  const icons = ['▶️', '⏸️', '⏹️']; // Иконки Play, Pause, Stop
  icons.forEach((icon, i) => {
    const x = 10 + i * 60; // Горизонтальное размещение
    ctx.fillStyle = '#555';
    ctx.fillRect(x, 10, 50, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText(icon, x + 10, 45);
  });
}

// Piano-roll
function drawPianoRoll() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(controlWidth, 0, canvas.width - controlWidth, pianoRollHeight);

  // Горизонтальная сетка
  const rows = pianoRollHeight / noteHeight;
  for (let i = 0; i < rows; i++) {
    ctx.strokeStyle = i % 12 === 0 ? '#ccc' : '#eee';
    ctx.beginPath();
    ctx.moveTo(controlWidth, i * noteHeight);
    ctx.lineTo(canvas.width, i * noteHeight);
    ctx.stroke();
  }

  // Вертикальная сетка
  const cols = (canvas.width - controlWidth) / noteWidth;
  for (let i = 0; i < cols; i++) {
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(controlWidth + i * noteWidth, 0);
    ctx.lineTo(controlWidth + i * noteWidth, canvas.height);
    ctx.stroke();
  }

  // Ноты
  notes.forEach(note => {
    ctx.fillStyle = note.color;
    ctx.fillRect(note.x, note.y, noteWidth, noteHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(note.x, note.y, noteWidth, noteHeight);
  });

  // Рисуем курсор
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(playHeadX, 0);
  ctx.lineTo(playHeadX, pianoRollHeight);
  ctx.stroke();
}

// Обработка событий мыши
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Клик по кнопкам управления
  if (y <= 60) {
    if (x >= 10 && x <= 60) play();
    else if (x >= 70 && x <= 120) pause();
    else if (x >= 130 && x <= 180) reset();
    return;
  }

  // Piano-roll
  const noteX = Math.floor((x - controlWidth) / noteWidth) * noteWidth + controlWidth;
  const noteY = Math.floor(y / noteHeight) * noteHeight;

  const existingNote = notes.find(note => note.x === noteX && note.y === noteY);
  if (existingNote) {
    notes.splice(notes.indexOf(existingNote), 1); // Удаление ноты
  } else {
    notes.push({
      x: noteX,
      y: noteY,
      color: instruments[activeInstrument].color,
    });
    const midi = instruments[activeInstrument].midi + (pianoRollHeight / noteHeight - noteY / noteHeight);
    playMidi(midi, instruments[activeInstrument].volume);
  }

  drawInterface();
});

// Воспроизведение композиции
function play() {
  if (isPlaying) return;
  isPlaying = true;

  playInterval = setInterval(() => {
    playHeadX += noteWidth;
    if (playHeadX >= canvas.width) reset();

    notes.forEach(note => {
      if (note.x === playHeadX) {
        const midi = instruments[activeInstrument].midi + (pianoRollHeight / noteHeight - note.y / noteHeight);
        playMidi(midi, instruments[activeInstrument].volume);
      }
    });

    drawInterface();
  }, 200);
}

// Пауза
function pause() {
  isPlaying = false;
  clearInterval(playInterval);
}

// Сброс
function reset() {
  pause();
  playHeadX = controlWidth;
  drawInterface();
}

// Начало
drawInterface();