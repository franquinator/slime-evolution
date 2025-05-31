class Fondo {
    constructor(juego,tamanio){
        this.juego = juego;
        this.tamanio = {width: tamanio, height: tamanio};
        this.position = {x: 0, y: 0};
    }
    async inicializar() {
        // Cargar la textura
        let textura = await PIXI.Assets.load("Assets/Graficos/bg.jpg");
    
        // Crear el TilingSprite con la textura y dimensiones
        this.fondo = new PIXI.TilingSprite(textura, 3000, 3000);
    
        // Añadir al escenario
        this.juego.worldContainer.addChild(this.fondo);
    }
}