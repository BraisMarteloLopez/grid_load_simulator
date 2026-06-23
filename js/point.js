// Un punto "vivo" que se mueve aleatoriamente dentro de unos márgenes.
class Point {
    constructor(bounds, options) {
        this.bounds = bounds; // { minX, minY, maxX, maxY }
        this.radius = options.radius;
        this.color = options.color;
        this.speed = options.speed;
        this.turn = options.turn;

        // Posición inicial aleatoria dentro de los márgenes.
        this.x = this._rand(bounds.minX, bounds.maxX);
        this.y = this._rand(bounds.minY, bounds.maxY);

        // Dirección inicial aleatoria.
        this.heading = Math.random() * Math.PI * 2;
    }

    _rand(min, max) {
        return min + Math.random() * (max - min);
    }

    // Avanza un frame: caminata aleatoria con rebote en los márgenes.
    update() {
        // Pequeño giro aleatorio para que el movimiento se sienta "vivo".
        this.heading += (Math.random() - 0.5) * this.turn;

        let nx = this.x + Math.cos(this.heading) * this.speed;
        let ny = this.y + Math.sin(this.heading) * this.speed;

        const b = this.bounds;
        // Rebote horizontal.
        if (nx < b.minX || nx > b.maxX) {
            this.heading = Math.PI - this.heading;
            nx = Math.max(b.minX, Math.min(b.maxX, nx));
        }
        // Rebote vertical.
        if (ny < b.minY || ny > b.maxY) {
            this.heading = -this.heading;
            ny = Math.max(b.minY, Math.min(b.maxY, ny));
        }

        this.x = nx;
        this.y = ny;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
