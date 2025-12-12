/* === Grid Generation Logic === */
window.GridLogic = {
    getNodes: (bounds, mode) => {
        const nodes = [];
        const bs = Tonnetz.Geometry.baseSize;
        
        if (mode === 'tonnetz') {
            const xs = Tonnetz.Geometry.xstep;
            const xmin = Math.floor(bounds.xmin / (bs * xs));
            const xmax = Math.ceil(bounds.xmax / (bs * xs));
            const buffer = 1; 

            for (let xi = xmin - buffer; xi <= xmax + buffer; xi++) {
                const ymin = Math.floor(bounds.ymin / bs - xi / 2);
                const ymax = Math.ceil(bounds.ymax / bs - xi / 2);
                for (let yi = ymin - buffer; yi <= ymax + buffer; yi++) {
                    nodes.push({x: xi, y: yi});
                }
            }
        } else {
            // Rectangular
            const spacing = bs * 1.2;
            const xmin = Math.floor(bounds.xmin / spacing);
            const xmax = Math.ceil(bounds.xmax / spacing);
            const ymin = Math.floor(-bounds.ymax / spacing);
            const ymax = Math.ceil(-bounds.ymin / spacing);

            for (let xi = xmin - 1; xi <= xmax + 1; xi++) {
                for (let yi = ymin - 1; yi <= ymax + 1; yi++) {
                    nodes.push({x: xi, y: yi});
                }
            }
        }
        return nodes;
    },

    // ВАЖНО: Возвращает сырой MIDI номер (может быть > 127 или < 0, фильтруем позже)
    // Это сохраняет относительную высоту звука для аккордов.
    getNodePitchRaw: (node, mode) => {
        let p;
        if (mode === 'tonnetz') {
             // Tonnetz Standard: 
             // Start at 60 (Middle C)
             // X axis = Minor Third (+3)
             // Y axis = Major Third (-4 inverted or +? check standard)
             // Standard: Axis 1 = P5 (7), Axis 2 = M3 (4).
             // Original Formula from code: 81 - x*3 + y*(-7)
             // Давайте используем базу 60 для центра.
             // x * 3 (m3) + y * 4 (M3) = PLR transformation style grid
             // Оригинальный код использовал интервалы [3, 4, 5].
             // Используем оригинальную формулу, она проверена временем в этом проекте.
             p = 81 - node.x * 3 + node.y * (5 - 12); // 81 - 3x - 7y
        } else {
            // Rectangular: X=Quint(7), Y=Maj3(4)
            p = 48 + node.x * 7 + node.y * 4; // Base C3
        }
        return p;
    }
};