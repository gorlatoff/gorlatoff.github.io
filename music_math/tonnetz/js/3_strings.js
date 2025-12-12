window.Tonnetz = window.Tonnetz || {};

Tonnetz.Strings = {
    data: {
        en: {
            title: 'The Tonnetz',
            dual: 'Rectangular Mode', // Переименовали кнопку
            rotate: 'Rotate 180°',
            translate: 'Translate',
            connected: 'Note: This Tonnetz grid is not fully connected.',
            notes: ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
            infos: {
                tonnetz: `<h3>The Tonnetz</h3><p>Theoretical model representing harmonic relationships in a triangular grid. Diagonal axes represent minor and major thirds; vertical axes represent perfect fifths.</p>`,
                rectangular: `<h3>Rectangular Grid</h3><p>A Cartesian representation of the harmonic space. <br><b>Horizontal (X):</b> Steps by Perfect Fifths (7 semitones).<br><b>Vertical (Y):</b> Steps by Major Thirds (4 semitones).</p>`
            },
            infoClose: "Close Info",
            info: "Info"
        }
    },
    get(key, lang = 'en') {
        const path = Array.isArray(key) ? key : key.split('.');
        let result = this.data[lang];
        
        for (let p of path) {
            if (result && result[p] !== undefined) {
                result = result[p];
            } else {
                result = undefined;
                break;
            }
        }
        
        if (result === undefined && lang !== 'en') {
            return this.get(key, 'en');
        }
        
        return result !== undefined ? result : (Array.isArray(key) ? key.join('.') : key);
    }
};