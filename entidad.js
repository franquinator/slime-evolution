class Entidad{
    constructor(posX,posY,radio,juego){
        verificarValor(posX,"posX");
        verificarValor(posY,"posY");
        verificarValor(radio,"radio");
        verificarValor(juego,"juego");

        this.position = {x:posX, y:posY};

        this.radio = radio; 
        this.juego = juego;

        this.vel = {x:0, y:0};
        this.aceleracion = {x:0, y:0};

        this.velocidadMax = 1;
        this.MultiplicadorDeAceleracion = 0.1;
        this.friccion = 0.90;

        this.container = new PIXI.Container();
        this.container.position.set(posX,posY);
    }
    async cargarSprite(ruta,escalaExtra){
        let textura = await PIXI.Assets.load(ruta);

        this.sprite = new PIXI.Sprite(textura);
        this.sprite.setSize(this.radio * 2 + escalaExtra);
        this.sprite.anchor.set(0.5,0.5);

        this.container.addChild(this.sprite);
        this.container.zIndex = 11;

        this.juego.worldContainer.addChild(this.container);
         
    }
    update(){
        this.aplicarAceleracion();
        this.aplicarFriccion();
        this.aplicarVelocidad();
    }
    
    asignarVelocidad(x,y){
        if (isNaN(x) || isNaN(y)) {
            throw new Error("Velocidad NaN detectada");
        }
        this.vel.x = x;
        this.vel.y = y;
    }

    asignarAceleracion(x,y){
        if (isNaN(x) || isNaN(y)) {
            throw new Error("Aceleración NaN detectada");
        }
        this.aceleracion.x = x;
        this.aceleracion.y = y;
    }

    asignarAceleracionNormalizada(x,y){
        if (isNaN(x) || isNaN(y)) {
            throw new Error("Aceleración NaN detectada");
        }
        const aceleracionNormalizada = normalizar(x,y);
        this.aceleracion.x = x;
        this.aceleracion.y = y;
    }

    asignarVelocidadNormalizada(x,y){
        if (isNaN(x) || isNaN(y)) {
            throw new Error("Velocidad NaN detectada");
        }
        const velocidadNormalizada = normalizar(x,y);
        this.vel.x = velocidadNormalizada.x;
        this.vel.y = velocidadNormalizada.y;
    }

    aplicarAceleracion(){
        if(velocidadLinear(this.vel.x,this.vel.y) < this.velocidadMax){
            this.vel.x += this.aceleracion.x;
            this.vel.y += this.aceleracion.y;
        }
    }
    aplicarVelocidad() {
        const delta = this.juego.delta;
        const posicionDeFondo = this.juego.fondo.position;
        const tamañoJuego = this.juego.fondo;


        //console.log("pos: "+this.position," vel",this.vel," delta",delta," posicionDeFondo",posicionDeFondo," tamañoJuego",tamañoJuego);
        this.position.x = clamp(this.position.x + this.vel.x * delta, posicionDeFondo.x, posicionDeFondo.x + tamañoJuego.width);
        this.position.y = clamp(this.position.y + this.vel.y * delta, posicionDeFondo.y, posicionDeFondo.y + tamañoJuego.height);
/* 
        if(this.position.x == undefined){
            debugger;
        }
        if(!this.position.y){
            debugger;
        } */
    }
    irA(x,y){
        this.position.x = x;
        this.position.y = y;
    }
    frenar(){
        this.vel.x = 0;
        this.vel.y = 0;
        this.aceleracion.x = 0;
        this.aceleracion.y = 0;
    }
    aplicarFriccion(){
        this.vel.x *= this.friccion;
        this.vel.y *= this.friccion;
    }
    render(){
        this.container.x = this.position.x;
        this.container.y = this.position.y;
    }
    destroy(){
        this.container.destroy();
    }

    /*async MostrarCollider(){
        const collider = new PIXI.Graphics()
        .circle(0, 0, this.radio)
        .stroke({
            width: 1,
            color: 0x00ff00
        });
        collider.zIndex = 12;
        collider.name = "collider";
        this.container.addChild(collider);
    }*/
}