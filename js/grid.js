// Dibujo del grid en el canvas. Estático por ahora.
class Grid {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = options.rows;
        this.cols = options.cols;
        this.size = options.size; // lado del mundo (cuadrado)
        this.lineColor = options.lineColor;
        this.cellColor = options.cellColor;
        this.padding = options.padding;
    }

    // Márgenes interiores del mundo (cuadrado) donde "viven" los puntos.
    getBounds() {
        const r = this.padding;
        return {
            minX: r,
            minY: r,
            maxX: this.size - r,
            maxY: this.size - r,
        };
    }

    // El bucle limpia el canvas (en coordenadas de pantalla) antes de aplicar
    // la cámara, así que aquí ya no se borra.
    draw() {
        const { ctx, size, rows, cols, padding } = this;

        const area = size - padding * 2;
        const cellW = area / cols;
        const cellH = area / rows;

        // Celdas
        ctx.fillStyle = this.cellColor;
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = padding + c * cellW;
                const y = padding + r * cellH;
                ctx.fillRect(x, y, cellW, cellH);
                ctx.strokeRect(x, y, cellW, cellH);
            }
        }
    }
}
