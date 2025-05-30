class Juego {
  constructor() {
    //variables base
    this.app = new PIXI.Application();
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;

    //variables de quadtree
    this.quadtree = new Quadtree({
      x: 0,
      y: 0,
      width: this.ancho * 3,  // o this.fondo.width si ya está cargado
      height: this.alto * 3
    });

    //variables de camara
    this.centro = {
      x: this.ancho / 2,
      y: this.alto / 2
    }
    this.mouse = { x: 0, y: 0 };

    //variables de cambio de nivel
    this.nivelActual = 1;

    //variables de juego
    this.todasLasEntidades = [];
    this.slime = null;
    this.vidas = 3;
    this.comidaConseguida = 0;
    
    //variables de fps
    this.lastFpsUpdate = performance.now();
    this.ultimoFrame = 0;
    this.frameCount = 0;
    this.delta = 0;

    //variables de hud
    this.corazones = [];
    this.contadorDeComidaTexto = null;

    this.app.init({ width: this.ancho, height: this.alto }).then(() => {
      this.pixiListo();
    });
  }


  async pixiListo() {
    console.log("pixi listo");

    //agrega listeners
    this.ponerEventListeners();

    //agrega elementos generales

    this.agregarHud();

    this.ponerCamara();

    //agrega elementos de juego
    await this.ponerFondo();

    this.ponerSlime();

    this.ponerNpcs(Virus, 10);

    this.ponerNpcs(Ameba, 2000);

    //agrega elementos de PIXI

    window.__PIXI_APP__ = this.app;

    document.body.appendChild(this.app.canvas);

    //comienza el gameloop
    this.app.ticker.add(() => this.gameLoop());
  }

  //funciones de eventos
  ponerEventListeners() {
    window.onmousemove = (evento) => {
      this.cuandoSeMueveElMouse(evento);
    };

    window.addEventListener('keydown', (evento) => {
      this.cuandoSePresionaUnaTecla(evento)
    });

    window.addEventListener('wheel', (evento) => {
      this.cuandoSeGiraLaRueda(evento);
    }, { passive: false });
  }
  
  cuandoSeMueveElMouse(evento) {
    this.mousePos = { x: evento.x, y: evento.y };
  }

  cuandoSeGiraLaRueda(evento) {
    this.ajustarTamanioDeCamara(evento.deltaY / 1000);
  }

  ajustarTamanioDeCamara(tamanioDeAumento) {
    //ayudó chat gpt
    const escalaMinima = 0.1; // Evitar que la escala sea demasiado pequeña
    const escalaMaxima = 2;   // Evitar que la escala sea demasiado grande

    // Nueva escala
    const nuevaEscalaX = Math.max(escalaMinima, Math.min(this.worldContainer.scale.x + tamanioDeAumento, escalaMaxima));
    const nuevaEscalaY = Math.max(escalaMinima, Math.min(this.worldContainer.scale.y + tamanioDeAumento, escalaMaxima));

    // Calcular el cambio de escala
    const factorCambioX = nuevaEscalaX / this.worldContainer.scale.x;
    const factorCambioY = nuevaEscalaY / this.worldContainer.scale.y;

    // Ajustar la posición para mantener el centro
    const centroX = this.ancho / 2;
    const centroY = this.alto / 2;

    this.worldContainer.x = centroX - (centroX - this.worldContainer.x) * factorCambioX;
    this.worldContainer.y = centroY - (centroY - this.worldContainer.y) * factorCambioY;

    // Aplicar la nueva escala
    this.worldContainer.scale.x = nuevaEscalaX;
    this.worldContainer.scale.y = nuevaEscalaY;
  }


  cuandoSePresionaUnaTecla(evento) {
    let key = evento.key.toLowerCase();
    if (key === 'r' && this.vidas <= 0) {
      reiniciarJuego();
    }
  }

  //funciones de hud
  async agregarHud() {
    this.hud = new PIXI.Container();
    this.hud.zIndex = 1000;
    this.app.stage.addChild(this.hud);

    await this.dibujarCorazones();
    this.dibujarContador();
    this.dibujarContadorFps();
  }

  async dibujarCorazones() {
    let textura = await PIXI.Assets.load("Assets/Graficos/corazon1.png");
    for (let i = 0; i < 3; i++) {
      const corazon = new PIXI.Sprite(textura);
      corazon.position.set(20 + i * 30, 20);
      this.hud.addChild(corazon);
      this.corazones.push(corazon);
    }
  }

  dibujarContador() {
    this.contadorDeComidaTexto = new PIXI.Text("Comidos: 0", {
      fill: 0xffffff,
      fontSize: 24,
    });
    this.contadorDeComidaTexto.position.set(20, 50);
    this.hud.addChild(this.contadorDeComidaTexto);
  }

  dibujarContadorFps() {
    this.fpsText = new PIXI.Text('FPS: 0', {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0xffffff,
    });
    this.fpsText.anchor.set(1, 0); // anclado arriba a la derecha
    this.fpsText.position.set(window.innerWidth - 10, 10);
    this.hud.addChild(this.fpsText);
  }
  perderVida() {
    this.vidas--;
    if (this.vidas >= 0) {
      this.corazones[this.vidas].visible = false;
    }
    if (this.vidas === 0) {
      alert("¡Perdiste! (Presiona 'R' para reiniciar)");
      this.app.stop();
    }
  }

  //funciones de camara
  ponerCamara() {
    this.worldContainer = new PIXI.Container({
      // this will make moving this container GPU powered
      isRenderGroup: true,
    });
    this.app.stage.addChild(this.worldContainer);
  }

  //funciones para agregar fondo
  async ponerFondo() {
    // Cargar la textura
    let textura = await PIXI.Assets.load("Assets/Graficos/bg.jpg");

    // Crear el TilingSprite con la textura y dimensiones
    this.fondo = new PIXI.TilingSprite(textura, this.ancho * 3, this.alto * 3);

    // Añadir al escenario
    this.worldContainer.addChild(this.fondo);
  }

  //funciones de manejo de entidades
  ponerSlime() {
    this.slime = new SlimeProta(1000, 1000, 20, this);
  }

  ponerNpcs(clase, cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const npcActual = new clase(Math.random() * this.fondo.width, Math.random() * this.fondo.height, this);
      this.todasLasEntidades.push(npcActual);
    }
  }
  sacarNpcs(clase) {
    this.todasLasEntidades = this.todasLasEntidades.filter(entidad => !(entidad instanceof clase));
  }

  //funciones para cambiar de nivel
  cargarNivel1() {
    this.nivelActual++;
    this.ponerNpcs(Virus, 10);
    this.ponerNpcs(Ameba, 2000);
  }
  cargarNivel2() {
    this.nivelActual++;
    this.sacarNpcs(Ameba);
    this.ponerNpcs(Gato, 10);
    this.ponerNpcs(Virus, 2000);
  }

  //funciones de gameloop
  gameLoop() {
    this.actualizarQuadtree();
    this.actualizarDeltaTime();
    this.actualizarCamara();
    this.actualizarContadorFps();
    this.actualizarProtagonista();
    this.actualizarEntidades();
  }
  actualizarQuadtree() {
    this.quadtree.limpiar();
    for (let entidad of this.todasLasEntidades) {
      this.quadtree.insertar(entidad);
    }
  }

  actualizarDeltaTime() {
    this.delta = performance.now() - this.ultimoFrame;
    this.ultimoFrame = performance.now();
  }

  actualizarCamara() {
    //ayudó chat gpt
    const cuanto = 0.5;

    // Considerar la escala actual del worldContainer
    const escalaX = this.worldContainer.scale.x;
    const escalaY = this.worldContainer.scale.y;

    // Ajustar los valores finales en función de la escala
    const valorFinalX = (-this.slime.position.x * escalaX) + (this.ancho / 2);
    const valorFinalY = (-this.slime.position.y * escalaY) + (this.alto / 2);

    // Suavizar el movimiento de la cámara
    this.worldContainer.x -= (this.worldContainer.x - valorFinalX) * cuanto;
    this.worldContainer.y -= (this.worldContainer.y - valorFinalY) * cuanto;
  }

  actualizarContadorFps(){
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      const fps = this.frameCount;
      this.fpsText.text = `FPS: ${fps}`;
      this.lastFpsUpdate = now;
      this.frameCount = 0;
    }
  }

  actualizarProtagonista() {
    this.slime.update();
    this.slime.render();
  }

  actualizarEntidades() {
    for (let i = 0; i < this.todasLasEntidades.length; i++) {
      this.todasLasEntidades[i].update();
      this.todasLasEntidades[i].render();
    }
  }
}

window.reiniciarJuego = function () {
  location.reload(); // recarga la página para reiniciar todo
};

