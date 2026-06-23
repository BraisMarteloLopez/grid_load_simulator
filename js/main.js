// Punto de entrada: inicializa el grid estático.
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;

    const grid = new Grid(canvas, CONFIG.grid);
    grid.draw();
});
