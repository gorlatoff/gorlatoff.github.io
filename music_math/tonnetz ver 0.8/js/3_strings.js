window.Tonnetz = window.Tonnetz || {};

Tonnetz.Strings = {
    data: {
        en: {
            title: 'The Tonnetz',
            dual: 'Dual View',
            rotate: 'Rotate 180°',
            translate: 'Translate',
            connected: 'Note: This Tonnetz grid is not fully connected.',
            notes: ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
            infos: {
                tonnetz: `<h3>The Tonnetz</h3><p>Theoretical model representing harmonic relationships in a triangular grid. Diagonal axes represent minor and major thirds; vertical axes represent perfect fifths.</p>`,
                chicken: `<h3>Chicken-Wire</h3><p>The dual representation of the triangular grid. Chords are vertices of a hexagonal tiling, and pitches are the faces.</p>`
            },
            infoClose: "Close Info",
            info: "Info"
        }
    },
    // ИСПРАВЛЕНО: Поддержка массивов в пути (['notes', 0])
    get(key, lang = 'en') {
        // Если передан массив, используем его, иначе разбиваем строку
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
        
        // Фолбэк на английский
        if (result === undefined && lang !== 'en') {
            return this.get(key, 'en');
        }
        
        return result !== undefined ? result : (Array.isArray(key) ? key.join('.') : key);
    }
};

// Global mixin
Vue.mixin({
    methods: {
        getString(key) { return Tonnetz.Strings.get(key); }
    }
});