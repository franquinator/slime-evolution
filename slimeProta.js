class SlimeProta extends Entidad{
    //HOLA
    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,juego);
        this.tiempoDesdeUltimoDaño = 0;

        this.scaleOffset = 8;
        this.animacionActual = null;
       
        this.cargarAnimacion();
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
        if(this.tiempoDesdeUltimoDaño > 0){
            this.tiempoDesdeUltimoDaño -= this.juego.delta;
        }
         
        this.asignarFuerzaQueMeLlevaAlMouse();
        super.update();
        this.verificarColisiones();
    }


    render(){

        if(this.tiempoDesdeUltimoDaño > 0){
            this.container.tint = 0xff0000;//cambiar a rojo
        }
        else{
            this.container.tint = 0xffffff;
        }

        if(this.vel.x > 0){
            this.container.scale.x = 1;
        }
        else if(this.vel.x < 0){
            this.container.scale.x = -1;
        }

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

    moverOjos(){
        if(this.juego.mousePos === undefined) return;
        const distanciaAlMouse = distancia(this.position,this.juego.mousePos);
        const direccion = getUnitVector(this.juego.mousePos,this.position);
        const distanciaOjos = this.radio/2 + this.radio/4;
        const distanciaPupilas = this.radio/2 + this.radio/8;
    }


    asignarFuerzaQueMeLlevaAlMouse(){
        this.asignarAceleracion(0,0);
        if(this.juego.mousePos === undefined || distancia(this.juego.centro,this.juego.mousePos) < 50) return;

        const fuerza = getUnitVector(
            this.juego.mousePos,
            this.juego.centro
        );

        this.asignarAceleracionNormalizada(fuerza.x * this.MultiplicadorDeAceleracion , fuerza.y * this.MultiplicadorDeAceleracion);
    }
    verificarColisiones(){
        for (let i = 0; i < this.juego.todasLasEntidades.length; i++){
            const npcActual = this.juego.todasLasEntidades[i]
            if(distancia(this.position,npcActual.position) < this.radio + npcActual.radio){
                if(npcActual.radio <= this.radio){
                    this.comer(npcActual);
                    this.juego.todasLasEntidades.splice(i, 1);
                    if(this.juego.todasLasEntidades==0){
                        alert("Ganaste (Presiona 'F5' para reiniciar)");
                    }
                    i--;
                }
                else if(npcActual.radio > this.radio && this.tiempoDesdeUltimoDaño <= 0){
                    this.juego.perderVida();
                    this.tiempoDesdeUltimoDaño = 1000;
                }
            }
        }
    }
    comer(comida){
        var area = Math.PI * this.radio ** 2;
        var area2 = Math.PI * comida.radio ** 2;
        this.radio = Math.sqrt((area + area2) / Math.PI);

        this.sprite.setSize(this.radio * this.scaleOffset);

        this.juego.comidaConseguida += 1;
        this.juego.contadorDeComidaTexto.text =  "Comidos: " + this.juego.comidaConseguida;

        this.juego.app.stage.removeChild(comida);
        comida.destroy();
    }
}