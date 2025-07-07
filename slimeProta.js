class SlimeProta extends Entidad{
    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,20,juego);
        this.tiempoDesdeUltimoDaño = 0;

        this.scaleOffset = 4;
        this.animacionActual = null;

        this.MultiplicadorDeMouse = 100;
        
        //variables de turbo
        this.turboMax = 2000;
        this.cantTurbo = 2000;
        
        this.penalizacionTurboInsuficiente = 1000;

        this.velRecupTurbo = 0.5;
        this.velCosumoTurbo = 1;

        //variables de velocidad
        this.velTurbo = 40;
        this.velNormal = 20;

        this.colisionesActivas = true;

        // this.MostrarCollider(); // Comentado: oculta el círculo verde del collider del personaje
    }

    async inicializar(){
        await this.cargarAnimacion();
    }

    async cargarAnimacion() {
        // Carga el spritesheet
        this.sheet = await PIXI.Assets.load("Assets/texture.json");
        this.sheet.textureSource.scaleMode = 'nearest';

        // Creamos la animación con los frames "move"
        this.sprite = new PIXI.AnimatedSprite(this.sheet.animations["move"]);
        this.sprite.animationSpeed = 0.15;
        this.sprite.play();
        this.sprite.anchor.set(0.43,0.56);
        this.sprite.setSize(this.radio * 2 * this.scaleOffset);
        this.container.zIndex = 12;

        this.container.name = "jugador";

        this.container.addChild(this.sprite);

        // Lo agregamos al mundo
        this.juego.worldContainer.addChild(this.container);
    }

    update(){
        this.vel.x *= 0.9;
        this.vel.y *= 0.9;
        this.sistemaTurbo();

        if(this.tiempoDesdeUltimoDaño > 0){
            this.tiempoDesdeUltimoDaño -= this.juego.delta;
        }

        this.asignarFuerzaQueMeLlevaAlMouse();

        if(this.colisionesActivas){
            this.verificarColisiones();
        }
        super.update();
        
    }

    sistemaTurbo(){
        if(this.juego.mousePresionado && this.cantTurbo > 0){
            this.cantTurbo -= this.juego.delta * this.velCosumoTurbo;

            this.velocidadMax = this.velTurbo;
            
            if(this.cantTurbo <= 0){
                this.cantTurbo = -this.penalizacionTurboInsuficiente
            }
        }
        else{
            this.cantTurbo += this.juego.delta * this.velRecupTurbo;
            this.cantTurbo = Math.min(this.turboMax,this.cantTurbo);

            this.velocidadMax = this.velNormal;
        }
        this.juego.hud.setBarraTurbo(this.cantTurbo / this.turboMax * 100);
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

        this.asignarAceleracion(fuerza.x * this.MultiplicadorDeMouse , fuerza.y * this.MultiplicadorDeMouse);
    }

    posicionEnPantalla(){
        const posicion = this.juego.worldContainer.toGlobal(this.position);
        return {
            x: posicion.x, //* escalaX,
            y: posicion.y //* escalaY
        };
    }

    alternarColisiones(){
        this.colisionesActivas = !this.colisionesActivas;
    }

    verificarColisiones(){
        const colisiones = this.juego.grilla.obtenerColisionesCon(this);

        for (let i = 0; i < colisiones.length; i++) {
            const npcActual = colisiones[i];
            
            // Verificar que la entidad existe y no ha sido eliminada
            if (!npcActual || npcActual.fuiEliminado) {
                continue;
            }
            
            if(npcActual.radio <= this.radio && !npcActual.fuiEliminado){
                this.comer(npcActual);
            }
            else if(npcActual.radio > this.radio && this.tiempoDesdeUltimoDaño <= 0){
                this.juego.perderVida();
                this.tiempoDesdeUltimoDaño = 1000;
            }
        }
    }

    comer(comida){
        if(this.sprite == null || comida.fuiEliminado) return;
        
        /*
            si mide mas de 75% sube la cantidad de su masa;
            si mide mas del 50% sube la cantidad de su masa dividido 2;
            si mide mas del 25% sube la cantidad de su masa dividido 4;
            si mide menos del 25% sube la cantidad de su masa dividido 8
        */
        let escala = 10;
        let porcentaje = comida.radio * 100 / this.radio;

        let crecimiento = interpolacionLineal(0,comida.radio,porcentaje / 100) / escala;
        this.crecer(crecimiento);

        this.juego.agregarPuntos(1);

        comida.destroy();

        if(comida instanceof Tiburon){
            console.log("¡VICTORIA! Completaste todos los niveles");
            this.juego.finalizarJuego(true);
            return;
        }

        this.juego.hud.actualizarDebug("crecimiento: " + crecimiento);
    }
    crecer(cantidad){
        this.radio += cantidad;

        this.sprite.setSize(this.radio * 2 * this.scaleOffset);
        // this.collider.setSize(this.radio * 2); // Comentado porque el collider está oculto

        const radioNecesario = this.juego.gestorNiveles.radioNivelActual();
        //console.log("Radio actual:", this.radio, "Radio necesario:", radioNecesario);
        
        if(this.radio >= radioNecesario){
            this.juego.gestorNiveles.subirNivel();
        }
    }
}