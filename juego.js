class Juego {
  constructor() {
    //variables base
    this.app = new PIXI.Application();
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    this.tamanioBase = 6000;

    //variables de camara
    this.centro = {
      x: this.ancho / 2,
      y: this.alto / 2
    }

    this.mouse = { x: 0, y: 0 };
    this.mousePresionado = false;

    //variables de cambio de nivel
    this.finalizado = false;


    //variables de juego
    this.slime = null;
    this.vidas = 3;
    this.puntos = 0;
    this.puntuacionAlta = this.cargarPuntuacionAlta();
    this.dificultad = this.cargarDificultad();
    this.velocidadCamara = this.cargarVelocidadCamara();
    this.worldContainer = new PIXI.Container({
      // this will make moving this container GPU powered
      isRenderGroup: true,
    });

    //variables de fps
    this.ultimoFrame = performance.now();
    this.delta = 0;
    this.fpsContador = 0;
    this.ultimoFpsUpdate = 0;
    this.fpsActual = 0;

    //variables de componentes

    this.grilla = new Grilla(this, 400);
    this.hud = new Hud(this);
    this.npcManager = new NpcManager(this);
    this.eventos = new Eventos(this);
    this.camara = new Camara(this);
    this.fondo = new Fondo(this, this.tamanioBase);
    this.gestorNiveles = new GestorNiveles(this);

    this.recursos = new Map();

    this.escalaDeJuego = 1;

    

    this.app.init({ width: this.ancho, height: this.alto }).then(() => {
      this.pixiListo();
    });
  }

  cargarDificultad() {
    return localStorage.getItem('dificultad') || 'normal';
  }

  cargarVelocidadCamara() {
    return parseInt(localStorage.getItem('velocidadCamara')) || 5;
  }

  async pixiListo() {
    //agrega elementos generales
    this.camara.inicializar();
    await this.hud.inicializar();
    await this.fondo.inicializar();

    await this.precargarRecursos();

    this.slime = new SlimeProta(1500, 1500, 20, this);
    await this.slime.inicializar();

    this.gestorNiveles.iniciar();

    //agrega elementos de PIXI
    window.__PIXI_APP__ = this.app;
    document.body.appendChild(this.app.canvas);
    console.log("pixi listo")


    //this.testearTiempo();

    //comienza el gameloop
    this.app.ticker.add(() => this.gameLoop());
  }
  testearTiempo() {
    let tiempoInicial = performance.now();
    for (let i = 0; i < 1000; i++) {
      this.npcManager.update();
    }
    let tiempoFinal = performance.now();
    console.log("tiempo de update: " + (tiempoFinal - tiempoInicial) + "ms");
  }
  async precargarRecursos() {
    this.recursos.set("Assets/texture.json", await PIXI.Assets.load("Assets/texture.json"));
    this.recursos.set("Assets/Graficos/bg.jpg", await PIXI.Assets.load("Assets/Graficos/agua pixelartt.png"));
    this.recursos.set("Assets/Graficos/corazon1.png", await PIXI.Assets.load("Assets/Graficos/corazon1.png"));
    this.recursos.set("Assets/Graficos/pqz.png", await PIXI.Assets.load("Assets/Graficos/pqz.png"));
    this.recursos.set("Assets/Graficos/cat.png", await PIXI.Assets.load("Assets/Graficos/cat.png"));
    this.recursos.set("Assets/Graficos/bacteria1.png", await PIXI.Assets.load("Assets/Graficos/bacteria1.png"));
    this.recursos.set("Assets/Graficos/amoeba1.png", await PIXI.Assets.load("Assets/Graficos/amoeba1.png"));
    this.recursos.set("Assets/Graficos/amoeba2.png", await PIXI.Assets.load("Assets/Graficos/amoeba2.png"));
    this.recursos.set("Assets/Graficos/larva.pngq", await PIXI.Assets.load("Assets/Graficos/larva.png"));
    this.recursos.set("Assets/Graficos/ameba agua.png", await PIXI.Assets.load("Assets/Graficos/ameba agua.png"));
    this.recursos.set("Assets/Graficos/virusPixel.png", await PIXI.Assets.load("Assets/Graficos/virusPixel.png"));
    this.recursos.set("Assets/Graficos/pezPixel.png", await PIXI.Assets.load("Assets/Graficos/pezPixel.png"));
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
    const ahora = performance.now();
    this.fpsContador++;
    
    if (ahora - this.ultimoFpsUpdate >= 1000) {
      this.fpsActual = this.fpsContador;
      this.fpsContador = 0;
      this.ultimoFpsUpdate = ahora;
    }
    
    this.hud.actualizarFPS(this.fpsActual);
  }

  actualizarProtagonista() {
    this.slime.update();
    this.slime.render();
  }

  agregarPuntos(puntos) {
    this.puntos += puntos;
    this.hud.actualizarPuntos(this.puntos);
    this.guardarPuntuacionAlta();
  }
  cargarPuntuacionAlta() {
    return localStorage.getItem('puntuacionAlta') || 0;
  }
  guardarPuntuacionAlta() {
    if (this.puntos > this.puntuacionAlta) {
      this.puntuacionAlta = this.puntos;
      localStorage.setItem('puntuacionAlta', this.puntuacionAlta);
    }
  }

  perderVida() {
    this.vidas--;
    this.hud.actualizarVidas(this.vidas);
    if (this.vidas <= 0) {
      alert("¡Perdiste! (Presiona 'R' para reiniciar)");
      this.finalizado = true;
      this.app.stop();
    }
  }

  finalizarJuego(ganado) {
    this.finalizado = true;
    this.app.stop();
    this.guardarPuntuacionAlta();
    
    const mensaje = ganado 
      ? `¡Felicidades! Has ganado con ${this.puntos} puntos.\nPuntuación más alta: ${this.puntuacionAlta}`
      : `¡Game Over! Puntuación: ${this.puntos}\nPuntuación más alta: ${this.puntuacionAlta}`;
    
    alert(mensaje + "\nPresiona 'R' para reiniciar");
  }
}

window.reiniciarJuego = function () {
  location.reload(); // recarga la página para reiniciar todo
};