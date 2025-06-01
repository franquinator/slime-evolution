class Fondo {
    constructor(juego,tamanio){
        this.juego = juego;
        this.width = tamanio;
        this.height = tamanio;
        this.position = {x: 0, y: 0};
    }
    async inicializar() {
        // Cargar la textura
        let textura = await PIXI.Assets.load("Assets/Graficos/bg.jpg");
    
        // Crear el TilingSprite con la textura y dimensiones
        this.sprite = new PIXI.TilingSprite(textura, this.width, this.height);
    
        // Añadir al escenario
        this.juego.worldContainer.addChild(this.sprite);
    }
    ampliar(tamanio){
        this.width *= tamanio;
        this.height *= tamanio;
        this.sprite.width *= tamanio;
        this.sprite.height *= tamanio;
    }
    mover(x,y){
        this.position.x = x;
        this.position.y = y;
        this.sprite.x = x;
        this.sprite.y = y;
    }
}