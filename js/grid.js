// Dibujo del grid en el canvas. Estático por ahora.
class Grid {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = options.rows;
        this.cols = options.cols;
        this.lineColor = options.lineColor;
        this.cellColor = options.cellColor;
        this.padding = options.padding;
    }

    // Márgenes interiores del canvas donde "viven" los puntos.
    getBounds() {
        const r = this.padding;
        return {
            minX: r,
            minY: r,
            maxX: this.canvas.width - r,
            maxY: this.canvas.height - r,
        };
    }

    draw() {
        const { ctx, canvas, rows, cols, padding } = this;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const areaW = canvas.width - padding * 2;
        const areaH = canvas.height - padding * 2;
        const cellW = areaW / cols;
        const cellH = areaH / rows;

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
