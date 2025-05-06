class SlimeMalo extends Entidad {
  constructor(x, y, radio, juego) {
    super(x, y, radio, juego);

    this.velocidadMax = 0.3;
    this.radioDePersecucion = 300;

    this.puntoDeDestino = {
      x: Math.random() * this.juego.fondo.width,
      y: Math.random() * this.juego.fondo.height,
    };

    this.cargarSprite("Assets/Graficos/bacteria1.png",40);
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
