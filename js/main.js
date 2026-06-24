// Punto de entrada: grid + puntos vivos con comportamientos aleatorios.
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const grid = new Grid(canvas, CONFIG.grid);
    const camera = new Camera(CONFIG.view);

    const countInput = document.getElementById('point-count');
    const centroidInput = document.getElementById('centroid-count');
    const proximityInput = document.getElementById('proximity-distance');
    const speedInput = document.getElementById('speed');
    const joinToggle = document.getElementById('join-toggle');
    const resetBtn = document.getElementById('reset-btn');
    const resultsBody = document.getElementById('results-body');
    const fpsValue = document.getElementById('fps-value');
    const zoomValue = document.getElementById('zoom-value');

    let points = [];

    // Comportamientos en runtime: el centroide se resuelve a píxeles según el
    // tamaño actual del canvas (su posición es relativa en la config).
    const behaviors = {
        wander: CONFIG.behaviors.wander,
        centroid: {
            color: CONFIG.behaviors.centroid.color,
            radius: CONFIG.behaviors.centroid.radius,
            showArea: CONFIG.behaviors.centroid.showArea,
            list: [], // centroides repartidos por el grid (se generan abajo)
        },
    };

    // Genera varios centroides repartidos por el grid mediante una rejilla
    // regular + jitter aleatorio (posición "más o menos aleatoria").
    function generateCentroids() {
        const bounds = grid.getBounds();
        const cc = CONFIG.behaviors.centroid;
        const n = Math.max(1, parseInt(centroidInput.value, 10) || cc.count);
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const cellW = (bounds.maxX - bounds.minX) / cols;
        const cellH = (bounds.maxY - bounds.minY) / rows;
        const list = [];
        for (let i = 0; i < n; i++) {
            const gx = i % cols;
            const gy = Math.floor(i / cols);
            let x = bounds.minX + (gx + 0.5) * cellW + (Math.random() - 0.5) * cellW * cc.jitter;
            let y = bounds.minY + (gy + 0.5) * cellH + (Math.random() - 0.5) * cellH * cc.jitter;
            // Mantén el área del centroide dentro de los márgenes.
            x = Math.max(bounds.minX + cc.radius, Math.min(bounds.maxX - cc.radius, x));
            y = Math.max(bounds.minY + cc.radius, Math.min(bounds.maxY - cc.radius, y));
            list.push({ x, y });
        }
        behaviors.centroid.list = list;
    }

    // Encuadra el grid cuadrado para que llene la pantalla manteniendo la
    // proporción 1:1, centrado.
    function fitCamera() {
        camera.fitSquare(canvas.width, canvas.height, CONFIG.grid.size, CONFIG.view.fitFill);
    }

    // Ajusta el tamaño interno del canvas al que ocupa en pantalla y reencuadra.
    // El mundo del grid es cuadrado y fijo, así que los puntos no cambian de
    // márgenes al redimensionar: solo cambia la cámara.
    function resizeCanvas() {
        const w = Math.round(canvas.clientWidth);
        const h = Math.round(canvas.clientHeight);
        if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
            canvas.width = w;
            canvas.height = h;
        }
        fitCamera();
    }

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
        interactions = [];  // descarta líneas que referencian puntos antiguos
        for (let i = 0; i < count; i++) {
            points.push(new Point(bounds, CONFIG.points, behaviors));
        }
    }

    function updateResults() {
        const wander = points.filter(p => p.behavior === 'wander').length;
        const centroid = points.length - wander;
        resultsBody.innerHTML =
            `<p style="color:${CONFIG.behaviors.wander.color}">Vagando (wander): <strong>${wander}</strong></p>` +
            `<p style="color:${CONFIG.behaviors.centroid.color}">Pululando (centroide): <strong>${centroid}</strong></p>`;
    }

    // Dibuja el área de todos los centroides (si está activado).
    function drawCentroidArea() {
        const c = behaviors.centroid;
        if (!c.showArea) return;
        ctx.save();
        ctx.strokeStyle = c.color;
        ctx.globalAlpha = 0.35;
        ctx.setLineDash([4, 4]);
        for (const p of c.list) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, c.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Convierte coordenadas de ratón a coordenadas de canvas (px internos),
    // teniendo en cuenta el posible reescalado CSS del canvas.
    function toCanvasCoords(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height),
            sx: canvas.width / rect.width,
            sy: canvas.height / rect.height,
        };
    }

    // Zoom con la rueda, centrado en el cursor.
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const { x, y } = toCanvasCoords(e.clientX, e.clientY);
        camera.zoomAt(x, y, e.deltaY);
    }, { passive: false });

    // Paneo arrastrando.
    let dragging = false;
    let lastX = 0, lastY = 0;
    canvas.addEventListener('mousedown', (e) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.classList.add('dragging');
    });
    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const { sx, sy } = toCanvasCoords(e.clientX, e.clientY);
        camera.panBy((e.clientX - lastX) * sx, (e.clientY - lastY) * sy);
        lastX = e.clientX;
        lastY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
        dragging = false;
        canvas.classList.remove('dragging');
    });

    // Bucle de animación.
    function loop(now) {
        updateFps(now);

        // Limpia todo el canvas en coordenadas de pantalla (sin la cámara),
        // y luego aplica la cámara para dibujar la escena.
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        camera.apply(ctx);

        // El grid y los centroides se dibujan a opacidad plena; solo los puntos
        // ajustan su propia opacidad. Reseteamos aquí para que la opacidad de
        // los puntos no se "filtre" a estos elementos.
        ctx.globalAlpha = 1;
        grid.draw();
        drawCentroidArea();

        // 1) Mueve todos los puntos.
        for (const p of points) p.update();
        // 2) Marca los que están demasiado cerca de otro punto.
        markProximity();
        // 3) Interacciones (líneas): solo si están activadas. Cuando está OFF
        //    no se ejecuta nada de su procesamiento (ni búsqueda, ni dibujo).
        if (joinToggle.checked) {
            updateInteractions();
            drawInteractions();
        }
        // 4) Dibuja los puntos.
        for (const p of points) p.draw(ctx);

        updateResults();
        updateZoom();
        requestAnimationFrame(loop);
    }

    // --- Interacciones ---
    // Cada `interval` frames, con probabilidad `chance`, una partícula que tenga
    // a otra dentro del rango (= proximity.distance × rangeMultiplier) crea una
    // línea de interacción que dura `duration` frames.
    let interactions = [];
    let interactionFrame = 0;

    function updateInteractions() {
        const cfg = CONFIG.points.interaction;

        // Envejece y descarta las líneas caducadas.
        interactions = interactions.filter(it => --it.framesLeft > 0);

        interactionFrame += 1;
        if (interactionFrame % cfg.interval !== 0) return;

        // Rango basado en la distancia de proximidad actual (la del control).
        const parsed = parseFloat(proximityInput.value);
        const prox = Number.isFinite(parsed) && parsed >= 0
            ? parsed
            : CONFIG.points.proximity.distance;
        const range = prox * cfg.rangeMultiplier;
        const range2 = range * range;

        for (let i = 0; i < points.length; i++) {
            if (Math.random() >= cfg.chance) continue;
            const a = points[i];
            const candidates = [];
            for (let j = 0; j < points.length; j++) {
                if (j === i) continue;
                const b = points[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                if (dx * dx + dy * dy < range2) candidates.push(b);
            }
            if (candidates.length) {
                const b = candidates[Math.floor(Math.random() * candidates.length)];
                interactions.push({ a, b, framesLeft: cfg.duration });
            }
        }
    }

    function drawInteractions() {
        if (!interactions.length) return;
        const cfg = CONFIG.points.interaction;
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = cfg.color;
        ctx.lineWidth = cfg.width;
        ctx.setLineDash([]);
        for (const it of interactions) {
            ctx.beginPath();
            ctx.moveTo(it.a.x, it.a.y);
            ctx.lineTo(it.b.x, it.b.y);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Marca como "crowded" los puntos con algún vecino a menos de la distancia
    // configurada (comparación O(n²) con distancia al cuadrado).
    function markProximity() {
        // Distancia configurable (acepta decimales); se aplica al instante.
        const parsed = parseFloat(proximityInput.value);
        const d = Number.isFinite(parsed) && parsed >= 0
            ? parsed
            : CONFIG.points.proximity.distance;
        const d2 = d * d;
        for (const p of points) p.crowded = false;
        for (let i = 0; i < points.length; i++) {
            const a = points[i];
            for (let j = i + 1; j < points.length; j++) {
                const b = points[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                if (dx * dx + dy * dy < d2) {
                    a.crowded = true;
                    b.crowded = true;
                }
            }
        }
    }

    function updateZoom() {
        if (zoomValue) zoomValue.textContent = Math.round(camera.scale * 100) + '%';
    }

    // Reset: regenera centroides (nueva ubicación), puntos y reencuadra.
    resetBtn.addEventListener('click', () => {
        generateCentroids();
        buildPoints();
        fitCamera();
    });

    // Reajusta el canvas cuando cambia el tamaño de la ventana.
    window.addEventListener('resize', resizeCanvas);

    // Velocidad: se aplica en vivo a todas las partículas.
    speedInput.addEventListener('input', () => {
        const v = parseFloat(speedInput.value);
        if (Number.isFinite(v) && v >= 0) CONFIG.points.speed = v;
    });

    // Al desactivar "Unir puntos", descarta las líneas activas al instante.
    joinToggle.addEventListener('change', () => {
        if (!joinToggle.checked) interactions = [];
    });

    // Inicializa el valor del control desde la config y arranca.
    countInput.value = CONFIG.points.count;
    centroidInput.value = CONFIG.behaviors.centroid.count;
    proximityInput.value = CONFIG.points.proximity.distance;
    speedInput.value = CONFIG.points.speed;
    joinToggle.checked = CONFIG.points.interaction.enabled;
    generateCentroids();
    resizeCanvas();
    buildPoints();
    requestAnimationFrame(loop);
});
