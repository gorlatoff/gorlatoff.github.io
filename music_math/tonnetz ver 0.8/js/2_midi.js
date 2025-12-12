// Simple Event Bus for MIDI events
const midiBus = new Vue({
    data: {
        midiThru: null // JZZ Widget
    },
    created() {
        this.midiThru = JZZ.Widget();
    },
    methods: {
        connect(output) { this.midiThru.connect(output); },
        disconnect(output) { this.midiThru.disconnect(output); },
        emitNoteOn(pitches, origin) {
            this.$emit('note-on', pitches, origin);
        },
        emitNoteOff(pitches) {
            this.$emit('note-off', pitches);
        }
    }
});

// Helper to find MIDI outputs
function connectMidiOut(name) {
    let out;
    if (name) {
        JZZ().info().inputs.forEach(dev => {
            if (dev.name.includes(name)) out = JZZ().openMidiOut(dev);
        });
    } else {
        out = JZZ().openMidiOut();
    }
    
    if (out) {
        midiBus.connect(out);
    }
}