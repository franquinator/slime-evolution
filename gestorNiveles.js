class GestorNiveles{
    constructor(juego) {
        this.juego = juego;
        this.nivelActual = -1;
        this.cantEnemigos = this.dificultad === 'facil' ? 10 : this.dificultad === 'normal' ? 20 : 30;
        
        this.niveles = []
        this.radioActual = null;

        this.niveles.push(new Nivel([Larva,Virus],[this.cantEnemigos,2000],["Ameba"],5,1000,this.juego));
        this.niveles.push(new Nivel([Pez,Larva],[this.cantEnemigos,2000],["Virus"],5,3000,this.juego));
        this.niveles.push(new Nivel([Pez,Tiburon],[1000,1],["Larva"],5,20000,this.juego));
    }
    radioNivelActual(){
        const radio = this.radioActual / this.juego.escalaDeJuego;
        //console.log("Radio nivel actual calculado:", radio, "Radio actual:", this.radioActual, "Escala:", this.juego.escalaDeJuego);
        return radio;
    }
    subirNivel(){
        if(this.nivelActual >= this.niveles.length-1){
            return;
        }
        this.nivelActual++;
        console.log("Nivel actual:", this.nivelActual, "Total niveles:", this.niveles.length);
        
        this.cargarNivel(this.nivelActual);
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
        this.juego.npcManager.ponerNpcsEnTodoElMapa(Ameba,2000)
    }
}