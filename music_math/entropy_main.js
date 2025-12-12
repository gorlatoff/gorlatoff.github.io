// ============================================
// entropy_main.js - Harmonic Entropy App
// Uses audio-lib.js primitives directly
// ============================================

// ------------------ Audio State ------------------
let audioCtx = null;
let synths = [null, null];
let filters = [null, null];
let analysers = [null, null];
let reverbNode = null;

const baseFrequency = 440;
const audioParams = {
  type: "sawtooth",
  filterFrequency: 1000,
  filterType: "lowpass",
  attack: 0.05,
  release: 0.2,
  sustain: 0.5,
};

let noteIndicators = [
  { noteIndex: 0, x: null, opacity: 0 },
  { noteIndex: 1, x: 0, opacity: 0 },
];

let isMouseDown = false;
let tonicTimeout = null;

// ------------------ Chart State ------------------
let chartRenderer = null;
let entropyCalc = null;

// ------------------ Audio Functions ------------------
async function initAudio() {
  if (audioCtx) return;
  
  audioCtx = AudioLib.Utils.initAudio();
  
  // Reverb (shared)
  reverbNode = audioCtx.createConvolver();
  reverbNode.buffer = AudioLib.Utils.createImpulse(audioCtx, 1.0, 2.0);
  const reverbMix = audioCtx.createGain();
  reverbMix.gain.value = 0.3;
  reverbNode.connect(reverbMix);
  reverbMix.connect(audioCtx.destination);
  
  // Two independent synths
  for (let i = 0; i < 2; i++) {
    synths[i] = new AudioLib.Synth(audioCtx, {
      type: audioParams.type,
      envelope: {
        attack: audioParams.attack,
        release: audioParams.release,
      }
    });
    
    filters[i] = audioCtx.createBiquadFilter();
    filters[i].type = audioParams.filterType;
    filters[i].frequency.value = audioParams.filterFrequency;
    
    analysers[i] = audioCtx.createAnalyser();
    analysers[i].fftSize = 256;
    
    // Chain: Synth -> Filter -> Analyser -> Destination
    //                       \-> Reverb
    synths[i].connect(filters[i]);
    filters[i].connect(analysers[i]);
    filters[i].connect(reverbNode);
    analysers[i].connect(audioCtx.destination);
  }
}

function centsToFrequency(cents) {
  return AudioLib.Utils.centsToFrequency(cents, baseFrequency);
}

function playNote(noteIndex, frequency) {
  if (!synths[noteIndex]) return;
  synths[noteIndex].noteOn(0, frequency, audioParams.sustain);
}

function stopNote(noteIndex) {
  if (!synths[noteIndex] || !audioCtx) return;
  synths[noteIndex].noteOff(0, audioCtx.currentTime);
}

function setNoteFrequency(noteIndex, frequency) {
  if (!synths[noteIndex]) return;
  synths[noteIndex].setFrequency(0, frequency, 0.01);
}

function getAnalyserLevel(noteIndex) {
  const analyser = analysers[noteIndex];
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

function updateVisualization() {
  let needsRedraw = false;
  
  for (let i = 0; i < 2; i++) {
    const newOpacity = getAnalyserLevel(i);
    if (Math.abs(noteIndicators[i].opacity - newOpacity) > 0.01) {
      noteIndicators[i].opacity = newOpacity;
      needsRedraw = true;
    }
  }
  
  if ((needsRedraw || isMouseDown) && chartRenderer) {
    chartRenderer.setNoteIndicators(noteIndicators);
    chartRenderer.requestDraw();
  }
  
  requestAnimationFrame(updateVisualization);
}

// ------------------ Entropy Helpers ------------------
function setStatus(msg) {
  const el = document.getElementById('status');
  if (el) el.textContent = msg;
}

function applyInversion(series, invert) {
  if (!Array.isArray(series) || !invert) return series;
  return series.map(p => ({ x: p.x, y: -p.y, label: p.label }));
}

// ------------------ Main ------------------
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("heChart");
  chartRenderer = new ChartRenderer(canvas);
  
  if (typeof UnifiedEntropyCalculator !== 'undefined') {
    entropyCalc = new UnifiedEntropyCalculator();
  } else {
    console.error("UnifiedEntropyCalculator not found");
    return;
  }

  const invertCheckbox = document.getElementById('invertCheck');
  const modeSelect = document.getElementById('modeSelect');
  const HEPlotDiv = document.getElementById("HEPlotDiv");

  // ------------------ Plot Update ------------------
  async function updatePlot() {
    if (!entropyCalc) return;

    const N = parseInt(document.getElementById("textN").value) || 3000;
    const mincents = parseFloat(document.getElementById("textmin").value) * 1200;
    const maxcents = parseFloat(document.getElementById("textmax").value) * 1200;
    const sVal = parseFloat(document.getElementById("sliders").value);
    const aVal = parseFloat(document.getElementById("slidera").value);
    const mode = modeSelect.value;
    const invert = invertCheckbox.checked;

    setStatus('computing...');

    await entropyCalc.generateRatios({ N, method: mode });

    const curveRaw = entropyCalc.calculateCurve({
      mincents, maxcents, s: sVal, a: aVal, res: 0.5
    });

    const minima = entropyCalc.findExtrema(curveRaw, 0.001);
    const annotationsRaw = entropyCalc.annotateExtrema(minima, 15);

    const curve = applyInversion(curveRaw, invert);
    const annotations = applyInversion(annotationsRaw, invert);

    chartRenderer.plotHE(curve, annotations, invert);
    setStatus(`${mode}: ${curve.length} pts, ${entropyCalc.ratios.length} ratios`);
  }

  // ------------------ Mouse Interaction ------------------
  function getXValueFromEvent(event) {
    if (!chartRenderer?.currentView) return null;
    const rect = chartRenderer.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const { paddingLeft, paddingRight } = chartRenderer.options;
    const graphWidth = rect.width - paddingLeft - paddingRight;
    if (graphWidth <= 0) return null;
    
    const normalizedX = Math.max(0, Math.min(1, (clickX - paddingLeft) / graphWidth));
    const { xMin, xMax } = chartRenderer.currentView;
    return xMin + normalizedX * (xMax - xMin);
  }

  HEPlotDiv.addEventListener("mousedown", async (event) => {
    if (event.button !== 0) return;
    
    await initAudio();
    
    const xValue = getXValueFromEvent(event);
    if (xValue === null) return;

    isMouseDown = true;
    document.body.classList.add("dragging");

    // Stop any playing notes
    stopNote(0);
    stopNote(1);
    if (tonicTimeout) {
      clearTimeout(tonicTimeout);
      tonicTimeout = null;
    }

    // Play note at cursor
    noteIndicators[0].x = xValue;
    noteIndicators[0].opacity = 1;
    playNote(0, centsToFrequency(xValue));

    // Reset tonic indicator
    noteIndicators[1].x = 0;
    noteIndicators[1].opacity = 0;

    // Schedule tonic with delay
    const delay = parseFloat(document.getElementById("noteDelay").value) * 1000;
    tonicTimeout = setTimeout(() => {
      playNote(1, baseFrequency);
      noteIndicators[1].opacity = 1;
      chartRenderer.requestDraw();
      tonicTimeout = null;
    }, delay);

    chartRenderer.setNoteIndicators(noteIndicators);
    chartRenderer.requestDraw();
  });

  document.addEventListener("mousemove", (event) => {
    if (!isMouseDown) return;
    
    const xValue = getXValueFromEvent(event);
    if (xValue === null) return;

    noteIndicators[0].x = xValue;
    setNoteFrequency(0, centsToFrequency(xValue));

    chartRenderer.setNoteIndicators(noteIndicators);
    chartRenderer.requestDraw();
  });

  document.addEventListener("mouseup", (event) => {
    if (event.button !== 0 || !isMouseDown) return;

    isMouseDown = false;
    document.body.classList.remove("dragging");

    stopNote(0);
    stopNote(1);

    if (tonicTimeout) {
      clearTimeout(tonicTimeout);
      tonicTimeout = null;
    }

    noteIndicators[0].x = null;
    noteIndicators[0].opacity = 0;
    noteIndicators[1].opacity = 0;

    chartRenderer.setNoteIndicators(noteIndicators);
    chartRenderer.requestDraw();
  });

  // ------------------ UI Controls ------------------
  modeSelect.addEventListener("change", updatePlot);
  invertCheckbox.addEventListener("change", updatePlot);

  document.getElementById("slidera").addEventListener("input", (e) => {
    document.getElementById("aval").textContent = `Bandwidth (a): ${parseFloat(e.target.value).toFixed(2)}`;
    updatePlot();
  });

  document.getElementById("sliders").addEventListener("input", (e) => {
    document.getElementById("sval").textContent = `Smoothing (s): ${parseFloat(e.target.value).toFixed(2)}%`;
    updatePlot();
  });

  document.getElementById("noteDelay").addEventListener("input", (e) => {
    document.getElementById("noteDelayLabel").textContent = `Note Delay: ${parseFloat(e.target.value).toFixed(2)}s`;
  });

  document.getElementById("textN").addEventListener("change", updatePlot);
  document.getElementById("textmin").addEventListener("change", updatePlot);
  document.getElementById("textmax").addEventListener("change", updatePlot);

  document.querySelectorAll(".stepper-button").forEach((btn) => {
    btn.addEventListener("click", function() {
      const input = document.getElementById(this.dataset.target);
      let val = parseInt(input.value) || 0;
      const step = parseInt(input.step) || 1;
      val += this.classList.contains("minus") ? -step : step;
      
      if (this.dataset.target === "textmin" || this.dataset.target === "textmax") {
        val = Math.max(-2, Math.min(5, val));
      } else if (this.dataset.target === "textN") {
        val = Math.max(10, val);
      }
      
      input.value = val;
      updatePlot();
    });
  });

  // ------------------ Init ------------------
  updatePlot();
  setTimeout(updateVisualization, 200);
});