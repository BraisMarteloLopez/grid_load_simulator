// Punto de entrada: grid + puntos vivos con comportamientos aleatorios.
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const grid = new Grid(canvas, CONFIG.grid);

    const countInput = document.getElementById('point-count');
    const resetBtn = document.getElementById('reset-btn');
    const resultsBody = document.getElementById('results-body');
    const fpsValue = document.getElementById('fps-value');

    let points = [];

    // --- Medición de FPS ---
    let lastTime = null;   // timestamp del frame anterior
    let fps = 0;           // FPS suavizado
    let lastFpsShown = 0;  // última vez que refrescamos el texto

    function updateFps(now) {
        if (lastTime !== null) {
            const delta = now - lastTime;
            if (delta > 0) {
                const instant = 1000 / delta;
                // Media móvil exponencial para que el número no parpadee.
                fps = fps ? fps * 0.9 + instant * 0.1 : instant;
            }
        }
        lastTime = now;
        // Refresca el texto ~4 veces por segundo.
        if (now - lastFpsShown > 250) {
            fpsValue.textContent = Math.round(fps);
            lastFpsShown = now;
        }
    }

    // (Re)genera los puntos a partir del valor actual del control.
    function buildPoints() {
        const count = Math.max(0, parseInt(countInput.value, 10) || 0);
        const bounds = grid.getBounds();
        points = [];
        for (let i = 0; i < count; i++) {
            points.push(new Point(bounds, CONFIG.points, CONFIG.behaviors));
        }
    }

    function updateResults() {
        const wander = points.filter(p => p.behavior === 'wander').length;
        const centroid = points.length - wander;
        resultsBody.innerHTML =
            `<p>Puntos activos: <strong>${points.length}</strong></p>` +
            `<p style="color:${CONFIG.behaviors.wander.color}">Vagando (wander): <strong>${wander}</strong></p>` +
            `<p style="color:${CONFIG.behaviors.centroid.color}">Pululando (centroide): <strong>${centroid}</strong></p>`;
    }

    // Dibuja el área del centroide (si está activada).
    function drawCentroidArea() {
        const c = CONFIG.behaviors.centroid;
        if (!c.showArea) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.strokeStyle = c.color;
        ctx.globalAlpha = 0.35;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();
    }

    // Bucle de animación.
    function loop(now) {
        updateFps(now);
        grid.draw();
        drawCentroidArea();
        for (const p of points) {
            p.update();
            p.draw(ctx);
        }
        updateResults();
        requestAnimationFrame(loop);
    }

    // Reset: aplica los nuevos cambios (regenera los puntos).
    resetBtn.addEventListener('click', buildPoints);

    // Inicializa el valor del control desde la config y arranca.
    countInput.value = CONFIG.points.count;
    buildPoints();
    requestAnimationFrame(loop);
});
