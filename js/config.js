// Configuración global de la proto-estructura.
const CONFIG = {
    grid: {
        rows: 4,
        cols: 4,
        size: 600,   // lado del "mundo" del grid (cuadrado), en px
        // Color de las líneas y de las celdas del grid.
        lineColor: '#353a45',
        cellColor: '#2d323d',
        padding: 16, // margen interior del grid en px
    },
    points: {
        count: 8,          // número de puntos (configurable desde Controles)
        radius: 1,         // radio de cada punto en px
        opacity: 0.8,      // opacidad normal de los puntos
        speedMin: 0.8,     // velocidad mínima (cada punto elige una al azar)
        speedMax: 2.5,     // velocidad máxima
        turn: 1.2,         // cuánto puede cambiar la dirección por frame (radianes)
        // Probabilidad por frame de cambiar de comportamiento (ganar/perder).
        // ~0.004 ≈ un cambio cada ~4 s a 60 fps.
        behaviorSwitchChance: 0.004,
        // Proximidad: si dos o más puntos están a menos de esta distancia,
        // se pintan de rojo claro.
        proximity: {
            distance: 15,      // distancia (px) para considerarlos "juntos"
            color: '#ff8a8a',  // rojo claro
            opacity: 1.0,      // opacidad de los puntos en proximidad
        },
    },
    behaviors: {
        // Color de cada comportamiento (para distinguirlos visualmente).
        wander:   { color: '#4f8cff' }, // vaga libre por todo el canvas
        centroid: {
            color: '#ff9f4f',  // pulula alrededor de un centroide
            count: 5,          // número de centroides repartidos por el grid
            radius: 35,        // radio del área de cada centroide (px)
            jitter: 0.7,       // aleatoriedad de la posición respecto a la rejilla (0..1)
            showArea: true,    // dibujar el área de los centroides
        },
    },
    view: {
        minScale: 0.25,    // zoom mínimo (alejar)
        maxScale: 8,       // zoom máximo (acercar)
        zoomSpeed: 0.0015, // sensibilidad de la rueda
        // Fracción del lado menor de la pantalla que ocupa el grid cuadrado
        // en la vista por defecto (1 = lo llena).
        fitFill: 1,
    },
};
