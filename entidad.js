class Entidad {
    constructor(posX, posY, radio, velocidadMax, juego) {
        verificarValor(posX, "posX");
        verificarValor(posY, "posY");
        verificarValor(radio, "radio");
        verificarValor(juego, "juego");

        this.position = { x: posX, y: posY };

        this.radio = radio / juego.escalaDeJuego;

        this.velocidadMax = velocidadMax;
        
        this.juego = juego;

        this.scaleOffset = 0;

        this.vel = { x: 0, y: 0 };
        this.aceleracion = { x: 0, y: 0 };

        this.container = new PIXI.Container();
        this.fuiEliminado = false;
    }

    async MostrarCollider() {
        this.collider = new PIXI.Graphics()
            .circle(0, 0, this.radio)
            .stroke({
                width: 1,
                color: 0x00ff00
            });
        this.collider.zIndex = 12;
        this.collider.name = "collider";
        this.container.addChild(this.collider);
    }

    async cargarSprite(ruta, escalaExtra) {
        this.scaleOffset = escalaExtra;
        let textura = await PIXI.Assets.load(ruta);
        textura.scaleMode = 'nearest';

        this.sprite = new PIXI.Sprite(textura);
        this.sprite.scaleMode = 'nearest';
        this.sprite.setSize(this.radio * 2 * escalaExtra);
        this.sprite.anchor.set(0.5, 0.5);

        this.container.addChild(this.sprite);
        this.container.zIndex = 11;

        this.juego.worldContainer.addChild(this.container);
    }

    cargarSprite2(nombre, escalaExtra) {
        this.scaleOffset = escalaExtra;
        let textura = this.juego.recursos.get(nombre);
        textura.scaleMode = 'nearest';

        this.sprite = new PIXI.Sprite(textura);
        this.sprite.scaleMode = 'nearest';
        this.sprite.setSize(this.radio * 2 * escalaExtra);
        this.sprite.anchor.set(0.5, 0.5);

        this.container.addChild(this.sprite);
        this.container.zIndex = 11;

        this.juego.worldContainer.addChild(this.container);
    }

    dividir(veces){
        this.position.x /= veces;
        this.position.y /= veces;

        this.radio /= veces;
        this.sprite.setSize(this.radio * 2 * this.scaleOffset);
    }

    reescalar(nuevoRadio){
        this.radio = nuevoRadio;
        this.sprite.setSize(this.radio * 2 * this.scaleOffset);
    }

    update() {
        this.aplicarFisicas();
        this.mantenerEnBordes();
    }

    aplicarFisicas(){
        //aplica aceleracion
        this.vel = vectorSuma(this.vel, this.aceleracion);

        this.vel = limit(this.vel, this.velocidadMax);



        //aplica velocidad
        this.position = vectorSuma(this.position, this.vel);

        this.aceleracion = { x: 0, y: 0 };
    }

    mantenerEnBordes() {
        if (this.position.x < 0) this.position.x = this.juego.fondo.width - 1;
        if (this.position.x > this.juego.fondo.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = this.juego.fondo.height - 1;
        if (this.position.y > this.juego.fondo.height) this.position.y = 0;
    }

    asignarAceleracion(x, y) {
        if (isNaN(x) || isNaN(y)) {
            throw new Error("Aceleración NaN detectada");
        }
        this.aceleracion.x = x;
        this.aceleracion.y = y;
    }

    render() {
        this.container.x = this.position.x;
        this.container.y = this.position.y;
    }
    
    destroy() {
        //
        this.fuiEliminado = true;
        this.juego.npcManager.eliminarEntidad(this);
        this.container.destroy();
        // this.juego.app.stage.removeChild(this); // Comentado: esto causaba errores
    }
}