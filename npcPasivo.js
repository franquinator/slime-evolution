class NpcPasivo extends Npc {
    constructor(posX, posY, radio, velocidadMax, juego, Enemigo) {
        super(posX, posY, radio, velocidadMax, juego);
        //this.vel = { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 };

        this.npcsA100Mts = [];
        this.Enemigo = Enemigo;

        this.alineacion = {
            npcs : [],
            mult : 0.1,
            alcance : this.radio + 100
        }

        this.cohesion2 = {
            npcs : [],
            mult : 0,
            alcance : this.radio + 100
        }

        this.separacion = {
            npcs : [],
            mult : 0.01,
            alcance : this.radio + 100
        }

        this.separacionDeMalos = {
            npcs : [],
            mult : 0.1,
            alcance : 400
        }

        this.multDeEscape = 2;
        this.alcanceDeEscape = 400;

        this.multDePerseguir = 0.5;
        this.alcanceDePersecucion = 600;
        
    }
    aplicarComportamiento() {
        //se puede ver a esto como motivaciones
        //motivacion para alinearse juntarse y separarse
        this.aplicarAlineacion(this.alineacion.npcs, this.alineacion.mult);
        this.aplicarCohesion(this.cohesion2.npcs, this.cohesion2.mult);
        this.aplicarSeparacion(this.separacion.npcs, this.separacion.mult);
        this.aplicarSeparacion(this.separacionDeMalos.npcs, this.separacionDeMalos.mult);
        if (this.radio > this.juego.slime.radio) {
            this.aplicarPersecucion(this.juego.slime, this.multDePerseguir, this.alcanceDePersecucion)
        }
        else {
            this.aplicarEscape(this.juego.slime, this.multDeEscape, this.alcanceDeEscape)
        }
    }



    recopilarDatos() {
        let distBusqueda;
        distBusqueda = Math.max(this.alineacion.alcance,
                                this.cohesion2.alcance,
                                this.separacion.alcance);
        let NpcsCercanos = this.juego.grilla.obtenerNpsADistancia(distBusqueda, this)
        this.cohesion2.npcs = [];
        this.separacion.npcs = [];
        this.alineacion.npcs = [];

        for (let npc of NpcsCercanos) {
            if (npc == this) continue;
            let d = distancia(this.position, npc.position);
            if (d < this.alineacion.alcance) {
                this.alineacion.npcs.push({ Npc: npc, Dist: d });
            }
            if (d < this.cohesion2.alcance) {
                this.cohesion2.npcs.push({ Npc: npc, Dist: d });
            }
            if (d < this.separacion.alcance) {
                this.separacion.npcs.push({ Npc: npc, Dist: d });
            }
        }

        this.npcsMalosParaMiA50mts = [];
        for (let npc of this.juego.npcManager.obtenerGrupoDeEntidades(this.Enemigo)) {
            let d = distancia(this.position, npc.position);
            if (npc != this && d < 400) {
                this.npcsMalosParaMiA50mts.push({ Npc: npc, Dist: d });
            }
        }
    }

    update() {
        this.actualizarPosicionEnGrilla();
        this.recopilarDatos();
        this.aplicarComportamiento();
        super.update();
    }


    dividir(veces) {
        super.dividir(veces);
    }
}