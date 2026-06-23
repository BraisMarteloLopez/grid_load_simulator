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
        radius: 5,         // radio de cada punto en px
        color: '#4f8cff',  // color de los puntos
        speed: 1.5,        // velocidad de movimiento en px/frame
        turn: 0.4,         // cuánto puede cambiar la dirección por frame (radianes)
    },
};
