/* === MIXIN: Click Interaction === */
window.clickToPlayMixin = {
    props: {
        pitches: { type: Array, required: true },
        toggle: { type: Boolean, default: false },
        clicklock: { type: Boolean, default: false },
        id: { default: undefined }
    },
    data: () => ({ clicked: false }),
    methods: {
        handleDown() {
            if (this.toggle) {
                if (!this.clicked) {
                    this.clicked = true;
                    midiBus.emitNoteOn(this.pitches, { parent: this.$parent, id: this.id });
                } else {
                    this.clicked = false;
                    midiBus.emitNoteOff(this.pitches);
                }
            } else if (!this.clicked && !this.clicklock) {
                this.clicked = true;
                midiBus.emitNoteOn(this.pitches, { parent: this.$parent, id: this.id });
            }
        },
        handleUp() {
            if (!this.toggle && this.clicked) {
                this.clicked = false;
                midiBus.emitNoteOff(this.pitches);
            }
        },
        handleEnter(e) {
            if (!this.toggle && e.pressure !== 0) this.handleDown();
        }
    }
};

/* === MIXIN: Activable State === */
window.activableMixin = {
    props: {
        notes: { type: Array, required: true },
        forceState: { type: Number, default: -1 } // -1: auto, 0: inactive, 1: visited, 2: active
    },
    computed: {
        isActive() {
            return this.forceState === 2 || 
                   (this.forceState === -1 && this.notes.every(n => n.count > 0));
        },
        isVisited() { return this.forceState === 1; }
    }
};

/* === MIXIN: Trajectory Logic (FIXED) === */
window.trajectoryMixin = {
    props: {
        trace: { type: Boolean, default: false },
        intervals: Array,
        // notes is global, but we use activeNodes locally
    },
    data: () => ({
        trajectory: [],
        activeNodes: [],
        visitedSet: new Set(),
        noteBuffer: [],
        noteOffBuffer: [],
        chordTimer: null
    }),
    watch: {
        trace() { this.resetTrajectory(); },
        intervals() { this.resetTrajectory(); }
    },
    mounted() {
        midiBus.$on('midi-event', this.handleMidiDispatch);
    },
    methods: {
        getStatus(node) {
            if (!this.trace) return -1;
            const key = `${node.x},${node.y}`;
            const isActive = this.activeNodes.some(n => n.x === node.x && n.y === node.y);
            if (isActive) return 2;
            if (this.visitedSet.has(key)) return 1;
            return 0;
        },
        getChordStatus(nodes) {
            if (!this.trace) return -1;
            const isActive = nodes.every(n => this.activeNodes.some(an => an.x === n.x && an.y === n.y));
            if (isActive) return 2;
            const key = this.genKey(nodes);
            if (this.visitedSet.has(key)) return 1;
            return 0;
        },
        genKey(nodes) { return nodes.map(n => `${n.x},${n.y}`).join(' '); },
        
        resetTrajectory() {
            this.trajectory = [];
            this.activeNodes = [];
            this.visitedSet.clear();
        },

        // --- Voice Leading Math ---
        closestNode(referenceNode, targetPitch) {
            const range = 3;
            let bestNode = null;
            let minKeyDist = Infinity;

            for (let dx = -range; dx <= range; dx++) {
                for (let dy = -range; dy <= range; dy++) {
                    const candidate = { x: referenceNode.x + dx, y: referenceNode.y + dy };
                    const pitches = this.node2Pitches([candidate]);
                    
                    if (Tonnetz.Math.mod(pitches[0], 12) === Tonnetz.Math.mod(targetPitch, 12)) {
                        const dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dx-dy); 
                        if (dist < minKeyDist) {
                            minKeyDist = dist;
                            bestNode = candidate;
                        }
                    }
                }
            }
            return bestNode || {x:0, y:0}; // Fallback
        },

        addToTrajectory(pitches, origin) {
            if (!this.trace) return;

            if (origin && origin.parent === this) {
                 origin.id.forEach(node => {
                     if (pitches.some(p => Tonnetz.Math.mod(p, 12) === Tonnetz.Math.mod(this.node2Pitches([node])[0], 12))) {
                         this.activateNode(node);
                     }
                 });
            } else {
                pitches.forEach(pitch => {
                    if (!this.isReachable(pitch)) return;
                    const reference = this.trajectory.length > 0 
                        ? this.trajectory[this.trajectory.length - 1] 
                        : {x: 0, y: 0};
                    this.activateNode(this.closestNode(reference, pitch));
                });
            }
            this.updateChords();
        },

        activateNode(node) {
            this.trajectory.push(node);
            this.activeNodes.push(node);
            this.visitedSet.add(this.genKey([node]));
        },

        updateChords() {
            // Check neighbors in active set
            for (let i = 0; i < this.activeNodes.length; i++) {
                for (let j = i + 1; j < this.activeNodes.length; j++) {
                    const n1 = this.activeNodes[i];
                    const n2 = this.activeNodes[j];
                    if (Math.abs(n1.x - n2.x) <= 1 && Math.abs(n1.y - n2.y) <= 1) {
                         this.visitedSet.add(this.genKey([n1, n2]));
                         this.visitedSet.add(this.genKey([n2, n1]));
                    }
                }
            }
        },

        removeActive(pitches) {
            if (!this.trace) return;
            pitches.forEach(pitch => {
                const idx = this.activeNodes.findIndex(n => 
                    Tonnetz.Math.mod(this.node2Pitches([n])[0], 12) === Tonnetz.Math.mod(pitch, 12)
                );
                if (idx !== -1) this.activeNodes.splice(idx, 1);
            });
        },

        isReachable(pitch) {
            const gcd = Tonnetz.Math.gcd(this.intervals[0], 
                        Tonnetz.Math.gcd(this.intervals[1], this.intervals[2] || 12));
            return (pitch % gcd) === 0;
        },

        handleMidiDispatch(e) {
             if (!this.trace || e.channel === 9) return;
             if (e.isNoteOn) {
                 if (e.origin && e.origin.parent === this) {
                     this.addToTrajectory([e.note], e.origin);
                 } else {
                     this.queueForClustering(e.note);
                 }
             } else if (e.isNoteOff) {
                 this.dequeueForClustering(e.note);
             }
         },
         queueForClustering(pitch) {
             this.noteBuffer.push(pitch);
             if (this.chordTimer) clearTimeout(this.chordTimer);
             this.chordTimer = setTimeout(() => this.processBuffer(), 50);
         },
         dequeueForClustering(pitch) {
             if (this.noteBuffer.length > 0) this.noteOffBuffer.push(pitch);
             else this.removeActive([pitch]);
         },
         processBuffer() {
             if (this.noteBuffer.length) this.addToTrajectory(this.noteBuffer);
             this.noteBuffer = [];
             this.noteOffBuffer.forEach(p => this.removeActive([p]));
             this.noteOffBuffer = [];
         },
         // Helper for mixin internal usage
         node2Pitches(nodes) {
             if (!this.intervals) return [0];
             return nodes.map(n => {
                 const P = 81 - n.x * this.intervals[0] + n.y * (this.intervals[2]-12);
                 return Math.max(P, Tonnetz.Math.mod(P, 12));
             });
         }
    }
};