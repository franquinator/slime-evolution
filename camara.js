class Camara {
    constructor(juego) {
        this.juego = juego;
        // Inicializar la escala del contenedor con un valor inicial apropiado
        this.juego.worldContainer.scale.set(0.8, 0.8);
        this.factorSuavizado = 0.1;

        this.factorSuavizadoescala = 0.1;
        this.escala = 0.25;
        
    }

    inicializar() {
        this.juego.app.stage.addChild(this.juego.worldContainer);
        this.ajustarTamanio(this.escala);
        this.objetivo = this.juego.slime;
    }
    ponerObjetivo(objetivo) {
        if (!objetivo) {
            console.warn('Objetivo no definido, se usará el slime por defecto');
            this.objetivo = this.juego.slime;
        }
        this.objetivo = objetivo;
    }

    actualizar() {
        
        const { worldContainer, slime, fondo } = this.juego;
        if (!this.objetivo || !fondo) {
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
        let targetX = -this.objetivo.position.x * escalaX + (this.juego.app.screen.width / 2);
        let targetY = -this.objetivo.position.y * escalaY + (this.juego.app.screen.height / 2);

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

        worldContainer.x = interpolacionLineal(worldContainer.x,targetX,this.factorSuavizado);
        worldContainer.y = interpolacionLineal(worldContainer.y,targetY,this.factorSuavizado);

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
        this.hacerZoomLento(worldContainer);
    }
    enfocarEn(x,y){
        console.log(this.juego.worldContainer.x);
        this.juego.worldContainer.x = -x;
        this.juego.worldContainer.y = -y;
    }
    hacerZoomLento(worldContainer){
        let inicio = worldContainer.scale.x;
        worldContainer.scale.set(interpolacionLineal(inicio,this.escala,this.factorSuavizadoescala));
    }

    actualizarLimitesZoom() {
        // Ajustar límites de zoom según el nivel
        if (this.juego.nivelActual === 1) {
            this.escalaMinima = 0.2;
            this.escalaMaxima = 1.5;
        } else if (this.juego.nivelActual === 2) {
            this.escalaMinima = 0.15;
            this.escalaMaxima = 1.2;
        } else {
            this.escalaMinima = 0.05;
            this.escalaMaxima = 1.5;
        }
    }

    ajustarTamanio(tamanioDeAumento) {
        const worldContainer = this.juego.worldContainer;
        /* const mouse = this.juego.mouse;
    
        // Actualizar límites de zoom según el nivel
        this.actualizarLimitesZoom();
    
        // Calcular la posición del mouse relativa al contenedor del mundo
        const mouseX = (mouse.x - worldContainer.x) / worldContainer.scale.x;
        const mouseY = (mouse.y - worldContainer.y) / worldContainer.scale.y;
    
        // Calcular la nueva escala
        const nuevaEscalaX = Math.max(this.escalaMinima, 
            Math.min(worldContainer.scale.x + tamanioDeAumento, this.escalaMaxima));
        const nuevaEscalaY = Math.max(this.escalaMinima, 
            Math.min(worldContainer.scale.y + tamanioDeAumento, this.escalaMaxima));
    
        // Calcular el cambio de escala
        const factorCambioX = nuevaEscalaX / worldContainer.scale.x;
        const factorCambioY = nuevaEscalaY / worldContainer.scale.y;
    
        // Ajustar la posición para mantener el punto del mouse fijo
        worldContainer.x = mouse.x - mouseX * nuevaEscalaX;
        worldContainer.y = mouse.y - mouseY * nuevaEscalaY; */
    
        // Aplicar la nueva escala
        worldContainer.scale.set(tamanioDeAumento, tamanioDeAumento);
    }
    hacerZoom(veces){
        this.juego.worldContainer.scale.set(this.escala*veces);
    }
    sacarZoom(){
        this.juego.worldContainer.scale.set(1,1);
    }
}