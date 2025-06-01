class Camara {
    constructor(juego) {
        this.juego = juego;
        
        // Inicializar la escala del contenedor
        //this.juego.worldContainer.scale.set(1, 1);
    }
    inicializar() {
        this.juego.app.stage.addChild(this.juego.worldContainer);
    }

    actualizar() {
        const { worldContainer, slime, fondo } = this.juego;

        if (!slime || !fondo) {
            console.warn('No se puede actualizar la cámara: slime o fondo no están definidos');
            return;
        }

        // Obtener las escalas actuales
        const { x: escalaX, y: escalaY } = worldContainer.scale;

        // Calcular los límites del mundo
        const limites = {
            izquierdo: fondo.position.x,
            derecho: fondo.position.x + fondo.width,
            superior: fondo.position.y,
            inferior: fondo.position.y + fondo.height
        };

        // Calcular la posición objetivo de la cámara
        let targetX = -slime.position.x * escalaX + (this.juego.app.screen.width / 2);
        let targetY = -slime.position.y * escalaY + (this.juego.app.screen.height / 2);

        // Calcular los límites de la cámara
        const limitesCamara = {
            minX: -limites.derecho * escalaX + this.juego.app.screen.width,
            maxX: -limites.izquierdo * escalaX,
            minY: -limites.inferior * escalaY + this.juego.app.screen.height,
            maxY: -limites.superior * escalaY
        };

        // Aplicar los límites con una función de clamp
        targetX = Math.max(limitesCamara.minX, Math.min(limitesCamara.maxX, targetX));
        targetY = Math.max(limitesCamara.minY, Math.min(limitesCamara.maxY, targetY));

        // Aplicar suavizado al movimiento
        const factorSuavizado = 0.1;
        const deltaX = targetX - worldContainer.x;
        const deltaY = targetY - worldContainer.y;

        worldContainer.x += deltaX * factorSuavizado;
        worldContainer.y += deltaY * factorSuavizado;

        // Validación de valores numéricos
        if (isNaN(worldContainer.x) || isNaN(worldContainer.y)) {
            console.error('Error en la actualización de la cámara:', {
                posicionActual: { x: worldContainer.x, y: worldContainer.y },
                posicionObjetivo: { x: targetX, y: targetY },
                escalas: { x: escalaX, y: escalaY }
            });
            // Restablecer a una posición segura
            worldContainer.x = worldContainer.x || 0;
            worldContainer.y = worldContainer.y || 0;
        }
    }

    ajustarTamanio(tamanioDeAumento) {
        const worldContainer = this.juego.worldContainer;
        const escalaMinima = 0.1;
        const escalaMaxima = 2;
    
        // Nueva escala
        const nuevaEscalaX = Math.max(escalaMinima, Math.min(worldContainer.scale.x + tamanioDeAumento, escalaMaxima));
        const nuevaEscalaY = Math.max(escalaMinima, Math.min(worldContainer.scale.y + tamanioDeAumento, escalaMaxima));
    
        // Calcular el cambio de escala
        const factorCambioX = nuevaEscalaX / worldContainer.scale.x;
        const factorCambioY = nuevaEscalaY / worldContainer.scale.y;
    
        // Ajustar la posición para mantener el centro
        const centroX = this.juego.ancho / 2;
        const centroY = this.juego.alto / 2;
    
        worldContainer.x = centroX - (centroX - worldContainer.x) * factorCambioX;
        worldContainer.y = centroY - (centroY - worldContainer.y) * factorCambioY;
    
        // Aplicar la nueva escala
        worldContainer.scale.set(nuevaEscalaX, nuevaEscalaY);
    }
}