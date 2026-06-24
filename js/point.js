// Un punto "vivo" que se mueve dentro de unos márgenes y cambia de
// comportamiento de forma aleatoria en el tiempo.
//
// Comportamientos:
//   - 'wander'   : vaga libre por todo el canvas (caminata aleatoria).
//   - 'centroid' : pulula alrededor de uno de los centroides (elegido al azar).
class Point {
    constructor(bounds, options, behaviors) {
        this.bounds = bounds;        // { minX, minY, maxX, maxY }
        this.options = options;      // CONFIG.points
        this.behaviors = behaviors;  // CONFIG.behaviors

        this.radius = options.radius;
        this.turn = options.turn;
        this.switchChance = options.behaviorSwitchChance;

        // Velocidad propia, elegida al azar dentro del rango (ya no es fija).
        this.speed = this._rand(options.speedMin, options.speedMax);

        // Posición y dirección iniciales aleatorias.
        this.x = this._rand(bounds.minX, bounds.maxX);
        this.y = this._rand(bounds.minY, bounds.maxY);
        this.heading = Math.random() * Math.PI * 2;

        // Comportamiento inicial aleatorio.
        this.target = null; // centroide asignado cuando está en modo 'centroid'
        this.behavior = Math.random() < 0.5 ? 'wander' : 'centroid';
        if (this.behavior === 'centroid') this._pickCentroid();
    }

    _rand(min, max) {
        return min + Math.random() * (max - min);
    }

    // Elige al azar uno de los centroides disponibles.
    _pickCentroid() {
        const list = this.behaviors.centroid.list;
        this.target = (list && list.length)
            ? list[Math.floor(Math.random() * list.length)]
            : null;
    }

    // De vez en cuando gana/pierde un comportamiento (alterna entre los dos).
    // Al ganar 'centroid' elige un centroide nuevo al azar.
    _maybeSwitchBehavior() {
        if (Math.random() < this.switchChance) {
            this.behavior = this.behavior === 'wander' ? 'centroid' : 'wander';
            if (this.behavior === 'centroid') this._pickCentroid();
        }
    }

    // Avanza un frame.
    update() {
        this._maybeSwitchBehavior();

        // Giro aleatorio base (caminata aleatoria).
        this.heading += (Math.random() - 0.5) * this.turn;

        // Comportamiento centroide: si se aleja más del radio de SU centroide,
        // vuelve hacia él.
        if (this.behavior === 'centroid' && this.target) {
            const radius = this.behaviors.centroid.radius;
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist > radius) {
                // Apunta hacia el centroide, con algo de ruido para que "pulule".
                this.heading = Math.atan2(dy, dx) + (Math.random() - 0.5) * this.turn;
            }
        }

        let nx = this.x + Math.cos(this.heading) * this.speed;
        let ny = this.y + Math.sin(this.heading) * this.speed;

        const b = this.bounds;
        // Rebote en los márgenes del canvas (vale para cualquier comportamiento).
        if (nx < b.minX || nx > b.maxX) {
            this.heading = Math.PI - this.heading;
            nx = Math.max(b.minX, Math.min(b.maxX, nx));
        }
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
        ctx.fillStyle = this.behaviors[this.behavior].color;
        ctx.fill();
    }
}
