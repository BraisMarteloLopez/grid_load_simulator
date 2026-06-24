// Cámara de dibujo: zoom (rueda) y paneo (arrastre).
// Solo afecta a CÓMO se dibuja; la lógica de los puntos sigue en
// coordenadas del mundo, así que rebotan en los mismos márgenes.
class Camera {
    constructor(options) {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.minScale = options.minScale;
        this.maxScale = options.maxScale;
        this.zoomSpeed = options.zoomSpeed;
    }

    // Aplica la transformación al contexto (escala + desplazamiento).
    apply(ctx) {
        ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
    }

    // Zoom centrado en (sx, sy), en coordenadas de canvas.
    // El punto del mundo bajo el cursor se mantiene fijo.
    zoomAt(sx, sy, deltaY) {
        const factor = Math.exp(-deltaY * this.zoomSpeed);
        let next = this.scale * factor;
        next = Math.max(this.minScale, Math.min(this.maxScale, next));
        if (next === this.scale) return;

        const worldX = (sx - this.offsetX) / this.scale;
        const worldY = (sy - this.offsetY) / this.scale;

        this.scale = next;
        this.offsetX = sx - worldX * next;
        this.offsetY = sy - worldY * next;
    }

    // Desplaza la vista (en coordenadas de canvas).
    panBy(dx, dy) {
        this.offsetX += dx;
        this.offsetY += dy;
    }

    // Encuadra un mundo cuadrado de lado `worldSize` dentro de un canvas de
    // (canvasW x canvasH): lo escala para llenar el lado menor (por `fill`)
    // manteniendo la proporción cuadrada, y lo centra.
    fitSquare(canvasW, canvasH, worldSize, fill = 1) {
        const s = (Math.min(canvasW, canvasH) / worldSize) * fill;
        this.scale = s;
        this.offsetX = (canvasW - worldSize * s) / 2;
        this.offsetY = (canvasH - worldSize * s) / 2;
    }
}
