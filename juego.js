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
    this.radioNivel = [300,1200,2400];
    this.radioNivelActual = this.radioNivel[this.nivelActual-1];

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
    this.hud = new Hud(this.app);;
    this.npcManager = new NpcManager(this);
    this.eventos = new Eventos(this);
    this.camara = new Camara(this);
    this.fondo = new Fondo(this,this.tamanioBase);

    this.app.init({ width: this.ancho, height: this.alto }).then(() => {
      this.pixiListo();
    });
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
    this.verificarNivel();
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
      console.log(`FPS: ${this.fpsActual}`);
    }
    
    this.hud.actualizarFPS(this.fpsActual);
  }

  actualizarProtagonista() {
    this.slime.update();
    this.slime.render();
  }

  agregarPuntos(puntos){
    this.puntos += puntos;
    this.hud.actualizarPuntos(this.puntos);
    this.guardarPuntuacionAlta();
  }

  perderVida() {
     this.vidas--;
    this.hud.actualizarVidas(this.vidas);
    /*if (this.vidas <= 0) {
      this.finalizarJuego(false);
    }*/
  }
  subirNivel(){
    this.nivelActual++;
    console.log("subiendo nivel"+this.nivelActual);
    
    // Transición más suave de la cámara
    if(this.nivelActual == 3) {
      // En el último nivel, alejar mucho más la cámara
      this.camara.juego.worldContainer.scale.set(0.1, 0.1);
      // Aumentar la velocidad del personaje en el nivel 3
      this.slime.MultiplicadorDeAceleracion = 0.2;
      this.slime.velocidadMax = 2;
    } else if(this.nivelActual == 2) {
      // Transición más suave al nivel 2
      this.camara.juego.worldContainer.scale.set(0.4, 0.4);
    } else {
      this.camara.juego.worldContainer.scale.set(0.3, 0.3);
    }
    
    if(this.nivelActual == 2){
      this.cargarNivel2();
    }
    else if(this.nivelActual == 3){
      this.cargarNivel3();
    }
    else if(this.nivelActual >= 4){
      this.finalizarJuego(true);
    }
    this.radioNivelActual = this.radioNivel[this.nivelActual-1];
  }

  //funciones para cambiar de nivel
  cargarNivel1() {
    console.log("cargando nivel 1");
    const cantidadVirus = this.dificultad === 'facil' ? 15 : this.dificultad === 'normal' ? 20 : 25;
    const cantidadAmebas = this.dificultad === 'facil' ? 800 : this.dificultad === 'normal' ? 1000 : 1200;
    
    this.npcManager.ponerNpcsEnTodoElMapa(Virus, cantidadVirus);
    this.npcManager.ponerNpcsEnTodoElMapa(Ameba, cantidadAmebas);
  }
  cargarNivel2() {
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
  }

  verificarNivel() {
    if (this.nivelActual === 2) {
      // En el nivel 2, pasar al siguiente nivel al alcanzar 650 puntos
      if (this.puntos >= 650) {
        this.subirNivel();
      }
    } else if (this.nivelActual === 3) {
      // En el nivel 3, verificar si quedan peces
      const pecesRestantes = this.npcManager.todasLasEntidades.filter(entidad => entidad.constructor.name === 'Pez').length;
      if (pecesRestantes === 0) {
        this.finalizarJuego(true);
      }
    } else {
      // Para el nivel 1, usar el sistema de radio
      if (this.slime.radio >= this.radioNivelActual) {
        this.subirNivel();
      }
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