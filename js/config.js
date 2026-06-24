// Configuración global de la proto-estructura.
const CONFIG = {
    grid: {
        rows: 4,
        cols: 4,
        // Color de las líneas y de las celdas del grid.
        lineColor: '#353a45',
        cellColor: '#2d323d',
        padding: 16, // margen interior del canvas en px
    },
    points: {
        count: 8,          // número de puntos (configurable desde Controles)
        radius: 1,         // radio de cada punto en px
        speedMin: 0.8,     // velocidad mínima (cada punto elige una al azar)
        speedMax: 2.5,     // velocidad máxima
        turn: 1.2,         // cuánto puede cambiar la dirección por frame (radianes)
        // Probabilidad por frame de cambiar de comportamiento (ganar/perder).
        // ~0.004 ≈ un cambio cada ~4 s a 60 fps.
        behaviorSwitchChance: 0.004,
    },
    behaviors: {
        // Color de cada comportamiento (para distinguirlos visualmente).
        wander:   { color: '#4f8cff' }, // vaga libre por todo el canvas
        centroid: {
            color: '#ff9f4f',           // pulula alrededor de un centroide
            x: 240,                     // centroide X (px)
            y: 240,                     // centroide Y (px)
            radius: 80,                 // radio del área en el que pulula (px)
            showArea: true,             // dibujar el área del centroide
        },
    },
    view: {
        minScale: 0.25,    // zoom mínimo (alejar)
        maxScale: 8,       // zoom máximo (acercar)
        zoomSpeed: 0.0015, // sensibilidad de la rueda
    },
};
