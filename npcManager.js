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

    sacarNpcs(clase) {
        console.log("npc sacados");
        for (let i = 0; i < this.todasLasEntidades.length; i++) {
            if (this.todasLasEntidades[i] instanceof clase) {
                this.eliminarEntidadEn(i);
                i--;
            }
        }
        console.log(this.todasLasEntidades);
    }

    ponerNpcsEnTodoElMapa(clase, cantidad) {
        this.ponerNpcsEnZona(clase, cantidad, this.juego.fondo.position.x, this.juego.fondo.position.y, this.juego.fondo.width, this.juego.fondo.height);
    }

    ponerNpcsEnZona(clase, cantidad, x, y, ancho, largo) {
        for (let i = 0; i < cantidad; i++) {
            const npcActual = new clase(x + Math.random() * ancho, y + Math.random() * largo, this.juego);
            if (this.todasLasEntidades.has(clase.name)) {
                this.todasLasEntidades.get(clase.name).push(npcActual);
            }
            else {
                this.todasLasEntidades.set(clase.name, [npcActual])
            }

        }
    }
    ponerNpcsAlrededorDeCuadrado(clase, cantidad, x, y, ancho, largo) {
        let cantidadDividida = cantidad / 4;
        /*
         _____ _____ _____
        |     |   s der   |
        |s izq|_____ _____|
        |     |     |     |
        |_____|_____|i der|
        |   i izq   |     |
        |_____ _____|_____|
        */
        //rectangulo superior izquierdo
        this.ponerNpcsEnZona(clase, cantidadDividida, x - ancho, y - largo, ancho, largo * 2);
        //rectangulo superior derecho
        this.ponerNpcsEnZona(clase, cantidadDividida, x, y - largo, ancho * 2, largo);
        //rectangulo inferior izquierdo
        this.ponerNpcsEnZona(clase, cantidadDividida, x - ancho, y + largo, ancho * 2, largo);
        //rectangulo inferior derecho
        this.ponerNpcsEnZona(clase, cantidadDividida, x + ancho, y, ancho, largo * 2);
    }
    agregarNpcsEnZonaNoVisible(clase, cantidad) {
        this.ponerNpcsAlrededorDeCuadrado(clase, cantidad, this.juego.fondo.position.x, this.juego.fondo.position.y, this.juego.fondo.width, this.juego.fondo.height);
    }
    obtenerEntidadesCercanasSinOptimizar(entidad, radio) {
        let entidadesCercanas = [];
        for (let i = 0; i < this.todasLasEntidades.length; i++) {
            const entidadActual = this.todasLasEntidades[i];
            if (entidadActual !== entidad && distancia(entidadActual.position, entidad.position) < radio + entidadActual.radio) {
                entidadesCercanas.push(entidadActual);
            }
        }
        return entidadesCercanas;
    }
    obtenerEntidadesCercaDe(posicion, radio) {
        let entidadesCercanas = [];
        for (let i = 0; i < this.todasLasEntidades.length; i++) {
            const entidadActual = this.todasLasEntidades[i];
            if (distancia(entidadActual.position, posicion) < radio + entidadActual.radio) {
                entidadesCercanas.push(entidadActual);
            }
        }
        return entidadesCercanas;
    }
    obtenerEntidadesCercanasQuadtree(entidad, radio) {
        return this.quadtree.entidadesCercanas(entidad, radio);
    }
    obtenerEntidadesCercanasSpatialHash(entidad, radio) {
        return this.spatialHash.entidadesCercanas(entidad, radio);
    }
    actualizarQuadtree() {
        this.quadtree.limpiar();
        for (let entidad of this.todasLasEntidades) {
            this.quadtree.insertar(entidad);
        }
    }
    actualizarSpatialHash() {
        this.spatialHash.limpiar();
        for (const entidad of this.todasLasEntidades) {
            this.spatialHash.actualizarPosicion(entidad);
        }
    }
    hayNpcs() {
        return this.todasLasEntidades.length > 0;
    }
    eliminarEntidad(entidad) {
        const clase = entidad.constructor.name
        const index = this.todasLasEntidades.get(clase).indexOf(entidad);
        this.todasLasEntidades.get(clase).splice(index, 1);
        this.juego.app.stage.removeChild(entidad);
        entidad.destroy();
    }
    eliminarEntidadEn(index) {
        let entidad = this.todasLasEntidades[index];

        this.todasLasEntidades.splice(index, 1);

        this.juego.app.stage.removeChild(entidad);
        entidad.destroy();
    }
    getPositions() {
        let posiciones = [];
        for (let entidad of this.todasLasEntidades) {
            posiciones.push(entidad.position)
        }
        return posiciones;
    }
}