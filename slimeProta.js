class SlimeProta extends Entidad{
    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,juego);
        this.tiempoDesdeUltimoDaño = 0;

        this.scaleOffset = 8;
        this.animacionActual = null;
        //this.MostrarCollider();
    }
    async inicializar(){
        await this.cargarAnimacion();
    }

    async cargarAnimacion() {
        // Carga el spritesheet
        this.sheet = await PIXI.Assets.load("Assets/texture.json");

        // Creamos la animación con los frames "move"
        this.sprite = new PIXI.AnimatedSprite(this.sheet.animations["move"]);
        this.sprite.animationSpeed = 0.15;
        this.sprite.play();
        this.sprite.anchor.set(0.43,0.56);
        this.sprite.setSize(this.radio * this.scaleOffset);

        this.container.name = "jugador";

        this.container.addChild(this.sprite);

        // Lo agregamos al mundo
        this.juego.worldContainer.addChild(this.container);
    }

    update(){
        //console.log(this.position);
        if(this.tiempoDesdeUltimoDaño > 0){
            this.tiempoDesdeUltimoDaño -= this.juego.delta;
        }
        //console.log(this.posicionEnPantalla(),this.juego.mousePos);
        this.asignarFuerzaQueMeLlevaAlMouse();
        this.verificarColisiones();
        super.update();
    }


    render(){
        //efectoDeDaño();
        if(this.tiempoDesdeUltimoDaño > 0){
            this.container.tint = 0xff0000;//cambiar a rojo
        }
        else{
            this.container.tint = 0xffffff;
        }

        //cambioDeDireccion();
        if(this.vel.x > 0){
            this.container.scale.x = 1;
        }
        else if(this.vel.x < 0){
            this.container.scale.x = -1;
        }

        //cambioDeAnimaciones();
        if(Math.abs(this.vel.x) < 0.1 && Math.abs(this.vel.y) < 0.1 && this.animacionActual !== "idle"){
            this.cambiarAnimacion("idle");
        }
        if((Math.abs(this.vel.x) > 0.1 || Math.abs(this.vel.y) > 0.1) && this.animacionActual !== "move"){
            this.cambiarAnimacion("move");
        }
        
        super.render();
    }
    cambiarAnimacion(nombreAnimacion) {
        if (!this.sheet) {
            return;
        }

        if (this.sheet.animations[nombreAnimacion]) {
            this.animacionActual = nombreAnimacion;
            this.sprite.textures = this.sheet.animations[nombreAnimacion]; // Cambia las texturas
            this.sprite.play(); // Reproduce la nueva animación
        } else {
            console.error(`La animación "${nombreAnimacion}" no existe en el spritesheet.`);
        }
    }

    asignarFuerzaQueMeLlevaAlMouse(){
        this.asignarAceleracion(0,0);
        if(!this.juego.mouse || distancia(this.posicionEnPantalla(),this.juego.mouse) < 50) return;

        const fuerza = getUnitVector(
            this.juego.mouse,
            this.posicionEnPantalla()
        );
        //console.log("mouse: "+this.juego.mouse.x);
        //console.log("posicion: "+this.posicionEnPantalla().x);
        if(this.sprite == null) return console.error("sprite null");
        ;

        this.asignarAceleracionNormalizada(fuerza.x * this.MultiplicadorDeAceleracion , fuerza.y * this.MultiplicadorDeAceleracion);
    }
    posicionEnPantalla(){
        //console.log("posicion jugador: " + this.position.x);
        //console.log("juego: " + this.juego.worldContainer.x);
        const posicion = this.juego.worldContainer.toGlobal(this.position);
        return {
            x: posicion.x, //* escalaX,
            y: posicion.y //* escalaY
        };
    }

    verificarColisiones(){
        //const colisiones = this.juego.obtenerEntidadesCercanasSinOptimizar(this,this.radio);
        //const colisiones = this.juego.obtenerEntidadesCercanasQuadtree(this,this.radio);
        const colisiones = this.juego.npcManager.obtenerEntidadesCercanasSinOptimizar(this, this.radio);
        //const posiblesColisiones = this.juego.quadtree.recuperar(this);

        for (let i = 0; i < colisiones.length; i++) {
            const npcActual = colisiones[i];
            if(npcActual.radio <= this.radio){
                this.comer(npcActual);
/*                 if(this.juego.todasLasEntidades.length == 0){
                    alert("Ganaste (Presiona 'F5' para reiniciar)");
                } */
            }
            /*else if(npcActual.radio > this.radio && this.tiempoDesdeUltimoDaño <= 0){
                this.juego.perderVida();
                this.tiempoDesdeUltimoDaño = 1000;
            }*/
        }
    }

    comer(comida){
        if(this.sprite == null) return;

        let crecimiento = comida.radio / this.radio;
        
        // Aumentar los puntos si es una larva en el nivel 2
        if(this.juego.nivelActual === 2 && comida.constructor.name === 'Larva') {
            this.juego.agregarPuntos(5); // Dar 5 puntos por cada larva en nivel 2
        } else {
            this.juego.agregarPuntos(1); // Puntos normales para otros casos
        }

        // Aumentar velocidad si come un pez en el nivel 3
        if(this.juego.nivelActual === 3 && comida.constructor.name === 'Pez') {
            this.MultiplicadorDeAceleracion *= 1.2; // Aumentar la aceleración en 20%
            this.velocidadMax *= 1.2; // Aumentar la velocidad máxima en 20%
        }

        this.radio += crecimiento * 10;
        this.sprite.setSize(this.radio * this.scaleOffset);

        this.juego.npcManager.eliminarEntidad(comida);

        if(this.radio >= this.juego.radioNivelActual){
            console.log("radio: "+this.radio+" radioNivelActual: "+this.juego.radioNivelActual);
            this.juego.subirNivel();
        }
        this.juego.hud.actualizarDebug("crecimiento: " + crecimiento);
    }
}