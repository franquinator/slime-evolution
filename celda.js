class Celda {
  constructor(juego, anchoCelda, x, y) {
    this.juego = juego;
    this.anchoCelda = anchoCelda;
    this.entidadesAca = [];
    this.id = x + "_" + y;
    this.x = x;
    this.y = y;
  }

  agregame(quien) {
    if (!quien) return;
    this.entidadesAca.push(quien);
    quien.celda = this;
  }

  sacame(quien) {
    if (!quien) return;
    for (let i = 0; i < this.entidadesAca.length; i++) {
      const entidad = this.entidadesAca[i];
      if (quien.id == entidad.id) {
        this.entidadesAca.splice(i, 1);
        return;
      }
    }
  }
  obtenerEntidades() {
    return this.entidadesAca;
  }
}
