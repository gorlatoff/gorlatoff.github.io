/* === Scene Renderer === */
class TonnetzRenderer {
    constructor(svgGroup) {
        this.group = svgGroup;
    }

    render(bounds, mode) {
        const nodes = window.GridLogic.getNodes(bounds, mode);
        let html = '';

        // 1. Calculate positions and RAW pitches
        const nodeData = nodes.map(n => {
            const pos = (mode === 'tonnetz') 
                ? Tonnetz.Geometry.logicalToSvgTonnetz(n)
                : Tonnetz.Geometry.logicalToSvgRect(n);
            const pitch = window.GridLogic.getNodePitchRaw(n, mode);
            return { n, pos, pitch };
        });

        // 2. Trichords (Triangles) - FIRST (so they are behind nodes)
        if (mode === 'tonnetz') {
            nodeData.forEach(d => {
                const { n, pos, pitch } = d;
                
                // Triangle 1: (x,y), (x+1,y), (x,y+1)
                const nRight = nodeData.find(nd => nd.n.x === n.x + 1 && nd.n.y === n.y);
                const nDown = nodeData.find(nd => nd.n.x === n.x && nd.n.y === n.y + 1);
                
                if (nRight && nDown) {
                    html += window.SvgBuilder.createTrichord(
                        [pos, nRight.pos, nDown.pos],
                        [pitch, nRight.pitch, nDown.pitch]
                    );
                }
                
                // Triangle 2: (x,y), (x-1,y+1), (x,y+1)
                const nLeftDown = nodeData.find(nd => nd.n.x === n.x - 1 && nd.n.y === n.y + 1);
                if (nLeftDown && nDown) {
                    html += window.SvgBuilder.createTrichord(
                        [pos, nLeftDown.pos, nDown.pos],
                        [pitch, nLeftDown.pitch, nDown.pitch]
                    );
                }
            });
        }

        // 3. Dichords (Lines)
        nodeData.forEach(d => {
            const { n, pos, pitch } = d;
            const neighbors = [];
            
            if (mode === 'tonnetz') {
                neighbors.push({ dx: 1, dy: 0 }); // Right
                neighbors.push({ dx: 0, dy: 1 }); // Down
                neighbors.push({ dx: -1, dy: 1 }); // Diagonal
            } else {
                neighbors.push({ dx: 1, dy: 0 });
                neighbors.push({ dx: 0, dy: 1 });
            }

            neighbors.forEach(offset => {
                const neighbor = nodeData.find(nd => nd.n.x === n.x + offset.dx && nd.n.y === n.y + offset.dy);
                if (neighbor) {
                    html += window.SvgBuilder.createDichord(
                        pos.x, pos.y, neighbor.pos.x, neighbor.pos.y,
                        pitch, neighbor.pitch
                    );
                }
            });
        });

        // 4. Nodes (Circles) - LAST (on top)
        nodeData.forEach(d => {
            html += window.SvgBuilder.createNode(d.pos.x, d.pos.y, d.pitch, mode);
        });

        this.group.innerHTML = html;
    }
}

/* === Viewport Controller (Без изменений) === */
class ViewportController {
    constructor(svgElement, contentGroup) {
        this.svg = svgElement;
        this.group = contentGroup;
        this.state = { tx: 0, ty: 0, scale: 2 };
        this.isDragging = false;
        this.lastPos = { x: 0, y: 0 };
        this.viewSize = { w: 1000, h: 600 };
        this.attachEvents();
        this.updateTransform();
    }
    attachEvents() {
        this.svg.addEventListener('pointerdown', e => {
            // Если клик не попал в интерактивный элемент (.tonnetz-el), начинаем драг
            if (!e.target.closest('.tonnetz-el')) {
                this.isDragging = true;
                this.lastPos = { x: e.clientX, y: e.clientY };
                this.svg.setPointerCapture(e.pointerId);
                this.svg.style.cursor = 'grabbing';
            }
        });
        this.svg.addEventListener('pointermove', e => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.lastPos.x;
            const dy = e.clientY - this.lastPos.y;
            this.state.tx += dx / this.state.scale;
            this.state.ty += dy / this.state.scale;
            this.lastPos = { x: e.clientX, y: e.clientY };
            this.updateTransform();
        });
        const stopDrag = (e) => {
            this.isDragging = false;
            if (this.svg.hasPointerCapture(e.pointerId)) this.svg.releasePointerCapture(e.pointerId);
            this.svg.style.cursor = 'grab';
        };
        this.svg.addEventListener('pointerup', stopDrag);
        this.svg.addEventListener('pointerleave', stopDrag);
        new ResizeObserver(entries => {
            for(let entry of entries) {
                this.viewSize.w = entry.contentRect.width;
                this.viewSize.h = entry.contentRect.height;
            }
        }).observe(this.svg);
    }
    updateTransform() {
        this.group.setAttribute('transform', `scale(${this.state.scale}) translate(${this.state.tx} ${this.state.ty})`);
    }
    getBounds() {
        return {
            xmin: -this.state.tx,
            ymin: -this.state.ty,
            xmax: -this.state.tx + this.viewSize.w / this.state.scale,
            ymax: -this.state.ty + this.viewSize.h / this.state.scale
        };
    }
}