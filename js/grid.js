// Dibujo del grid: chunks (rows×cols) con subdivisiones (subRows×subCols) cada uno.
class Grid {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rows = options.rows;
        this.cols = options.cols;
        this.subRows = options.subRows;
        this.subCols = options.subCols;
        this.size = options.size; // lado del mundo (cuadrado)
        this.lineColor = options.lineColor;
        this.subLineColor = options.subLineColor;
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

    // Dibuja líneas verticales y horizontales equiespaciadas sobre el área.
    _drawLines(divX, divY, x0, y0, area, color) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let c = 0; c <= divX; c++) {
            const x = x0 + (c / divX) * area;
            ctx.moveTo(x, y0);
            ctx.lineTo(x, y0 + area);
        }
        for (let r = 0; r <= divY; r++) {
            const y = y0 + (r / divY) * area;
            ctx.moveTo(x0, y);
            ctx.lineTo(x0 + area, y);
        }
        ctx.stroke();
    }

    // El bucle limpia el canvas (en coordenadas de pantalla) antes de aplicar
    // la cámara, así que aquí ya no se borra.
    draw() {
        const { ctx, size, rows, cols, subRows, subCols, padding } = this;
        const x0 = padding, y0 = padding;
        const area = size - padding * 2;

        // Fondo del área (todas las celdas comparten color).
        ctx.fillStyle = this.cellColor;
        ctx.fillRect(x0, y0, area, area);

        // 1) Subdivisiones (tenues): rejilla fina = chunks × subdivisiones.
        this._drawLines(cols * subCols, rows * subRows, x0, y0, area, this.subLineColor);

        // 2) Líneas de chunk (marcadas), por encima.
        this._drawLines(cols, rows, x0, y0, area, this.lineColor);
    }
}
