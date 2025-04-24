class SlimeMalo {
    constructor(x, y, radio, juego) {
      this.position = { x, y };
      this.radio = radio;
      this.juego = juego;
  
      this.sprite = new PIXI.Graphics()
        .circle(0, 0, this.radio)
        .fill({ color: 0x0000ff }); // AZUL

      this.sprite.zIndex = 10
  
      this.juego.worldContainer.addChild(this.sprite);   
    }
  
    update() {
      super.update();
    }
}