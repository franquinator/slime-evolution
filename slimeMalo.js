class SlimeMalo extends Slime {
  constructor(x, y, radio, juego) {
    super(x, y, radio, juego);

    this.velocidadMax = 0.7;
    this.radioDePersecucion = 300;

    this.puntoDeDestino = {
      x: Math.random() * this.juego.fondo.width,
      y: Math.random() * this.juego.fondo.height,
    };

    this.sprite = new PIXI.Graphics()
      .circle(0, 0, this.radio)
      .fill({ color: 0x0000ff }); // azul

    this.sprite.zIndex = 10;
    this.juego.worldContainer.addChild(this.sprite);
  }

  update() {
    if (this.slimeMuyCerca()) {
      this.perseguirSlimeProta();
    } else {
      this.deambular();
    }

    super.update();
  }

  slimeMuyCerca() {
    if (!this.juego.slime) return false;
    return (
      distancia(this.position, this.juego.slime.position) < this.radioDePersecucion
    );
  }

  perseguirSlimeProta() {
    const objetivo = this.juego.slime.position;
    const dir = getUnitVector(objetivo, this.position);
    this.asignarAceleracionNormalizada(
      dir.x * this.MultiplicadorDeAceleracion,
      dir.y * this.MultiplicadorDeAceleracion
    );
  }

  deambular() {
    if (distancia(this.puntoDeDestino, this.position) < 10) {
      this.puntoDeDestino = {
        x: Math.random() * this.juego.fondo.width,
        y: Math.random() * this.juego.fondo.height,
      };
    }
    const direccion = getUnitVector(this.puntoDeDestino, this.position);
    this.asignarAceleracionNormalizada(
      direccion.x * this.MultiplicadorDeAceleracion,
      direccion.y * this.MultiplicadorDeAceleracion
    );
  }
}
