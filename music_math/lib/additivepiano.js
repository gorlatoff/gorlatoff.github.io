// lib/additivepiano.js
(function() {
  if (typeof Utils === 'undefined' || typeof Synth === 'undefined') {
    console.warn('audio-lib.js not loaded, using stubs');
    window.PianoSynth = { 
      init() {}, 
      playNote() {}, 
      playInterval() {} 
    };
    return;
  }

  const ctx = Utils.initAudio();

  const PIANO = {
    harmonics: 16,
    envelope: { attack: 0.005, decay: 0.4, sustain: 0.2, release: 0.8 }
  };

  const pianoPartials = (freq) => 
    Array.from({ length: PIANO.harmonics }, (_, i) => {
      const n = i + 1;
      const oddBoost = (n % 2 === 1) ? 1.2 : 0.8;
      const gain = oddBoost / Math.pow(n, 1.8); 
      return {
        ratio: n,
        amp: gain,
        startDelay: 0,
        attack: PIANO.envelope.attack,
        decay: PIANO.envelope.decay + (n * 0.05),
        sustain: Math.max(PIANO.envelope.sustain - (n * 0.02), 0.1),
        release: PIANO.envelope.release
      };
    });

  const synth = new Synth(ctx, {
    partials: pianoPartials,
    type: 'sine'
  });
  synth.connect(ctx.destination);

  window.PianoSynth = {
    ctx,
    
    init() {
      if (ctx.state === 'suspended') ctx.resume();
    },

    playNote(ratio, duration = 0.5, velocity = 0.4) {
      this.init();
      const baseFreq = 220;
      const freq = baseFreq * ratio.toDecimal();
      synth.triggerAttackRelease('note_' + Date.now(), freq, duration, velocity);
    },

    playInterval(noteA, noteB, duration = 0.6) {
      this.init();
      const baseFreq = 220;
      const freqA = baseFreq * noteA.toDecimal();
      const freqB = baseFreq * noteB.toDecimal();
      
      synth.triggerAttackRelease('interval_a_' + Date.now(), freqA, duration, 0.35);
      synth.triggerAttackRelease('interval_b_' + Date.now(), freqB, duration, 0.35);
    }
  };
})();