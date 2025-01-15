let base = 200; // Базовая частота
let oscillators = [];

const analyser = Tone.context.createAnalyser();
analyser.fftSize = 4096;
let canvas, ctx;

class AdditiveSynth {
  constructor(freq) {
    this.freq = freq;
    this.synth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.6,
        decay: 1.2,
        sustain: 0.9,
        release: 0.6,
        releaseCurve : "linear",
      },
      portamento: 0
    }).connect(analyser).toDestination();

    this.button = document.createElement('button');
    this.button.textContent = freq + ' Hz';
    this.button.addEventListener('mousedown', this.playNote.bind(this));
    this.button.addEventListener('mouseup', this.stopNote.bind(this));
    document.getElementById('button-container').appendChild(this.button);
  }

  playNote() {
    this.synth.triggerAttack(this.freq);
  }

  stopNote() {
    this.synth.triggerRelease();
  }
}

function setup() {
  const oscillatorContainer = document.getElementById('oscillator-container');
  canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  oscillatorContainer.appendChild(canvas); // Append the canvas to the oscillator container
  ctx = canvas.getContext('2d');

  for (let i = 1; i <= 5; i++) { // Создаем 5 кнопок и соответствующих осцилляторов
    let frequency = base * i;
    oscillators.push(new AdditiveSynth(frequency));
  }

  drawWaveform(); // Start drawing the waveform
}

function cropWaveform(waveform) {
  let changeIndex = 0;
  var delta = 1;
  for (let i = 0; i < waveform.length - 1; i++) {
    if (Math.abs(waveform[i]) < delta && waveform[i - 1] > waveform[i + 1]) {
      delta = Math.abs(waveform[i]);
      changeIndex = i;
    }
  }
  if (changeIndex !== 0) {
    return waveform.slice(changeIndex); // обрезаем waveform от найденного индекса
  }
  return waveform; // Если точка не была найдена, возвращаем исходный waveform
}
function map(value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

function drawWaveform() {
  // Get the waveform data
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  
    // Clear the canvas with semi-transparent background
  // ctx.fillStyle = 'rgba(256, 256, 256, 0.04)'; // Semi-transparent background
  ctx.fillStyle = 'rgb(256, 256, 256)'; // Semi-transparent background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the horizontal center line
  ctx.strokeStyle = 'rgb(0, 0, 0)'; // Black color
  ctx.lineWidth = 1; // One pixel width
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  // Draw the waveform
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(0, 200, 200)';
  ctx.lineWidth = 8;
  
  // Scale and center the waveform
  let waveform = Array.from(dataArray).map((value) => (value - 128) / 128);
  let croppedWaveform = cropWaveform(waveform);
  let waveEnd = 121;
  waveform = croppedWaveform.slice(0, waveEnd);
  
  const scale = canvas.height * 0.48;
  const offset = canvas.height / 2;

  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length-1, 0, canvas.width);
    const y = croppedWaveform[i] * scale + offset;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Request the next frame
  requestAnimationFrame(drawWaveform);
}

// Ensure the setup function is called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setup);

// Call setup when the window is resized
// window.addEventListener('resize', setup);

// Start Tone.js
Tone.start();