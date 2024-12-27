OK

```
my-svelte-project/
├── src/
│   ├── App.svelte
│   ├── PianoRoll.svelte
│   └── main.js
├── public/
│   └── global.css
├── package.json
```

**package.json:**

```json
{
  "name": "my-svelte-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^2.0.1",
    "svelte": "^3.54.0",
    "vite": "^4.0.0"
  },
  "dependencies": {
    "tone": "^14.8.49"
  }
}

```

**src/main.js:**

```javascript
import App from './App.svelte';

const app = new App({
  target: document.body,
});

export default app;
```

**src/App.svelte:**

```svelte
<script>
  import PianoRoll from './PianoRoll.svelte';
  import * as Tone from 'tone';

  let notes = [];
  let selectedInstrument = 0;
  let isPlaying = false;
  let currentTime = 0;

  let instruments = [
    { id: 0, name: 'Piano', color: '#4CAF50' }, // Green
    { id: 1, name: 'Violin', color: '#2196F3' }, // Blue
    { id: 2, name: 'Flute', color: '#FFC107' }  // Amber
  ];

  const synths = new Map();

  $: {
    synths.clear();
    instruments.forEach(instrument => {
      synths.set(instrument.id, new Tone.Synth().toDestination());
    });
  }

  const play = async () => {
    if (isPlaying) return;

    await Tone.start();
    isPlaying = true;

    const loop = new Tone.Loop((time) => {
      currentTime = time;
    }, 0.01).start(0);

    const now = Tone.now();
    notes.forEach(note => {
      const synth = synths.get(note.instrument);
      synth.triggerAttackRelease(Tone.Frequency(note.pitch, 'midi').toNote(), note.length, now + note.startBeat);
    });

    Tone.Transport.scheduleOnce(() => {
      stop();
    }, now + notes.reduce((maxTime, note) => Math.max(maxTime, note.startBeat + note.length), 0));

    Tone.Transport.start();
  };

  const stop = () => {
    if (!isPlaying) return;
    isPlaying = false;
    currentTime = 0;
    Tone.Transport.stop();
    Tone.Transport.cancel();  // Clear any pending events
    synths.forEach(synth => synth.releaseAll());
  };
</script>

<h1>Piano Roll</h1>

<label for="instrument">Select Instrument:</label>
<select bind:value={selectedInstrument}>
  {#each instruments as instrument}
    <option value={instrument.id}>{instrument.name}</option>
  {/each}
</select>

<button on:click={play}>Play</button>
<button on:click={stop}>Stop</button>

<PianoRoll bind:notes {selectedInstrument} {instruments} {currentTime} />
```

**src/PianoRoll.svelte:**

```svelte
<script>
  import { onMount } from 'svelte';

  export let notes = [];
  export let selectedInstrument = 0;
  export let instruments = [];
  export let currentTime = 0;

  let canvas;
  let context;

  const gridSize = 20;
  const noteHeight = 10;
  const numBeats = 16;
  const midiNotes = 128;

  let width = numBeats * gridSize;
  let height = midiNotes * noteHeight;

  let draggingNote = null;
  let resizingNote = null;
  let dragStartX = 0;
  let resizeStartX = 0;

  onMount(() => {
    context = canvas.getContext('2d');
    redraw();
  });

  const yToPitch = (y) => midiNotes - Math.floor(y / noteHeight) - 1;
  const pitchToY = (pitch) => (midiNotes - pitch - 1) * noteHeight;

  const addNote = (x, y, instrument) => {
    const startBeat = Math.max(0, Math.floor(x / gridSize));
    const pitch = yToPitch(y);

    notes = [...notes, { startBeat, pitch, length: 1, instrument }];
    redraw();
  };

  const removeNote = (noteToRemove) => {
    notes = notes.filter(note => note !== noteToRemove);
    redraw();
  };

  const redraw = () => {
    if (!context) return;

    context.clearRect(0, 0, width, height);

    context.strokeStyle = '#ccc';
    for (let x = 0; x <= width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y <= height; y += noteHeight) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    notes.forEach(note => {
      const x = note.startBeat * gridSize;
      const y = pitchToY(note.pitch);
      const w = note.length * gridSize;
      const instrument = instruments.find(i => i.id === note.instrument);

      context.fillStyle = instrument.color;
      context.fillRect(x, y, w, noteHeight);
      context.strokeRect(x, y, w, noteHeight);
    });

    drawCursor();
  };

  const drawCursor = () => {
    if (!context) return;

    context.strokeStyle = 'red';
    context.lineWidth = 2;
    const x = currentTime * gridSize;

    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  };

  const mouseDownHandler = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let noteClicked = false;
    for (const note of notes) {
      const noteX = note.startBeat * gridSize;
      const noteY = pitchToY(note.pitch);
      const noteWidth = note.length * gridSize;

      if (
        x >= noteX &&
        x <= noteX + noteWidth &&
        y >= noteY &&
        y <= noteY + noteHeight
      ) {
        if (e.detail === 2) { // Double click
          removeNote(note);
          return;
        }

          selectedInstrument = note.instrument;
          draggingNote = note;
          dragStartX = x;
          noteClicked = true;
          break;
      }

      if (
        x >= noteX + noteWidth - 5 &&
        x <= noteX + noteWidth + 5 &&
        y >= noteY &&
        y <= noteY + noteHeight
      ) {
        resizingNote = note;
        resizeStartX = x;
        noteClicked = true;
        break;
      }
    }

    if (!noteClicked) {
      const correctedY = Math.floor(y / noteHeight) * noteHeight;
      addNote(x, correctedY, selectedInstrument);
    }
  };

  const mouseMoveHandler = (e) => {
    if (!draggingNote && !resizingNote) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (draggingNote) {

        const deltaBeats = Math.floor((x - dragStartX) / gridSize);
        draggingNote.startBeat = Math.max(0, draggingNote.startBeat + deltaBeats);
        dragStartX = x;

    } else if (resizingNote) {
        const deltaLength = Math.floor((x - resizeStartX) / gridSize);
        resizingNote.length = Math.max(1, resizingNote.length + deltaLength);
        resizeStartX = x;
    }

    redraw();
  };

  const mouseUpHandler = () => {
    draggingNote = null;
    resizingNote = null;
  };

  $: {
    redraw();
  }
</script>

<canvas
  bind:this={canvas}
  width={width}
  height={height}
  on:mousedown={mouseDownHandler}
  on:mousemove={mouseMoveHandler}
  on:mouseup={mouseUpHandler}
  on:mouseleave={mouseUpHandler}
></canvas>
```

**public/global.css:**

```css
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

canvas {
  border: 1px solid black;
  display: block;
  margin-top: 10px;
}

select {
  margin-bottom: 10px;
}
```

Key improvements:

* **Clearer separation of concerns:**  The `PianoRoll` component now handles all the drawing logic, making the `App` component cleaner.
* **Double-click to delete:**  Added double-click event handling to delete notes.
* **Note resizing:** Implemented note resizing by dragging the right edge.
* **Colored instruments:** Each instrument now has a distinct color.
* **Corrected note snapping:** Notes now snap to the grid correctly when added and moved.
* **Dragging improvements:** Dragging is smoother and prevents notes from going off-screen.
* **BPM and Quantization:** Functionality for BPM and quantization settings has been removed to simplify the code and focus on the core features.

This improved code provides a more complete and functional piano roll editor with a cleaner structure. I've focused on fixing the issues and enhancing the core functionality. Let me know if you have any other questions!