/* === DRAG & ZOOM SVG WRAPPER === */
Vue.component('drag-zoom-svg', {
    props: {
        width: { default: 1000 },
        height: { default: 600 },
        lock: { type: Boolean, default: false }
    },
    data: () => ({
        tx: 0, ty: 0, scale: 2, 
        dragging: false, lastPos: {x:0, y:0}
    }),
    computed: {
        transform() { return `scale(${this.scale}) translate(${this.tx} ${this.ty})`; },
        viewbox() { return `0 0 ${this.width} ${this.height}`; },
        bounds() {
            return {
                xmin: -this.tx,
                ymin: -this.ty,
                xmax: -this.tx + this.width / this.scale,
                ymax: -this.ty + this.height / this.scale
            };
        }
    },
    methods: {
        startDrag(e) {
            if (this.lock) return;
            this.dragging = true;
            this.lastPos = { x: e.clientX, y: e.clientY };
            this.$el.setPointerCapture(e.pointerId);
        },
        doDrag(e) {
            if (!this.dragging) return;
            const dx = e.clientX - this.lastPos.x;
            const dy = e.clientY - this.lastPos.y;
            this.tx += dx / this.scale;
            this.ty += dy / this.scale;
            this.lastPos = { x: e.clientX, y: e.clientY };
        },
        endDrag(e) { 
            this.dragging = false; 
            if(this.$el.releasePointerCapture) this.$el.releasePointerCapture(e.pointerId);
        }
    },
    template: `
        <svg :viewBox="viewbox" style="width:100%; height:100%; touch-action:none; background: transparent; cursor: grab;"
             :style="{cursor: dragging ? 'grabbing' : 'grab'}"
             @pointerdown="startDrag" @pointermove="doDrag" @pointerup="endDrag" @pointerleave="endDrag">
            <g :transform="transform">
                <slot :bounds="bounds"></slot>
            </g>
        </svg>
    `
});

/* === GENERIC GRID GENERATOR (Mixin) === */
window.gridGeneratorMixin = {
    // ИСПРАВЛЕНО: Добавлен 'notes' в props, чтобы this.notes был доступен
    props: ['bounds', 'intervals', 'notes'], 
    computed: {
        gridNodes() {
            if (!this.bounds) return [];
            const nodes = [];
            const bs = Tonnetz.Geometry.baseSize;
            const xs = Tonnetz.Geometry.xstep;
            
            const xmin = Math.floor(this.bounds.xmin / (bs * xs));
            const xmax = Math.ceil(this.bounds.xmax / (bs * xs));
            
            for (let xi = xmin; xi <= xmax; xi++) {
                const ymin = Math.floor(this.bounds.ymin / bs - xi / 2);
                const ymax = Math.ceil(this.bounds.ymax / bs - xi / 2);
                for (let yi = ymin; yi <= ymax; yi++) nodes.push({x: xi, y: yi});
            }
            return nodes;
        }
    },
    methods: {
        node2Pitches(nodes) {
            if (!this.intervals) return [0];
            return nodes.map(n => {
                const P = 81 - n.x * this.intervals[0] + n.y * (this.intervals[2]-12);
                return Math.max(P, Tonnetz.Math.mod(P, 12));
            });
        },
        node2Notes(nodes) {
            if (!this.notes || !this.intervals) return [];
             return nodes.map(n => 
                this.notes[Tonnetz.Math.mod(-n.x * this.intervals[0] + n.y * this.intervals[2], 12)]
             );
        },
        nodePos(n) { 
            const p = Tonnetz.Geometry.logicalToSvg(n);
            return `translate(${p.x} ${p.y})`;
        },
        getShape(nodes) {
            const n0 = nodes[0];
            return nodes.map(n => ({ x: n.x - n0.x, y: n.y - n0.y }));
        },
        genKey(nodes) { return nodes.map(n => `${n.x}_${n.y}`).join('|'); }
    }
};

/* === TONNETZ PLAN VIEW === */
Vue.component('tonnetz-plan', {
    mixins: [window.gridGeneratorMixin, window.trajectoryMixin],
    components: { note: window.NoteTonnetz, dichord: window.DichordTonnetz, trichord: window.TrichordTonnetz },
    template: `
        <g>
            <click-wrapper v-for="n in trichordStateList" :key="'tri'+genKey(n.nodes)"
                :transform="nodePos(n.nodes[0])" :pitches="node2Pitches(n.nodes)">
                <trichord :shape="getShape(n.nodes)" :notes="node2Notes(n.nodes)" :force-state="n.status"/>
            </click-wrapper>
            
            <click-wrapper v-for="n in dichordStateList" :key="'di'+genKey(n.nodes)"
                :transform="nodePos(n.nodes[0])" :pitches="node2Pitches(n.nodes)">
                <dichord :shape="getShape(n.nodes)" :notes="node2Notes(n.nodes)" :force-state="n.status"/>
            </click-wrapper>
            
            <click-wrapper v-for="n in nodeStateList" :key="'no'+genKey([n.node])"
                :transform="nodePos(n.node)" :pitches="node2Pitches([n.node])">
                <note :notes="node2Notes([n.node])" :force-state="n.status"/>
            </click-wrapper>
        </g>
    `,
    computed: {
        nodeStateList() {
            return this.gridNodes.map(node => ({ node, status: this.getStatus(node) }));
        },
        dichordStateList() {
            const list = [];
            this.gridNodes.forEach(n => {
                list.push({ nodes: [n, {x:n.x+1, y:n.y}] }); 
                list.push({ nodes: [n, {x:n.x, y:n.y+1}] }); 
                list.push({ nodes: [n, {x:n.x-1, y:n.y+1}] });
            });
            return list.map(item => ({ ...item, status: this.getChordStatus(item.nodes) }));
        },
        trichordStateList() {
            const list = [];
            this.gridNodes.forEach(n => {
                list.push({ nodes: [n, {x:n.x+1, y:n.y}, {x:n.x, y:n.y+1}] });
                list.push({ nodes: [n, {x:n.x-1, y:n.y+1}, {x:n.x, y:n.y+1}] });
            });
            return list.map(item => ({ ...item, status: this.getChordStatus(item.nodes) }));
        }
    }
});

/* === CHICKEN WIRE VIEW === */
Vue.component('chicken-wire', {
    mixins: [window.gridGeneratorMixin, window.trajectoryMixin],
    components: { note: window.NoteChicken, dichord: window.DichordChicken, trichord: window.TrichordChicken },
    template: `
        <g>
            <click-wrapper v-for="n in nodeStateList" :key="'no'+genKey([n.node])"
                :transform="nodePos(n.node)" :pitches="node2Pitches([n.node])">
                <note :notes="node2Notes([n.node])" :force-state="n.status"/>
            </click-wrapper>
            
            <click-wrapper v-for="n in dichordStateList" :key="'di'+genKey(n.nodes)"
                :transform="nodePos(n.nodes[0])" :pitches="node2Pitches(n.nodes)">
                <dichord :shape="getShape(n.nodes)" :notes="node2Notes(n.nodes)" :force-state="n.status"/>
            </click-wrapper>

            <click-wrapper v-for="n in trichordStateList" :key="'tri'+genKey(n.nodes)"
                :transform="nodePos(n.nodes[0])" :pitches="node2Pitches(n.nodes)">
                <trichord :shape="getShape(n.nodes)" :notes="node2Notes(n.nodes)" :force-state="n.status"/>
            </click-wrapper>
        </g>
    `,
    computed: {
        nodeStateList() { 
            return this.gridNodes.map(node => ({ node, status: this.getStatus(node) })); 
        },
        dichordStateList() {
            const list = [];
            this.gridNodes.forEach(n => {
                 list.push({ nodes: [n, {x:n.x+1, y:n.y}] }); 
                 list.push({ nodes: [n, {x:n.x, y:n.y+1}] }); 
                 list.push({ nodes: [n, {x:n.x-1, y:n.y+1}] });
            });
            return list.map(item => ({ ...item, status: this.getChordStatus(item.nodes) }));
        },
        trichordStateList() {
            const list = [];
             this.gridNodes.forEach(n => {
                list.push({ nodes: [n, {x:n.x+1, y:n.y}, {x:n.x, y:n.y+1}] });
                list.push({ nodes: [n, {x:n.x-1, y:n.y+1}, {x:n.x, y:n.y+1}] });
            });
            return list.map(item => ({ ...item, status: this.getChordStatus(item.nodes) }));
        }
    }
});

/* === MAIN VIEW WRAPPER === */
Vue.component('tonnetz-view', {
    props: ['notes', 'trace', 'initType'],
    data() {
        return {
            type: this.initType || 'tonnetz',
            intervals: [3, 4, 5],
            presets: [
                [3, 4, 5], [2, 3, 7], [1, 5, 6]
            ]
        };
    },
    watch: {
        type(val) { this.$emit('update:type', val); }
    },
    template: `
        <div style="width:100%; height:100%; display:flex; flex-direction:column;">
            <drag-zoom-svg>
                <template v-slot:default="slotProps">
                    <tonnetz-plan v-if="type=='tonnetz'" 
                        :notes="notes" :intervals="intervals" 
                        :bounds="slotProps.bounds" :trace="trace">
                    </tonnetz-plan>
                    <chicken-wire v-else 
                        :notes="notes" :intervals="intervals" 
                        :bounds="slotProps.bounds" :trace="trace">
                    </chicken-wire>
                </template>
            </drag-zoom-svg>

            <div class="tonnetz-selector">
                <button v-for="(p, i) in presets" :key="i"
                    class="btn-select" :class="{active: intervals===p}"
                    @click="intervals = p">
                    {{ p.join(', ') }}
                </button>
                <div style="width:1px; background:var(--border-base); margin:0 8px;"></div>
                <button class="btn-select btn-dual" :class="{active: type=='chicken'}"
                    @click="type = (type=='tonnetz'?'chicken':'tonnetz')">
                    {{ getString('dual') }}
                </button>
            </div>
        </div>
    `
});

/* === INFO PANEL === */
Vue.component('info-panel', {
    props: ['infoType'],
    computed: {
        content() { return this.getString(`infos.${this.infoType}`); }
    },
    template: `
        <div class="info-body">
            <h2 class="app-title">Information</h2>
            <div v-html="content" style="color: var(--text-dim); text-align: justify; font-family: var(--font-ui); font-size: 14px;"></div>
        </div>
    `
});