class NpcManager {
    constructor(juego) {
        this.juego = juego;
        this.todasLasEntidades = new Map();
    }

    update() {
        for (let grupoEntidades of this.todasLasEntidades) {
            this.actualizarGrupoDeEntidades(grupoEntidades[1]);
        }
    }

    actualizarGrupoDeEntidades(grupo) {
        for (let entidad of grupo) {
            entidad.update();
            entidad.render();
        }
    }

    obtenerGrupoDeEntidades(nombreGrupo){
        if(!this.todasLasEntidades.has(nombreGrupo)){return []}
        return this.todasLasEntidades.get(nombreGrupo);
    }

    obtenerTodasLasEntidades(){
        let npcs = [];
        for (let grupo of this.todasLasEntidades) {
            npcs = npcs.concat(this.todasLasEntidades.get(grupo[0]));
        }
        return npcs;
    }

    sacarNpcs(clase) {
        let grupoEntidades = this.obtenerGrupoDeEntidades(clase);
        for (let i = 0; i < grupoEntidades.length; i++) {
            grupoEntidades[i].destroy();
            i--;
        }
        this.todasLasEntidades.delete(clase);
    }

    ponerNpcsEnTodoElMapa(clase, cantidad) {
        this.ponerNpcsEnZona(clase, cantidad, this.juego.fondo.position.x, this.juego.fondo.position.y, this.juego.fondo.width, this.juego.fondo.height);
    }

    ponerNpcsEnZona(clase, cantidad, x, y, ancho, largo) {
        for (let i = 0; i < cantidad; i++) {
            let posX = x + Math.random() * ancho;
            let posY = y + Math.random() * largo
            this.ponerNpc(clase,posX,posY)
        }
    }
    ponerNpc(clase,x,y){
        const npcActual = new clase(x,y,this.juego)
        if (this.todasLasEntidades.has(clase.name)) {
            this.todasLasEntidades.get(clase.name).push(npcActual);
        }
        else {
            this.todasLasEntidades.set(clase.name, [npcActual])
        }
    }
    sacarNpc(npc){
        //el npc debe estar
        const clase = npc.constructor.name
        const index = this.todasLasEntidades.get(clase).indexOf(npc);
        this.todasLasEntidades.get(clase).splice(index, 1);
    }
    hayNpcs() {
        return this.todasLasEntidades.length > 0;
    }
    eliminarEntidad(entidad) {
        const clase = entidad.constructor.name
        if(!this.todasLasEntidades.has(clase)) return;
        const index = this.todasLasEntidades.get(clase).indexOf(entidad);
        this.todasLasEntidades.get(clase).splice(index, 1);
    }
}