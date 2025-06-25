class GestorNiveles{
    constructor(juego) {
        this.juego = juego;
        this.nivelActual = 1;
        this.radioNivel = [100,1300,2400];
    }
    radioNivelActual(){
        return 200;
    }
    subirNivel(){
        if(this.nivelActual > 1) return;
        //hachica todo 5 veces
        //divide las distancias en 5

        //hacer que los virus midan 20
        let entidades = this.juego.npcManager.obtenerTodasLasEntidades();
        for(let entidad of entidades){
            entidad.dividir(2);
        }
        this.juego.slime.dividir(2);

        this.juego.npcManager.sacarNpcs("Ameba");

        this.juego.camara.hacerZoom(1.5);

        this.juego.escalaDeJuego = 2;

        this.juego.fondo.sprite.tileScale = 0.5;

        this.juego.npcManager.ponerNpcsEnTodoElMapa(Virus, 2000);
        this.juego.npcManager.ponerNpcsEnTodoElMapa(Larva, 10);
        //y el protagonista tambien
        //la camara hace cosas raras
        this.nivelActual++;

    }
    cargarNivel0(){
        this.juego.npcManager.ponerNpcsEnTodoElMapa(Ameba, 4000);
        this.juego.npcManager.ponerNpcsEnTodoElMapa(Virus, 10);
    } 
    cargarNivel1(){

    } 
    /*  cargarNivel2() {
    console.log("cargando nivel 2");
    const cantidadLarvas = this.dificultad === 'facil' ? 15 : this.dificultad === 'normal' ? 20 : 25;
    const cantidadVirus = this.dificultad === 'facil' ? 800 : this.dificultad === 'normal' ? 1000 : 1200;
    
    this.npcManager.agregarNpcsEnZonaNoVisible(Larva, cantidadLarvas);
    this.npcManager.agregarNpcsEnZonaNoVisible(Virus, cantidadVirus);
    this.ampliarMapa();
    this.npcManager.sacarNpcs(Ameba);
  }

  cargarNivel3() {
    console.log("Cargando nivel 3");
    const cantidadPeces = this.dificultad === 'facil' ? 7 : this.dificultad === 'normal' ? 10 : 15;
    const cantidadLarvas = this.dificultad === 'facil' ? 400 : this.dificultad === 'normal' ? 500 : 600;
    
    this.npcManager.agregarNpcsEnZonaNoVisible(Pez, cantidadPeces);
    this.npcManager.agregarNpcsEnZonaNoVisible(Larva, cantidadLarvas);
    this.ampliarMapa();
    this.npcManager.sacarNpcs(Virus);
  }

  ampliarMapa() {
    this.fondo.ampliar(3);
  }*/
}