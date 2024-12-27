if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  alert('Web MIDI API is not supported in this browser.');
}

function onMIDISuccess(midiAccess) {
  const outputs = Array.from(midiAccess.outputs.values());
  if (outputs.length === 0) {
    console.log('No MIDI outputs available.');
    return;
  }

  const midiOutput = outputs[0];
  console.log('MIDI output detected:', midiOutput.name);

  // Играть тестовую ноту (C4) на 1 секунду
  const note = 60; // C4
  const velocity = 100; // Громкость
  const duration = 1000; // Миллисекунды

  // Включить ноту
  midiOutput.send([0x90, note, velocity]); 
  setTimeout(() => {
    // Выключить ноту
    midiOutput.send([0x80, note, 0]);
  }, duration);
}

function onMIDIFailure() {
  console.error('Failed to access MIDI devices.');
}
