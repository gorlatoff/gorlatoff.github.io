// ------------------ ChartRenderer (рендер графика) ------------------
class ChartRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.data = [];
    this.annotations = [];
    this.options = {
      paddingTop: 20,
      paddingBottom: 30,
      paddingLeft: 40,
      paddingRight: 20,
      gridColor: "rgba(255,255,255,0.05)",
      textColor: "rgba(255,255,255,0.6)",
      annotationColor: "#BB86FC",
      lineColor: "#FFFFFF",
      noteIndicatorColor1: "rgba(30, 144, 255, 1)",
      noteIndicatorColor2: "rgba(255, 100, 0, 1)",
      lineWidth: 3,
      animationSpeed: 0.15,
      ...options,
    };
    this.currentView = { xMin: 0, xMax: 1200, yMin: 0, yMax: 1 };
    this.targetView = { ...this.currentView };
    this.animationFrameId = null;
    this.noteIndicators = [];
    this.isDrawing = false;
    this.drawRequestScheduled = false;
    this.pixelRatio = window.devicePixelRatio || 1;
    this.resizeObserver = new ResizeObserver(() => { this.requestDraw(); });
    if (this.canvas.parentElement) this.resizeObserver.observe(this.canvas.parentElement);
    this.resizeCanvas();
    this.requestDraw();
  }
  setAnnotations(annotations) { this.annotations = annotations || []; this.requestDraw(); }
  setNoteIndicators(indicators) { this.noteIndicators = indicators || []; }
  setData(data) { this.data = Array.isArray(data) ? data : []; this.autoScale(); }

  // plotHE теперь принимает флаг invert и сохраняет его в экземпляре,
  // чтобы draw() мог позиционировать подписи корректно.
  plotHE(HE, annotations, invert = false) {
    this.invert = !!invert; // true/false
    if (!HE || HE.length === 0) {
      this.setData([]); this.setAnnotations([]); return;
    }
    // сохраняем данные/аннотации и запускаем перерисовку/масштабирование
    this.setData(HE);
    this.setAnnotations(annotations || []);
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement; if (!parent) return false;
    const cssWidth = parent.clientWidth, cssHeight = parent.clientHeight;
    this.pixelRatio = window.devicePixelRatio || 1;
    const targetWidth = Math.round(cssWidth * this.pixelRatio);
    const targetHeight = Math.round(cssHeight * this.pixelRatio);
    if (cssWidth <= 0 || cssHeight <= 0) { if (this.canvas.width !== 0 || this.canvas.height !== 0) { this.canvas.width = 0; this.canvas.height = 0; return true; } return false; }
    if (this.canvas.width === targetWidth && this.canvas.height === targetHeight) return false;
    this.canvas.width = targetWidth; this.canvas.height = targetHeight;
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    return true;
  }
  autoScale() {
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    if (this.data.length > 0) {
      this.data.forEach((point) => {
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
        xMin = Math.min(xMin, point.x); xMax = Math.max(xMax, point.x);
        yMin = Math.min(yMin, point.y); yMax = Math.max(yMax, point.y);
      });
    }
    if (xMin === Infinity) { xMin = 0; xMax = 1200; yMin = 0; yMax = 1; }
    if (xMin === xMax) { xMin -= 100; xMax += 100; }
    if (yMin === yMax) { yMin -= 0.5; yMax += 0.5; }
    const xPadding = (xMax - xMin) * 0.01;
    const yPadding = (yMax - yMin) * 0.05;
    this.targetView.xMin = xMin - xPadding;
    this.targetView.xMax = xMax + xPadding;
    this.targetView.yMin = Math.floor((yMin - yPadding) * 10) / 10;
    this.targetView.yMax = Math.ceil((yMax + yPadding) * 10) / 10;
    this.startAnimationLoop();
  }
  startAnimationLoop() { if (this.animationFrameId === null) this.animationStep(); }
  stopAnimationLoop() { if (this.animationFrameId !== null) { cancelAnimationFrame(this.animationFrameId); this.animationFrameId = null; } }
  animationStep() {
    const speed = 1.0 - this.options.animationSpeed;
    let changed = false; const epsilon = 1e-5;
    for (const key of ['xMin','xMax','yMin','yMax']) {
      const current = this.currentView[key], target = this.targetView[key]; const diff = target - current;
      if (Math.abs(diff) > epsilon) { this.currentView[key] = current + diff * (1 - speed); changed = true; } else { this.currentView[key] = target; }
    }
    if (changed) { this.requestDraw(); this.animationFrameId = requestAnimationFrame(() => this.animationStep()); }
    else { this.stopAnimationLoop(); if (JSON.stringify(this.currentView) !== JSON.stringify(this.targetView)) { this.currentView = { ...this.targetView }; this.requestDraw(); } }
  }
  requestDraw() {
    if (!this.drawRequestScheduled) {
      this.drawRequestScheduled = true;
      requestAnimationFrame(() => { this.draw(); this.drawRequestScheduled = false; });
    }
  }
  draw() {
    if (this.isDrawing) return; this.isDrawing = true;
    this.resizeCanvas();
    if (this.canvas.width === 0 || this.canvas.height === 0) { this.isDrawing = false; return; }
    const { clientWidth: cssWidth, clientHeight: cssHeight } = this.canvas.parentElement;
    const { ctx, options } = this;
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    const gx = options.paddingLeft, gy = options.paddingTop;
    const gw = cssWidth - options.paddingLeft - options.paddingRight;
    const gh = cssHeight - options.paddingTop - options.paddingBottom;
    if (gw <= 0 || gh <= 0) { this.isDrawing = false; return; }

    const { xMin, xMax, yMin, yMax } = this.currentView;
    const xRange = xMax - xMin, yRange = yMax - yMin;
    if (!xRange || !yRange || !Number.isFinite(xMin) || !Number.isFinite(xMax) || !Number.isFinite(yMin) || !Number.isFinite(yMax)) {
      this.isDrawing = false; return;
    }

    // Grid
    ctx.lineWidth = 1; ctx.strokeStyle = options.gridColor; ctx.fillStyle = options.textColor; ctx.font = "10px Arial";
    const xStep = 100; const startX = Math.ceil(xMin / xStep) * xStep; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (let x = startX; x <= xMax; x += xStep) {
      const screenX = gx + ((x - xMin) / xRange) * gw; const sharpX = Math.round(screenX);
      if (sharpX >= gx && sharpX <= gx + gw) {
        ctx.beginPath(); ctx.moveTo(sharpX, gy); ctx.lineTo(sharpX, gy + gh); ctx.stroke();
        if (sharpX > gx + 10 && sharpX < gx + gw - 10) ctx.fillText(x.toFixed(0), sharpX, gy + gh + 4);
      }
    }
    ctx.textAlign = "left"; ctx.fillText(xMin.toFixed(0), gx, gy + gh + 4);
    ctx.textAlign = "right"; ctx.fillText(xMax.toFixed(0), gx + gw, gy + gh + 4);

    const yTargetSteps = Math.max(3, Math.floor(gh / 40));
    const roughYStep = yRange / yTargetSteps;
    let yStep = roughYStep > 0 ? Math.pow(10, Math.floor(Math.log10(roughYStep))) : 0.1;
    const mult = yTargetSteps > 0 ? yRange / (yStep * yTargetSteps) : 1; if (mult > 5) yStep *= 5; else if (mult > 2) yStep *= 2;
    const yNumDecimals = yStep > 0 ? Math.max(0, -Math.floor(Math.log10(yStep) + 0.01)) : 1;
    const startY = yStep > 0 ? Math.ceil(yMin / yStep) * yStep : yMin;
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let y = startY; y <= yMax; y += yStep) {
      if (yStep <= 0) break;
      const screenY = gy + gh - ((y - yMin) / yRange) * gh; const sharpY = Math.round(screenY);
      if (sharpY >= gy && sharpY <= gy + gh) {
        ctx.beginPath(); ctx.moveTo(gx, sharpY); ctx.lineTo(gx + gw, sharpY); ctx.stroke();
        if (sharpY > gy + 8 && sharpY < gy + gh - 8) ctx.fillText(y.toFixed(yNumDecimals), gx - 5, sharpY);
      }
    }
    ctx.textBaseline = "bottom"; ctx.fillText(yMin.toFixed(1), gx - 5, gy + gh);
    ctx.textBaseline = "top"; ctx.fillText(yMax.toFixed(1), gx - 5, gy);

    // Data line
    if (this.data.length >= 1) {
      ctx.beginPath();
      let firstPointDrawn = false;
      let startIndex = this.data.findIndex(p => p.x >= xMin); if (startIndex === -1) startIndex = this.data.length;
      let endIndex = this.data.length; for(let i = startIndex; i < this.data.length; i++) { if (this.data[i].x > xMax) { endIndex = i + 1; break; } }
      if (startIndex > 0) startIndex--;
      for (let i = startIndex; i < Math.min(endIndex, this.data.length); i++) {
        const p = this.data[i]; if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
        const screenX = gx + ((p.x - xMin) / xRange) * gw;
        const screenY = gy + gh - ((p.y - yMin) / yRange) * gh;
        const clampedY = Math.max(gy, Math.min(gy + gh, screenY));
        if (!firstPointDrawn) { ctx.moveTo(screenX, clampedY); firstPointDrawn = true; } else { ctx.lineTo(screenX, clampedY); }
      }
      if (firstPointDrawn) {
        ctx.strokeStyle = this.options.lineColor; ctx.lineWidth = this.options.lineWidth; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
      }
    }

    // Annotations (позиционирование подписей зависит от this.invert)
    if (this.annotations && this.annotations.length) {
      const xRange2 = xMax - xMin, yRange2 = yMax - yMin;
      ctx.font = "12px Arial";
      ctx.textAlign = "center";

      // Параметры смещения подписи относительно точки:
      // invert === true  -> подписи НАД кривой  (baseline = 'bottom', y = screenY - offset)
      // invert === false -> подписи ПОД кривой  (baseline = 'top',    y = screenY + offset)
      const labelOffset = 8; // px; подправь по вкусу
      const invertFlag = !!this.invert;
      ctx.textBaseline = invertFlag ? "bottom" : "top";

      for (const ann of this.annotations) {
        // ожидаем: ann.x и ann.y — в координатах данных (не в пикселях)
        if (ann.x < xMin || ann.x > xMax) continue;
        const screenX = gx + ((ann.x - xMin) / xRange2) * gw;
        const screenY = gy + gh - ((ann.y - yMin) / yRange2) * gh;

        // рисуем маркер
        ctx.fillStyle = this.options.annotationColor;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 5, 0, Math.PI * 2);
        ctx.fill();

        // позиция текста: над/под точкой
        const textY = invertFlag ? (screenY - labelOffset) : (screenY + labelOffset);

        // читаемость: рисуем контур + заливку (как в других местах)
        ctx.fillStyle = this.options.textColor;
        // обводка для читаемости (толстая тёмная линия)
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.lineWidth = 3;
        ctx.strokeText(ann.label, screenX, textY);
        ctx.fillText(ann.label, screenX, textY);
      }
      // восстановим параметры lineWidth/strokeStyle, если нужно (необязательно)
      ctx.lineWidth = this.options.lineWidth;
      ctx.strokeStyle = this.options.gridColor;
    }


    // Note indicators
    if (this.noteIndicators && this.noteIndicators.length) {
      ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      for (const ind of this.noteIndicators) {
        if (!ind || ind.x === null || ind.opacity <= 0.01) continue;
        if (ind.x < xMin || ind.x > xMax) continue;
        const screenX = gx + ((ind.x - xMin) / xRange) * gw;
        const baseColor = ind.noteIndex === 0 ? this.options.noteIndicatorColor1 : this.options.noteIndicatorColor2;
        let colorWithAlpha = baseColor;
        if (baseColor.startsWith("rgba")) colorWithAlpha = baseColor.replace(/(\d+(\.\d+)?)\)$/, `${ind.opacity.toFixed(2)})`);
        else if (baseColor.startsWith("rgb")) colorWithAlpha = baseColor.replace("rgb","rgba").replace(")", `, ${ind.opacity.toFixed(2)})`);
        ctx.strokeStyle = colorWithAlpha;
        ctx.beginPath(); const sharpX = Math.round(screenX); ctx.moveTo(sharpX, gy); ctx.lineTo(sharpX, gy + gh); ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    this.isDrawing = false;
  }
}