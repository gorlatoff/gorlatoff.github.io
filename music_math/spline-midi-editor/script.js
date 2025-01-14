document.addEventListener('DOMContentLoaded', () => {
	// Initialize DOM elements
	const canvas = document.getElementById('piano-roll');
	const playBtn = document.getElementById('play');
	const clearBtn = document.getElementById('clear');

	if (!canvas || !playBtn || !clearBtn) {
		console.error('Required elements not found');
		return;
	}

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('Could not get canvas context');
		return;
	}

	// Grid settings
	let GRID_X, GRID_Y, noteHeight;
	const BARS = 4;
	const DIVISIONS_PER_BAR = 16;
	const SUBDIVISIONS = 4;

	// State
	let isDrawing = false;
	let isDragging = false;
	let dragPoint = null;
	let currentCurve = new Map();
	let allCurves = [];
	let hoveredPoint = null;
	let isPlaying = false;
	let playbackStartTime = 0;
	let animationFrame = null;
	const activeVoices = new Set();

	// Notes setup (C3 to C6)
	const notes = [];
	for (let i = 0; i <= 36; i++) {
		notes.push(i + 48);
	}

	// Get CSS variables
	const style = getComputedStyle(document.documentElement);
	const colors = {
		grid: style.getPropertyValue('--grid-color').trim(),
		gridMain: style.getPropertyValue('--grid-main-color').trim(),
		gridBar: style.getPropertyValue('--grid-bar-color').trim(),
		text: style.getPropertyValue('--text-color').trim(),
		point: style.getPropertyValue('--point-color').trim(),
		pointHover: style.getPropertyValue('--point-hover-color').trim(),
		cursor: style.getPropertyValue('--cursor-color').trim()
	};

	function resizeCanvas() {
		const container = canvas.parentElement;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		
		if (canvas.width > 0 && canvas.height > 0) {
			updateGridSettings();
			render();
		}
	}

	function updateGridSettings() {
		GRID_X = canvas.width / (BARS * DIVISIONS_PER_BAR);
		noteHeight = canvas.height / 37;
		GRID_Y = noteHeight / SUBDIVISIONS;
	}


// Convert absolute coordinates to relative (0-1 range)
function toRelativeCoords(x, y) {
	return {
		x: x / canvas.width,
		y: y / canvas.height
	};
}

// Convert relative coordinates to absolute
function toAbsoluteCoords(relX, relY) {
	return {
		x: relX * canvas.width,
		y: relY * canvas.height
	};
}

function snapToGrid(x, y) {
	// Convert to relative first
	const relX = x / canvas.width;
	const relY = y / canvas.height;
	
	// Calculate relative grid sizes
	const gridXRel = 1 / (BARS * DIVISIONS_PER_BAR);
	const noteHeightRel = 1 / 37;
	const gridYRel = noteHeightRel / SUBDIVISIONS;
	
	// Snap in relative coordinates
	const snapXRel = Math.round(relX / gridXRel) * gridXRel;
	const noteIndex = Math.floor(relY / noteHeightRel);
	const localYRel = relY - (noteIndex * noteHeightRel);
	const snapLocalYRel = Math.round(localYRel / gridYRel) * gridYRel;
	
	// Convert back to absolute for drawing
	return toAbsoluteCoords(
		snapXRel,
		noteIndex * noteHeightRel + snapLocalYRel
	);
}

function drawGrid() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw bar divisions
	for (let bar = 0; bar <= BARS; bar++) {
		for (let div = 0; div < DIVISIONS_PER_BAR; div++) {
			const x = (bar * DIVISIONS_PER_BAR + div) * GRID_X;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
			
			if (div === 0) {
				ctx.strokeStyle = colors.gridBar;
				ctx.lineWidth = 2;
			} else {
				ctx.strokeStyle = colors.grid;
				ctx.lineWidth = 1;
			}
			ctx.stroke();
		}
	}
	
	// Draw note lines
	notes.forEach((note, i) => {
		const y = i * noteHeight;
		
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.strokeStyle = note % 12 === 0 ? colors.gridMain : colors.grid;
		ctx.stroke();
		
		if (note % 12 === 0) {
			ctx.fillStyle = colors.text;
			ctx.font = `${Math.max(1.2, noteHeight * 0.3)}px Arial`;
			ctx.fillText(`C${Math.floor(note/12)}`, 5, y + noteHeight * 0.3);
		}
	});
}

function drawPoint(x, y, isHovered = false) {
	const pointSize = Math.max(4, noteHeight * 0.1);
	ctx.beginPath();
	ctx.arc(x, y, isHovered ? pointSize * 1.5 : pointSize, 0, Math.PI * 2);
	ctx.fillStyle = isHovered ? colors.pointHover : colors.point;
	ctx.fill();
}

function drawSpline(points) {
    if (points.size < 2) return;
    
    const sortedPoints = Array.from(points.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([relX, relY]) => {
            const abs = toAbsoluteCoords(relX, relY);
            return {x: abs.x, y: abs.y};
        });
    
    ctx.beginPath();
    ctx.moveTo(sortedPoints[0].x, sortedPoints[0].y);
    
    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const curr = sortedPoints[i];
        const next = sortedPoints[i + 1];
        const xc = (curr.x + next.x) / 2;
        const yc = (curr.y + next.y) / 2;
        ctx.quadraticCurveTo(curr.x, curr.y, xc, yc);
    }
    
    ctx.strokeStyle = colors.point;
    ctx.lineWidth = Math.max(2, (canvas.height / 37) * 0.05);
    ctx.stroke();
    
    sortedPoints.forEach(point => {
        const isHovered = hoveredPoint && 
            Math.abs(point.x/canvas.width - hoveredPoint.x) < 0.01 && 
            Math.abs(point.y/canvas.height - hoveredPoint.y) < 0.01;
        drawPoint(point.x, point.y, isHovered);
    });
}

function drawPlaybackCursor() {
	if (!isPlaying) return;
	
	const currentTime = Tone.now() - playbackStartTime;
	const totalDuration = getTotalDuration();
	const relativePosition = currentTime / totalDuration;
	const cursorX = relativePosition * canvas.width;
	
	if (relativePosition >= 1) {
		stopPlayback();
		return;
	}
	
	ctx.beginPath();
	ctx.moveTo(cursorX, 0);
	ctx.lineTo(cursorX, canvas.height);
	ctx.strokeStyle = colors.cursor;
	ctx.lineWidth = Math.max(2, (canvas.height / 37) * 0.05);
	ctx.stroke();
}

function render() {
	drawGrid();
	allCurves.forEach(drawSpline);
	if (isDrawing) {
		drawSpline(currentCurve);
	}
	drawPlaybackCursor();
	
	if (isPlaying) {
		animationFrame = requestAnimationFrame(render);
	}
}

function getTotalDuration() {
	return BARS * 2; // 2 seconds per bar
}

function cleanupSynths() {
	activeVoices.forEach(synth => {
		synth.dispose();
	});
	activeVoices.clear();
}

function isNearPoint(x, y, pointX, pointY) {
	const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
	return distance < 10;
}

function findHoveredPoint(x, y) {
	const relPoint = toRelativeCoords(x, y);
	for (const curve of allCurves) {
		for (const [px, py] of curve.entries()) {
			const abs = toAbsoluteCoords(px, py);
			if (isNearPoint(x, y, abs.x, abs.y)) {
				return {x: px, y: py, curve};
			}
		}
	}
	return null;
}

function getNoteFromY(relY) {
	const noteIndex = Math.floor(relY * 37);
	return notes[noteIndex];
}

function playSpline(curve, startTime) {
	const points = Array.from(curve.entries())
		.sort((a, b) => a[0] - b[0]);
	
	if (points.length < 2) return;
	
	const startX = points[0][0]; // Already relative (0-1)
	const endX = points[points.length - 1][0]; // Already relative (0-1)
	const duration = getTotalDuration();
	
	const synth = new Tone.Synth().toDestination();
	activeVoices.add(synth);
	
	const noteStartTime = startTime + (startX * duration);
	const noteDuration = ((endX - startX) * duration);
	
	// First note
	synth.triggerAttack(Tone.Frequency(getNoteFromY(points[0][1]), "midi"), noteStartTime);
	
	// Frequency ramps for the curve
	points.forEach(([x, y], i) => {
		if (i === 0) return;
		const time = startTime + (x * duration);
		const freq = Tone.Frequency(getNoteFromY(y), "midi").toFrequency();
		synth.frequency.linearRampToValueAtTime(freq, time);
	});
	
	synth.triggerRelease(noteStartTime + noteDuration);
	
	// Cleanup synth after it's done
	Tone.Transport.schedule(() => {
		synth.dispose();
		activeVoices.delete(synth);
	}, noteStartTime + noteDuration + 0.1);
}

function startPlayback() {
	cleanupSynths(); // Cleanup any leftover synths
	isPlaying = true;
	playbackStartTime = Tone.now();
	playBtn.disabled = true;
	
	allCurves.forEach(curve => {
		playSpline(curve, playbackStartTime);
	});
	
	render();
}

function stopPlayback() {
	isPlaying = false;
	playBtn.disabled = false;
	if (animationFrame) {
		cancelAnimationFrame(animationFrame);
	}
	cleanupSynths();
	render();
}

// Event Listeners
canvas.addEventListener('mousedown', (e) => {
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	
	hoveredPoint = findHoveredPoint(x, y);
	
	if (hoveredPoint) {
		isDragging = true;
		dragPoint = hoveredPoint;
	} else {
		isDrawing = true;
		currentCurve = new Map();
		const snapped = snapToGrid(x, y);
		const relative = toRelativeCoords(snapped.x, snapped.y);
		currentCurve.set(relative.x, relative.y);
	}
});

canvas.addEventListener('mousemove', (e) => {
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	
	if (isDragging && dragPoint) {
		const snapped = snapToGrid(x, y);
		const relative = toRelativeCoords(snapped.x, snapped.y);
		dragPoint.curve.delete(dragPoint.x);
		dragPoint.curve.set(relative.x, relative.y);
		dragPoint.x = relative.x;
		dragPoint.y = relative.y;
	} else if (isDrawing) {
		const snapped = snapToGrid(x, y);
		const relative = toRelativeCoords(snapped.x, snapped.y);
		currentCurve.set(relative.x, relative.y);
	} else {
		hoveredPoint = findHoveredPoint(x, y);
	}
	
	render();
});

canvas.addEventListener('mouseup', () => {
	if (isDrawing && currentCurve.size > 0) {
		allCurves.push(currentCurve);
	}
	isDrawing = false;
	isDragging = false;
	dragPoint = null;
	render();
});

playBtn.addEventListener('click', async () => {
	await Tone.start();
	startPlayback();
});

clearBtn.addEventListener('click', () => {
	allCurves = [];
	stopPlayback();
	render();
});


// Initial setup
setTimeout(resizeCanvas, 0);
window.addEventListener('resize', resizeCanvas);
});
