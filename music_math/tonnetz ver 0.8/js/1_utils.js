window.Tonnetz = window.Tonnetz || {};

/* === Math Helpers === */
Tonnetz.Math = {
    bound: (value, mini, maxi) => Math.min(maxi, Math.max(mini, value)),
    mod: (value, period) => ((value % period) + period) % period,
    gcd: (a, b) => (!b ? a : Tonnetz.Math.gcd(b, a % b)),
    average: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,

    // ИСПРАВЛЕНО: Memoization теперь принимает контекст (this)
    memo: (func, ctx) => {
        const cache = {};
        return function() {
            const key = JSON.stringify(arguments);
            if (cache[key]) return cache[key];
            // Используем .call с переданным контекстом или null
            const val = func.apply(ctx || null, arguments);
            cache[key] = val;
            return val;
        };
    },

    arrayEquals: (a, b) => {
        if (a === b) return true;
        if (a == null || b == null || a.length !== b.length) return false;
        for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
        return true;
    },

    range: function* (begin, end, interval = 1) {
        for (let i = begin; i < end; i += interval) yield i;
    }
};

/* === Geometry Constants & Transforms === */
Tonnetz.Geometry = {
    xstep: Math.sqrt(3) / 2,
    baseSize: 50,
    logicalToSvg: (node) => {
        const x = node.x * Tonnetz.Geometry.xstep * Tonnetz.Geometry.baseSize;
        const y = (node.y + node.x / 2) * Tonnetz.Geometry.baseSize;
        return { x, y };
    }
};

/* === Color & MIDI Helpers === */
Tonnetz.Music = {
    isMidiPitch: (pitch) => (pitch >= 0 && pitch < 128) || (JZZ && JZZ.MIDI && JZZ.MIDI.noteValue(pitch) !== undefined),
    colorMap: {
        0: "#ff941f", 1: "#e66438", 2: "#cc3450", 3: "#b30469",
        4: "#822b9b", 5: "#5053cd", 6: "#1f7aff", 7: "#258dab",
        8: "#2ba058", 9: "#31b304", 10: "#76a900", 11: "#e6bd00",
    }
};