window.Tonnetz = window.Tonnetz || {};

/* === Math Helpers === */
Tonnetz.Math = {
    bound: (value, mini, maxi) => Math.min(maxi, Math.max(mini, value)),
    mod: (value, period) => ((value % period) + period) % period,
    gcd: (a, b) => (!b ? a : Tonnetz.Math.gcd(b, a % b)),
    average: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,

    // Простой мемоизатор для чистых функций
    memo: (func) => {
        const cache = {};
        return function(...args) {
            const key = JSON.stringify(args);
            if (cache[key]) return cache[key];
            const val = func.apply(this, args);
            cache[key] = val;
            return val;
        };
    },

    arrayEquals: (a, b) => {
        if (a === b) return true;
        if (a == null || b == null || a.length !== b.length) return false;
        for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
        return true;
    }
};

/* === Geometry Constants & Transforms === */
Tonnetz.Geometry = {
    xstep: Math.sqrt(3) / 2,
    baseSize: 50,
    
    // Стандартный Тоннетц (Треугольный)
    logicalToSvgTonnetz: (node) => {
        const x = node.x * Tonnetz.Geometry.xstep * Tonnetz.Geometry.baseSize;
        const y = (node.y + node.x / 2) * Tonnetz.Geometry.baseSize;
        return { x, y };
    },

    // Новый Прямоугольный режим (Rectangular)
    // X = Квинты (7 полутонов), Y = Большие терции (4 полутона)
    logicalToSvgRect: (node) => {
        // Просто декартова сетка, немного растянутая для красоты
        const spacing = Tonnetz.Geometry.baseSize * 1.2;
        return { 
            x: node.x * spacing, 
            y: -node.y * spacing // Инвертируем Y, чтобы "вверх" было вверх
        }; 
    }
};

/* === Color & MIDI Helpers === */
Tonnetz.Music = {
    colorMap: {
        0: "#ff941f", 1: "#e66438", 2: "#cc3450", 3: "#b30469",
        4: "#822b9b", 5: "#5053cd", 6: "#1f7aff", 7: "#258dab",
        8: "#2ba058", 9: "#31b304", 10: "#76a900", 11: "#e6bd00",
    }
};