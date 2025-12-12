/* === SVG Element Builders === */
window.SvgBuilder = {
    
    // Вспомогательная функция для получения цвета
    getColor(midiNote) {
        const pitchClass = Tonnetz.Math.mod(midiNote, 12);
        return Tonnetz.Music.colorMap[pitchClass];
    },

    createNode(x, y, pitch, mode) {
        const pitchClass = Tonnetz.Math.mod(pitch, 12);
        const noteName = Tonnetz.Strings.get(['notes', pitchClass]);
        const color = this.getColor(pitch);
        
        // Передаем цвет через CSS переменную --item-color
        // data-pitches хранит массив для воспроизведения
        // data-pc (pitch class) для подсветки всех "До" одновременно
        return `
            <g class="tonnetz-el node" 
               style="--item-color: ${color}"
               data-pitches="[${pitch}]" 
               data-pc="${pitchClass}"
               transform="translate(${x},${y})">
                <circle r="14"></circle>
                <text dy="1">${noteName}</text>
            </g>
        `;
    },

    createDichord(x1, y1, x2, y2, pitch1, pitch2) {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        // Сортируем pitch classes для уникального ключа подсветки
        const pc1 = Tonnetz.Math.mod(pitch1, 12);
        const pc2 = Tonnetz.Math.mod(pitch2, 12);
        const key = [pc1, pc2].sort((a,b)=>a-b).join('-');
        
        return `
            <g class="tonnetz-el dichord" 
               data-pitches="[${pitch1},${pitch2}]"
               data-key="${key}">
                <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />
                <circle cx="${cx}" cy="${cy}" />
            </g>
        `;
    },

    createTrichord(pts, pitches) {
        const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');
        
        // Ключ для подсветки (Pitch Classes)
        const pcs = pitches.map(p => Tonnetz.Math.mod(p, 12)).sort((a,b)=>a-b).join('-');

        return `
            <polygon class="tonnetz-el trichord" 
                     data-pitches="[${pitches.join(',')}]"
                     data-key="${pcs}" 
                     points="${pointsStr}" />
        `;
    }
};