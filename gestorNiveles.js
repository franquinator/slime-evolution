class GestorNiveles{
    constructor(juego) {
        this.juego = juego;
        this.nivelActual = -1;
        let cantEnemigos = this.dificultad === 'facil' ? 10 : this.dificultad === 'normal' ? 20 : 30;
        this.cantEnemigos = cantEnemigos;
        this.niveles = []
        this.radioActual = -1;

        this.niveles.push(new Nivel([Larva,Virus],[cantEnemigos,4000],["Ameba"],5,1000,this.juego));
        this.niveles.push(new Nivel([Pez,Larva],[cantEnemigos,4000],["Virus"],5,3000,this.juego));
        this.niveles.push(new Nivel([Pez],[100],["Larva"],1,10000,this.juego));
    }
    radioNivelActual(){
        return this.radioActual / this.juego.escalaDeJuego;

    }
    subirNivel(){
        this.nivelActual++;
        if(this.nivelActual < this.niveles.length){
            this.cargarNivel(this.nivelActual);
        }
        else{
            this.juego.finalizarJuego(true);
        }
        console.log("nivel subido")
        
    }
    cargarNivel(numNivel){
        console.log("nivel cargado");
        this.niveles[numNivel].jugar();
        this.radioActual = this.niveles[numNivel].tamañoParaProxNivel;
    }
    iniciar(){
        this.radioActual = 200;
        this.juego.npcManager.ponerNpcsEnTodoElMapa(Virus,this.cantEnemigos)
        this.juego.npcManager.ponerNpcsEnTodoElMapa(Ameba,4000)
    }
}