// Configuración global de la proto-estructura.
const CONFIG = {
    grid: {
        rows: 4,
        cols: 4,
        subRows: 4,  // subdivisiones por chunk (4×4 = 16 sub-celdas)
        subCols: 4,
        size: 600,   // lado del "mundo" del grid (cuadrado), en px
        // Colores: líneas de chunk (marcadas), subdivisión (tenues) y celdas.
        lineColor: '#3f4654',
        subLineColor: '#30343d',
        cellColor: '#2d323d',
        padding: 16, // margen interior del grid en px
    },
    points: {
        count: 8,          // número de puntos (configurable desde Controles)
        radius: 1,         // radio de cada punto en px
        opacity: 0.68,     // opacidad normal de los puntos
        speed: 1.5,        // velocidad de movimiento (común a todas las partículas)
        baseSpeed: 1.5,    // velocidad de referencia (1:1) para el tiempo entre decisiones
        decisionInterval: 1, // frames entre decisiones de dirección a la velocidad base
        turn: 1.2,         // magnitud del giro en cada decisión (radianes)
        // Probabilidad por frame de cambiar de comportamiento (ganar/perder).
        // ~0.004 ≈ un cambio cada ~4 s a 60 fps.
        behaviorSwitchChance: 0.004,
        // Proximidad: si dos o más puntos están a menos de esta distancia,
        // se pintan de rojo claro.
        proximity: {
            distance: 15,      // distancia (px) para considerarlos "juntos"
            color: '#ff3b3b',  // rojo claro, inequívocamente rojo (distinto del naranja)
            opacity: 1.0,      // opacidad de los puntos en proximidad
        },
        // Interacción: muy ocasionalmente, una partícula con otra dentro del
        // rango (= proximity.distance × rangeMultiplier) "interactúa" con ella
        // dibujando una línea durante unos frames.
        interaction: {
            enabled: true,       // on/off de las líneas que unen los puntos
            rangeMultiplier: 9,  // rango = proximity.distance × este factor
            chance: 0.02,        // probabilidad (muy ocasional) en cada evaluación
            interval: 10,        // se evalúa cada N frames
            duration: 20,        // frames que dura la línea
            color: '#b69cff',    // color de la línea de interacción
            width: 1,            // grosor de la línea (px de mundo)
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
