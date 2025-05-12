class Entidad{
    constructor(posX,posY,radio,juego){
        this.position = {x:posX, y:posY};

        this.radio = radio; 
        this.juego = juego;

        this.vel = {x:0, y:0};
        this.aceleracion = {x:0, y:0};

        this.velocidadMax = 1;
        this.MultiplicadorDeAceleracion = 0.1;
        this.friccion = 0.90;

        this.sprite = new PIXI.Container();

    }
    async MostrarCollider(){
        const collider = new PIXI.Graphics()
        .circle(0, 0, this.radio)
        .stroke({
            width: 1,
            color: 0x00ff00
        });
        collider.zIndex = 12; // Dibuja el círculo correctamente
        collider.zIndex = 12;
        this.sprite.addChild(collider);
    }
    async cargarSprite(ruta,subspriteOffset){
        this.sprite = new PIXI.Container();
        let textura = await PIXI.Assets.load(ruta);

        const subsprite = new PIXI.Sprite(textura);
        subsprite.setSize(this.radio * 2 + subspriteOffset);
        subsprite.anchor.set(0.5,0.5);
        this.sprite.addChild(subsprite);
        this.sprite.zIndex = 11;

        this.juego.worldContainer.addChild(this.sprite);
         
    }
    update(){
        this.aplicarAceleracion();
        this.aplicarFriccion();
        this.aplicarVelocidad();
    }
    
    asignarVelocidad(x,y){
        this.vel.x = x;
        this.vel.y = y;
    }

    asignarAceleracion(x,y){
        this.aceleracion.x = x;
        this.aceleracion.y = y;
    }

    asignarAceleracionNormalizada(x,y){
        const aceleracionNormalizada = normalizar(x,y);
        this.aceleracion.x = x;
        this.aceleracion.y = y;
    }

    asignarVelocidadNormalizada(x,y){
        const velocidadNormalizada = normalizar(x,y);
        //console.log(direcciónNormalizada);
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
        const tamañoJuego = this.juego.fondo;
    
        this.position.x = clamp(this.position.x + this.vel.x * delta, 0, tamañoJuego.width);
        this.position.y = clamp(this.position.y + this.vel.y * delta, 0, tamañoJuego.height);
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
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    }
    destroy(){
        this.sprite.destroy();
    }
}