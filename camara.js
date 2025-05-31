class Camara {
    constructor(juego) {
        this.juego = juego;
        this.juego.worldContainer = new PIXI.Container({
            // this will make moving this container GPU powered
            isRenderGroup: true,
        });
        this.juego.app.stage.addChild(this.juego.worldContainer);
        
        // Inicializar la escala del contenedor
        this.juego.worldContainer.scale.set(1, 1);
    }

    actualizar() {
        const worldContainer = this.juego.worldContainer;
        const slime = this.juego.slime;
        const fondo = this.juego.fondo;
        
        if (!slime || !fondo) return;

        const cuanto = 0.5; // Factor de suavizado más suave

        // Considerar la escala actual del worldContainer
        const escalaX = worldContainer.scale.x;
        const escalaY = worldContainer.scale.y;
    
        // Calcular los límites del fondo en coordenadas de mundo
        const limiteIzquierdo = fondo.x;
        const limiteDerecho = fondo.x + fondo.width;
        const limiteSuperior = fondo.y;
        const limiteInferior = fondo.y + fondo.height;
    
        // Calcular la posición objetivo de la cámara
        let targetX = -slime.position.x * escalaX + (this.juego.ancho / 2);
        let targetY = -slime.position.y * escalaY + (this.juego.alto / 2);
    
        // Ajustar los límites para mantener el fondo visible
        const minX = -limiteDerecho * escalaX + this.juego.ancho;
        const maxX = -limiteIzquierdo * escalaX;
        const minY = -limiteInferior * escalaY + this.juego.alto;
        const maxY = -limiteSuperior * escalaY;
    
        // Aplicar los límites
        targetX = Math.max(minX, Math.min(maxX, targetX));
        targetY = Math.max(minY, Math.min(maxY, targetY));
    
        // Suavizar el movimiento de la cámara con los límites aplicados
        worldContainer.x += (targetX - worldContainer.x) * cuanto;
        worldContainer.y += (targetY - worldContainer.y) * cuanto;
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