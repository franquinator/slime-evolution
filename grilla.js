class Grilla {
    constructor(juego, anchoCelda) {
        this.juego = juego;
        this.anchoCelda = anchoCelda;
        this.celdaALoAncho = Math.ceil(this.juego.tamanioBase / this.anchoCelda);
        this.celdaALoAlto = Math.ceil(this.juego.tamanioBase / this.anchoCelda);

        this.celdas = {};

        this.initGrilla();
    }

    initGrilla() {
        for (let x = 0; x < this.celdaALoAncho; x++) {
            for (let y = 0; y < this.celdaALoAlto; y++) {
                const celda = new Celda(this.juego, this.anchoCelda, x, y);
                const hash = this.obtenerHashDePosicion(x, y);
                this.celdas[hash] = celda;
            }
        }
    }

    añadirNpcEnGrilla(npc) {
        const celda = this.obtenerCeldaEnPosicion(npc.position.x, npc.position.y);
        celda.agregarNpc(npc);
    }

    actualizarNpcEnGrilla(npc) {
        const celda = this.obtenerCeldaEnPosicion(npc.position.x, npc.position.y);
        if (npc.celda != celda) {
            npc.celda.sacarNpc(npc);
            celda.agregarNpc(npc);
        }
    }

    obtenerHashDePosicion(x, y) {
        return "x_" + x + "_y_" + y;
    }

    obtenerCeldaEnPosicion(x, y) {
        const nuevaX = Math.floor(x / this.anchoCelda);
        const nuevaY = Math.floor(y / this.anchoCelda);
        const hash = this.obtenerHashDePosicion(nuevaX, nuevaY);

        let celda = this.celdas[hash];

        if (!celda)console.error("la celda no existe en la posicion X:" + nuevaX + " Y:" + nuevaY);

        return celda;
    }

    obtenerCeldasADistancia(distancia, x, y) {
        let celdas = [];
        let distXMin = this.calcularPosMinFormatoCelda(x - distancia);
        let distYMin = this.calcularPosMinFormatoCelda(y - distancia);

        let distXMax = this.calcularPosMaxFormatoCelda(x + distancia);
        let distYMax = this.calcularPosMaxFormatoCelda(y + distancia);
        for (let x = distXMin; x < distXMax; x++) {
            for (let y = distYMin; y < distYMax; y++) {
                celdas.push(this.celdas["x_" + x + "_y_" + y]);
            }
        }
        return celdas;
    }

    calcularPosMinFormatoCelda(num) {
        let dist = num;
        dist = Math.floor(dist / this.anchoCelda);
        dist = Math.max(0, dist);
        return (dist);
    }

    calcularPosMaxFormatoCelda(num) {
        let dist = num;
        dist = Math.ceil(dist / this.anchoCelda);
        dist = Math.min(this.celdaALoAncho, dist);
        return (dist);
    }

    obtenerTodosLosNpsADistancia(distancia, npcIn) {
        let celdasCercanas = this.obtenerCeldasADistancia(distancia, npcIn.position.x, npcIn.position.y);

        let npcs = [];
        for (let celda of celdasCercanas) {
            let npcsEnCelda = celda.obtenerTodasLasEntidades();
            npcs = npcs.concat(npcsEnCelda)
        }
        return npcs;
    }
    
    obtenerNpcsDeGrupoADistancia(distancia, npcIn, grupo){
        let celdasCercanas = this.obtenerCeldasADistancia(distancia, npcIn.position.x, npcIn.position.y);

        let npcs = [];
        for (let celda of celdasCercanas) {
            let npcsEnCelda = celda.obtenerGrupoDeEntidades(grupo);
            npcs = npcs.concat(npcsEnCelda);
        }
        return npcs;
    }
    
    obtenerTodasLasEntidades() {
        let npcs = [];
        for (let celda of Object.values(this.celdas)) {
            npcs = npcs.concat(celda.entidadesAca);
        }
        return npcs;    
    }

    obtenerColisionesCon(entidad) {
        let npcs = [];
        let celdasCercanas = this.obtenerCeldasADistancia(entidad.radio * 2, entidad.position.x, entidad.position.y);
        for (let celda of celdasCercanas) {

            let npcsEnCelda = celda.obtenerTodasLasEntidades();
            for (let npc of npcsEnCelda) {
                if(npc != entidad && colisionan(entidad,npc)){
                    npcs.push(npc);
                }
            }
        }
        return npcs;
    }
}  