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
    this.nivelActual = 0;

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
    this.hud = new Hud(this.app);;
    this.npcManager = new NpcManager(this);
    this.eventos = new Eventos(this);
    this.camara = new Camara(this);
    this.fondo = new Fondo(this,this.tamanioBase);

    this.app.init({ width: this.ancho, height: this.alto }).then(() => {
      this.pixiListo();
    });
  }

  async pixiListo() {
    //agrega elementos generales
    this.camara.inicializar();
    await this.hud.inicializar();
    await this.fondo.inicializar();


    this.slime = new SlimeProta(1500, 1500, 20, this);
    await this.slime.inicializar();
    this.cargarNivel1();

    //agrega elementos de PIXI
    window.__PIXI_APP__ = this.app;
    document.body.appendChild(this.app.canvas);

    //comienza el gameloop
    this.app.ticker.add(() => this.gameLoop());
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
    this.vidas--;
    this.hud.actualizarVidas(this.vidas);
    if (this.vidas <= 0) {
      alert("¡Perdiste! (Presiona 'R' para reiniciar)");
      this.app.stop();
    }
  }
  //funciones para cambiar de nivel
  cargarNivel1() {
    this.nivelActual++;
    this.npcManager.ponerNpcsEnTodoElMapa(Virus, 2);
    this.npcManager.ponerNpcsEnTodoElMapa(Ameba, 1000);
  }
  cargarNivel2() {
    this.nivelActual++;

    this.npcManager.agregarNpcsEnZonaNoVisible(Virus, 1000);
    this.npcManager.agregarNpcsEnZonaNoVisible(Gato, 2);
    this.ampliarMapa();
    this.npcManager.sacarNpcs(Ameba);
  }
  cargarNivel3() {
    this.nivelActual++;
    this.npcManager.agregarNpcsEnZonaNoVisible(Gato, 500);
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