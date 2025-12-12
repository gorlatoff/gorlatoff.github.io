// Global audio-related state used by main.js / ChartRenderer
let audioContext = null;
let analysers = [null, null];
let currentNote1 = null, currentNote2 = null;
const baseFrequency = 440;
let isMouseDown = false;
const audioParams = {
  oscillatorType: "sawtooth",
  filterFrequency: 1000,
  filterType: "lowpass",
  gainAttackTime: 0.05,
  gainSustainLevel: 0.5,
  gainReleaseTime: 0.2,
};
let activeNoteIndicators = [
  { noteIndex: 0, x: null, opacity: 0 },
  { noteIndex: 1, x: 0, opacity: 0 },
];
let reverbNode = null;
let tonicTimeout = null;

async function initAudio() {
  if (!audioContext) {
    audioContext = AudioLib.Utils.initAudio();
    if (!reverbNode) {
      reverbNode = audioContext.createConvolver();
      reverbNode.buffer = AudioLib.Utils.createImpulse(audioContext, 1.0, 2.0);
      const reverbMix = audioContext.createGain(); reverbMix.gain.value = 0.3;
      reverbNode.connect(reverbMix); reverbMix.connect(audioContext.destination);
    }
  }
}
function createNote(frequency, startTime, noteIndex) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256; analysers[noteIndex] = analyser;
  oscillator.type = audioParams.oscillatorType; oscillator.frequency.value = frequency;
  filter.type = audioParams.filterType; filter.frequency.value = audioParams.filterFrequency;
  AudioLib.Envelope.attack(gainNode.gain, startTime, audioParams.gainSustainLevel, audioParams.gainAttackTime);
  oscillator.connect(filter); filter.connect(gainNode);
  gainNode.connect(analyser); gainNode.connect(reverbNode); analyser.connect(audioContext.destination);
  return { oscillator, gainNode };
}
function centsToFrequency(centsOffset) { return baseFrequency * Math.pow(2, centsOffset / 1200); }
function stopNote(note, stopTime) {
  if (note && note.gainNode && note.gainNode.gain && note.oscillator) {
    try {
      AudioLib.Envelope.release(note.gainNode.gain, stopTime, audioParams.gainReleaseTime);
      note.oscillator.stop(stopTime + audioParams.gainReleaseTime + 0.25);
    } catch(e){}
  }
}
function updateNoteIndicatorsOpacity(chartRenderer) {
  let needsRedraw = false;
  analysers.forEach((analyser, i) => {
    if (!analyser || !activeNoteIndicators[i]) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(dataArray);
    let level = 0;
    for (let j = 0; j < dataArray.length; j++) level += Math.abs(dataArray[j] - 128);
    level = dataArray.length > 0 ? level / dataArray.length : 0;
    const newOpacity = Math.min(1, Math.max(0, level / 40));
    if (Math.abs(activeNoteIndicators[i].opacity - newOpacity) > 0.01) {
      activeNoteIndicators[i].opacity = newOpacity; needsRedraw = true;
    }
    if (i === 1 && currentNote2 && activeNoteIndicators[i].opacity <= 0.01) { activeNoteIndicators[i].opacity = 0; needsRedraw = true; }
    if (i === 0 && !currentNote1 && activeNoteIndicators[i].opacity <= 0.01) { activeNoteIndicators[i].opacity = 0; needsRedraw = true; }
  });
  if ((needsRedraw || isMouseDown) && chartRenderer) {
    chartRenderer.setNoteIndicators(activeNoteIndicators);
    chartRenderer.requestDraw();
  }
  requestAnimationFrame(() => updateNoteIndicatorsOpacity(chartRenderer));
}

// экспонируем на глобальный объект, main.js использует
window.audioAPI = {
  initAudio,
  createNote,
  stopNote,
  centsToFrequency,
  activeNoteIndicators,
  updateNoteIndicatorsOpacity,
  setIsMouseDown(v){ isMouseDown = v; },
  setCurrentNotes(n1, n2){ currentNote1 = n1; currentNote2 = n2; }
};
