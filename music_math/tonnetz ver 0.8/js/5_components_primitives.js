/* === WRAPPER: Handles Clicks & SVG transforms === */
Vue.component('click-wrapper', {
    mixins: [window.clickToPlayMixin],
    props: ['transform'],
    template: `
        <g :transform="transform" 
           @pointerdown.stop="handleDown" 
           @pointerup.stop="handleUp"
           @pointerenter.stop="handleEnter" 
           @pointerleave.stop="handleUp"
           style="cursor: pointer">
            <slot></slot>
        </g>
    `
});

/* === BASE CHORD LOGIC === */
window.chordBase = {
    mixins: [window.activableMixin],
    props: {
        shape: { type: Array, required: true }
    },
    computed: {
        coords() { return this.shape.map(Tonnetz.Geometry.logicalToSvg); },
        center() {
            return {
                x: Tonnetz.Math.average(this.coords.map(c => c.x)),
                y: Tonnetz.Math.average(this.coords.map(c => c.y))
            };
        }
    }
};

/* === TONNETZ COMPONENTS === */
window.NoteTonnetz = {
    mixins: [window.activableMixin],
    props: ['notes'],
    computed: {
        noteName() { return this.getString(['notes', this.notes[0].id]); },
        color() { return Tonnetz.Music.colorMap[this.notes[0].id]; }
    },
    template: `
        <g class="tonnetzNote">
            <circle :class="{activeNode: isActive, visitedNode: isVisited}"
                    :style="isActive ? {fill: color, stroke: color} : {}"
                    r="12" />
            <text dy="1" style="pointer-events: none;">{{ noteName }}</text>
        </g>
    `
};

window.DichordTonnetz = {
    extends: window.chordBase,
    computed: {
        lineCoords() {
            return {
                x1: this.coords[0].x, y1: this.coords[0].y,
                x2: this.coords[1].x, y2: this.coords[1].y
            };
        }
    },
    template: `
        <g class="tonnetzDichord">
            <line :class="{activeDichord: isActive, visitedDichord: isVisited}" v-bind="lineCoords" />
            <circle :class="{activeDichord: isActive}" :cx="center.x" :cy="center.y" r="3" />
        </g>
    `
};

window.TrichordTonnetz = {
    extends: window.chordBase,
    computed: {
        points() { return this.coords.map(c => `${c.x},${c.y}`).join(' '); }
    },
    template: `
        <polygon class="tonnetzTrichord" 
                 :class="{activeTrichord: isActive, visitedTrichord: isVisited}" 
                 :points="points" />
    `
};

/* === CHICKEN WIRE COMPONENTS === */
window.NoteChicken = {
    mixins: [window.activableMixin],
    props: ['notes'],
    computed: {
        points() {
            const s = Tonnetz.Geometry.baseSize; 
            const xs = Tonnetz.Geometry.xstep;
            const pts = [
                {x: +s*xs/3, y: +s/2}, {x: -s*xs/3, y: +s/2},
                {x: -s*2*xs/3, y: 0}, {x: -s*xs/3, y: -s/2},
                {x: +s*xs/3, y: -s/2}, {x: +s*2*xs/3, y: 0}
            ];
            return pts.map(p => `${p.x},${p.y}`).join(' ');
        },
        color() { return Tonnetz.Music.colorMap[this.notes[0].id]; }
    },
    template: `
        <polygon class="chickenNote" 
                 :class="{activeNode: isActive, visitedNode: isVisited}"
                 :style="isActive ? {fill: color, stroke: color, fillOpacity: 0.4} : {}"
                 :points="points" />
    `
};

window.DichordChicken = {
    extends: window.chordBase,
    computed: {
        lineCoords() {
            const c0 = this.coords[0];
            const c1 = this.coords[1];
            const dx = c1.x - c0.x;
            const dy = c1.y - c0.y;
            
            const rotate = (point) => ({
                x: (dx * point.x - dy * point.y),
                y: (dy * point.x + dx * point.y)
            });
            
            const xs = Tonnetz.Geometry.xstep;
            const p1 = { x: 0.5, y: xs / 3 };
            const p2 = { x: 0.5, y: -xs / 3 };
            
            const r1 = rotate(p1);
            const r2 = rotate(p2);
            
            return { x1: r1.x, y1: r1.y, x2: r2.x, y2: r2.y };
        }
    },
    template: `
        <g class="chickenDichord">
            <line :class="{activeDichord: isActive, visitedDichord: isVisited}" 
                  v-bind="lineCoords" />
            <circle :class="{activeDichord: isActive}" 
                    :cx="center.x - coords[0].x" 
                    :cy="center.y - coords[0].y" 
                    r="2" />
        </g>
    `
};

window.TrichordChicken = {
    extends: window.chordBase,
    props: ['notes'],
    computed: {
        isMinorish() { return this.shape[0].y !== this.shape[1].y; },
        chordName() { return this.getString(['notes', this.notes[2].id]); }
    },
    template: `
        <g class="chickenTrichord" :class="{minorish: isMinorish}">
            <circle :class="{activeTrichord: isActive, visitedTrichord: isVisited}"
                    :cx="center.x" :cy="center.y" r="14" />
            <text :x="center.x" :y="center.y">{{ chordName }}</text>
        </g>
    `
};