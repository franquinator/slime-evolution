class Celda {
  constructor(juego, anchoCelda, x, y) {
    this.juego = juego;
    this.anchoCelda = anchoCelda;
    this.todasLasEntidades = new Map();
    this.id = x + "_" + y;
    this.x = x;
    this.y = y;
  }

  obtenerTodasLasEntidades() {
    //obtiene todos los npcs de la celda
    let npcs = [];
    for (let grupo of this.todasLasEntidades) {
      npcs = npcs.concat(this.todasLasEntidades.get(grupo[0]));
    }
    return npcs;
  }

  obtenerGrupoDeEntidades(nombreGrupo) {
    let npcs = [];
    if (this.todasLasEntidades.has(nombreGrupo)) {
      npcs = this.todasLasEntidades.get(nombreGrupo);
    }
    return npcs;
  }

  sacarGrupo(grupo){
    this.todasLasEntidades.delete(grupo);
  }

  sacarNpc(npc) {
    if (!npc) return;

    const grupo = npc.constructor.name
    this.sacarNpcDeGrupo(grupo, npc);
  }

  sacarNpcDeGrupo(grupo, npc) {
    const index = this.todasLasEntidades.get(grupo).indexOf(npc);
    this.todasLasEntidades.get(grupo).splice(index, 1);
  }

  agregarNpc(npc) {
    if (!npc) return;

    const grupo = npc.constructor.name;
    this.agregarNpcAGrupo(grupo, npc);
    npc.celda = this;
  }

  agregarNpcAGrupo(grupo, npc) {
    if (this.todasLasEntidades.has(grupo)) {
      this.todasLasEntidades.get(grupo).push(npc);
    }
    else {
      this.todasLasEntidades.set(grupo, [npc])
    }
  }


}
