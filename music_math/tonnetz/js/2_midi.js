/* === Simple Event Emitter & MIDI Bus === */
class MidiBus {
    constructor() {
        this.listeners = {};
        this.midiThru = null; // JZZ Widget init later
    }

    init() {
        if (window.JZZ) {
            this.midiThru = JZZ.Widget();
        }
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    off(event, fn) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== fn);
    }

    emit(event, ...args) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(fn => fn(...args));
        }
    }

    // API Wrappers
    connect(output) { if(this.midiThru) this.midiThru.connect(output); }
    disconnect(output) { if(this.midiThru) this.midiThru.disconnect(output); }
    
    sendNoteOn(pitches, velocity = 100) {
        if (!this.midiThru) return;
        pitches.forEach(p => {
            this.midiThru.noteOn(0, p, velocity);
        });
        // Уведомляем UI локально
        this.emit('local-note-on', pitches); 
    }

    sendNoteOff(pitches) {
        if (!this.midiThru) return;
        pitches.forEach(p => {
            this.midiThru.noteOff(0, p);
        });
        // Уведомляем UI локально
        this.emit('local-note-off', pitches);
    }
}

window.midiBus = new MidiBus();