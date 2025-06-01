class SlimeProta extends Entidad{
    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,juego);
        this.tiempoDesdeUltimoDaño = 0;

        this.scaleOffset = 8;
        this.animacionActual = null;
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
        const colisiones = this.juego.npcManager.obtenerEntidadesCercanasSpatialHash(this, this.radio);
        //const posiblesColisiones = this.juego.quadtree.recuperar(this);

        for (let i = 0; i < colisiones.length; i++) {
            const npcActual = colisiones[i];
            if(npcActual.radio <= this.radio){
                this.comer(npcActual);
/*                 if(this.juego.todasLasEntidades.length == 0){
                    alert("Ganaste (Presiona 'F5' para reiniciar)");
                } */
            }
            else if(npcActual.radio > this.radio && this.tiempoDesdeUltimoDaño <= 0){
                this.juego.perderVida();
                this.tiempoDesdeUltimoDaño = 1000;
            }
        }
    }

    comer(comida){
        if(this.sprite == null) return;

        //forma realista de sumas radios
/*         var area = Math.PI * this.radio ** 2;
        var area2 = Math.PI * comida.radio ** 2;
        this.radio = Math.sqrt((area + area2) / Math.PI); */
        let crecimiento = comida.radio / this.radio;

        this.radio += crecimiento * 10;
        this.sprite.setSize(this.radio * this.scaleOffset);

        this.juego.agregarPuntos(1);

        this.juego.npcManager.eliminarEntidad(comida);

        if(this.radio >= 80 && this.juego.nivelActual == 1){
            this.juego.nivelActual = 2;
            this.juego.cargarNivel2();
        }
        this.juego.hud.actualizarDebug("crecimiento: " + crecimiento);
    }
}