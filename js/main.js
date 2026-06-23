// Punto de entrada: grid + puntos vivos que se mueven aleatoriamente.
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const grid = new Grid(canvas, CONFIG.grid);

    const countInput = document.getElementById('point-count');
    const resetBtn = document.getElementById('reset-btn');
    const resultsBody = document.getElementById('results-body');

    let points = [];

    // (Re)genera los puntos a partir del valor actual del control.
    function buildPoints() {
        const count = Math.max(0, parseInt(countInput.value, 10) || 0);
        const bounds = grid.getBounds();
        points = [];
        for (let i = 0; i < count; i++) {
            points.push(new Point(bounds, CONFIG.points));
        }
        updateResults();
    }

    function updateResults() {
        resultsBody.innerHTML = `<p>Puntos activos: <strong>${points.length}</strong></p>`;
    }

    // Bucle de animación.
    function loop() {
        grid.draw();
        for (const p of points) {
            p.update();
            p.draw(ctx);
        }
        requestAnimationFrame(loop);
    }

    // Reset: aplica los nuevos cambios (regenera los puntos).
    resetBtn.addEventListener('click', buildPoints);

    // Inicializa el valor del control desde la config y arranca.
    countInput.value = CONFIG.points.count;
    buildPoints();
    loop();
});
