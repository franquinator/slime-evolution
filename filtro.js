class Filtro{
    constructor(juego) {
        this.juego = juego;
        this.velocidad = 5;
    }
    async inicializar(){
        // Cargar la textura de desplazamiento
        const displacementTexture = await PIXI.Assets.load('https://i.imgur.com/hVKo63B.jpg');
        // Crear el sprite de desplazamiento con esa textura
        this.displacementSprite = PIXI.Sprite.from(displacementTexture);
        // la ponemos en modo repeat para que se repita
        this.displacementSprite.texture.source.addressMode = PIXI.DEPRECATED_WRAP_MODES.REPEAT;
        //la agregamos al stage para que exista
        this.juego.app.stage.addChild(this.displacementSprite);

        // Creamos el filtro de desplazamiento con el sprite y las cordenadas en x e y del tamaño del desplazamiento
        this.DisplacementFilter = new PIXI.DisplacementFilter(this.displacementSprite, 50, 50);

        //lo agregamos al contenedor del mundo para que se vea
        this.juego.worldContainer.filters = [this.DisplacementFilter];
        
    }
    update(){
        // movemos la texura si existe para que se vea el oleaje

        if (!this.displacementSprite) return;
        this.displacementSprite.x+= this.velocidad;
    }
}