document.addEventListener('DOMContentLoaded', () => {
    
    new Vue({
        el: '#app',
        data: {
            notes: Array.from({length: 12}, (_, i) => ({id: i, count: 0})),
            type: 'tonnetz',
            trace: false,
            showInfo: false,
            midiConnected: false,
            audioStarted: false, // Флаг для оверлея
            synth: null
        },
        mounted() {
            // Setup Bus Listeners
            midiBus.$on('note-on', this.onNoteOn);
            midiBus.$on('note-off', this.onNoteOff);
            midiBus.midiThru.connect(this.onMidiMessage);
        },
        methods: {
            // Запуск аудио по клику пользователя
            startAudio() {
                if (window.JZZ) {
                    // Инициализация звука должна быть здесь
                    this.synth = JZZ.synth.Tiny();
                    midiBus.midiThru.connect(this.synth);
                    
                    // Проверка устройств
                    JZZ().or(() => console.log('MIDI Engine failed'));
                    JZZ().onChange(this.handleDeviceChange);
                    
                    // Безопасная проверка inputs
                    setTimeout(() => {
                        const info = JZZ().info();
                        if(info && info.inputs && info.inputs.length > 0) {
                            this.midiConnected = true;
                        }
                    }, 500);
                }
                this.audioStarted = true;
            },
            toggleInfo() {
                this.showInfo = !this.showInfo;
            },
            handleDeviceChange(changes) {
                if (changes && changes.inputs) {
                    if (changes.inputs.added) {
                        changes.inputs.added.forEach(dev => {
                            JZZ().openMidiIn(dev.name).connect(midiBus.midiThru);
                            this.midiConnected = true;
                        });
                    }
                    if (changes.inputs.removed) {
                        const info = JZZ().info();
                        this.midiConnected = info && info.inputs && info.inputs.length > 0;
                    }
                }
            },
            onMidiMessage(msg) {
                if (!msg) return;
                
                msg.isNoteOn = msg.isNoteOn ? msg.isNoteOn() : false;
                msg.isNoteOff = msg.isNoteOff ? msg.isNoteOff() : false;
                
                // JZZ helpers might be missing if raw msg, adding fallback
                const getNote = msg.getNote ? msg.getNote() : msg[1];
                const getChannel = msg.getChannel ? msg.getChannel() : (msg[0] & 0xF);

                if (getChannel !== 9) {
                    const standardIdx = Tonnetz.Math.mod(getNote + 3, 12);
                    
                    if (msg.isNoteOn) this.notes[standardIdx].count++;
                    else if (msg.isNoteOff && this.notes[standardIdx].count > 0) this.notes[standardIdx].count--;
                    
                    midiBus.$emit('midi-event', {
                        isNoteOn: msg.isNoteOn,
                        isNoteOff: msg.isNoteOff,
                        note: getNote,
                        channel: getChannel,
                        origin: msg.origin
                    });
                }
            },
            onNoteOn(pitches, origin) {
                if (!this.synth) return;
                pitches.forEach(p => {
                    const msg = JZZ.MIDI.noteOn(0, p, 100);
                    msg.origin = origin;
                    midiBus.midiThru.send(msg);
                });
            },
            onNoteOff(pitches) {
                if (!this.synth) return;
                pitches.forEach(p => {
                    midiBus.midiThru.noteOff(0, p, 100);
                });
            }
        }
    });
});