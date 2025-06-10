class Juego {
  constructor() {
    //variables base
    this.app = new PIXI.Application();
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    this.tamanioBase = 3000;
    
    //variables de camara
    this.centro = {
      x: this.ancho / 2,
      y: this.alto / 2
    }
    this.mouse = { x: 0, y: 0 };

    //variables de cambio de nivel
    this.finalizado = false;
    this.nivelActual = 1;
    this.radioNivel = [150,1300,2400];
    this.radioNivelActual = this.radioNivel[this.nivelActual-1];

    //variables de juego
    this.slime = null;
    this.vidas = 3;
    this.puntos = 0;
    this.worldContainer = new PIXI.Container({
      // this will make moving this container GPU powered
      isRenderGroup: true,
    });
    
    //variables de fps
    this.ultimoFrame = performance.now();
    this.delta = 0;

    //variables de componentes

    this.grilla = new Grilla(this,200);
    this.hud = new Hud(this);
    this.npcManager = new NpcManager(this);
    this.eventos = new Eventos(this);
    this.camara = new Camara(this);
    this.fondo = new Fondo(this,this.tamanioBase);

    this.recursos = new Map();

    this.app.init({ width: this.ancho, height: this.alto }).then(() => {
      this.pixiListo();
    });
  }

  async pixiListo() {
    //agrega elementos generales
    this.camara.inicializar();
    await this.hud.inicializar();
    console.log("hud listo")
    await this.fondo.inicializar();
    console.log("fondo listo")

    await this.precargarRecursos();

    this.slime = new SlimeProta(1500, 1500, 20, this);
    await this.slime.inicializar();
    console.log("slime listo")
    this.cargarNivel1();
    console.log("nivel 1 listo")

    //agrega elementos de PIXI
    window.__PIXI_APP__ = this.app;
    document.body.appendChild(this.app.canvas);
    console.log("pixi listo")



    //comienza el gameloop
    this.app.ticker.add(() => this.gameLoop());
    console.log("gameloop listo")
  }
  async precargarRecursos(){
    this.recursos.set("Assets/texture.json",await PIXI.Assets.load("Assets/texture.json"));
    this.recursos.set("Assets/Graficos/bg.jpg",await PIXI.Assets.load("Assets/Graficos/bg.jpg"));
    this.recursos.set("Assets/Graficos/corazon1.png",await PIXI.Assets.load("Assets/Graficos/corazon1.png"));
    this.recursos.set("Assets/Graficos/pqz.png",await PIXI.Assets.load("Assets/Graficos/pqz.png"));
    this.recursos.set("Assets/Graficos/cat.png",await PIXI.Assets.load("Assets/Graficos/cat.png"));
    this.recursos.set("Assets/Graficos/bacteria1.png",await PIXI.Assets.load("Assets/Graficos/bacteria1.png"));
    this.recursos.set("Assets/Graficos/amoeba1.png",await PIXI.Assets.load("Assets/Graficos/amoeba1.png"));
    this.recursos.set("Assets/Graficos/amoeba2.png",await PIXI.Assets.load("Assets/Graficos/amoeba2.png"));
    this.recursos.set("Assets/Graficos/larva.pngq",await PIXI.Assets.load("Assets/Graficos/larva.png"));
  }
  //funciones de gameloop
  gameLoop() {
    this.actualizarDeltaTime();
    this.camara.actualizar();
    this.actualizarContadorFps();
    this.actualizarProtagonista();
    this.npcManager.update();
  }

  actualizarDeltaTime() {
    this.delta = performance.now() - this.ultimoFrame;
    this.ultimoFrame = performance.now();
  }

  actualizarContadorFps() {
    this.hud.actualizarFPS(Math.round(this.app._ticker.FPS));
  }

  actualizarProtagonista() {
    this.slime.update();
    this.slime.render();
  }

  agregarPuntos(puntos){
    this.puntos += puntos;
    this.hud.actualizarPuntos(this.puntos);
  }

  perderVida() {
/*     this.vidas--;
    this.hud.actualizarVidas(this.vidas);
    if (this.vidas <= 0) {
      alert("¡Perdiste! (Presiona 'R' para reiniciar)");
      this.finalizado = true;
      this.app.stop();
    } */
  }
  subirNivel(){
    this.nivelActual++;
    console.log("subiendo nivel"+this.nivelActual);
    if(this.nivelActual == 2){
      this.cargarNivel2();
    }
    else if(this.nivelActual == 3){
      this.cargarNivel3();
    }
    else if(this.nivelActual >= 4){
      alert("¡Ganaste! (Presiona 'R' para reiniciar)");
      this.finalizado = true;
      this.app.stop();
    }
    this.radioNivelActual = this.radioNivel[this.nivelActual-1];

  }

  //funciones para cambiar de nivel
  cargarNivel1() {
    console.log("cargando nivel 1");
    //this.npcManager.ponerNpcsEnTodoElMapa(Virus, 1000);
    this.npcManager.ponerNpcsEnTodoElMapa(Ameba, 1000);
  }
  cargarNivel2() {
    console.log("cargando nivel 2");
    this.npcManager.agregarNpcsEnZonaNoVisible(Larva, 20);
    this.npcManager.agregarNpcsEnZonaNoVisible(Virus, 1000);
    this.ampliarMapa();
    this.npcManager.sacarNpcs(Ameba);
  }
  cargarNivel3() {
    console.log("cargando nivel 3");
    this.npcManager.agregarNpcsEnZonaNoVisible(Pez, 2);
    this.npcManager.agregarNpcsEnZonaNoVisible(Larva, 500);
    this.ampliarMapa();
    this.npcManager.sacarNpcs(Virus);
  }
  ampliarMapa() {
    this.fondo.ampliar(3);
  }
}

window.reiniciarJuego = function () {
  location.reload(); // recarga la página para reiniciar todo
};