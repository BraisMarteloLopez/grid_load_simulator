# Grid Load Simulator

Proto-estructura de un simulador de carga sobre un grid.

## Estado actual

- **Grid (salida visual)**: un grid 4x4 estático dibujado en canvas, centrado.
- **Controles**: panel arriba a la derecha (placeholder, vacío por ahora).
- **Resultados**: panel debajo de los controles (vacío por ahora).

## Estructura

```
index.html        # Maquetación y layout
css/styles.css    # Estilos del layout y paneles
js/config.js      # Configuración (tamaño del grid, colores)
js/grid.js        # Clase Grid: dibujo en canvas
js/main.js        # Punto de entrada
```

## Cómo ejecutar

Abre `index.html` en un navegador. No requiere dependencias ni build.
