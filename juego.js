class Juego {
  constructor() {
    this.app = new PIXI.Application();
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    this.quadtree = new Quadtree({
      x: 0,
      y: 0,
      width: this.ancho * 3,  // o this.fondo.width si ya está cargado
      height: this.alto * 3
    });

    this.centro = {
      x:this.ancho/2,
      y:this.alto/2


    }
    this.nivelActual = 1;

    this.mouse = { x: 0, y: 0 };

    this.gravedad = { x: 0, y: 3 };

    this.todasLasEntidades = [];

    this.slime = null;

    this.ultimoFrame = 0;
    this.delta = 0;

    this.app.init({width: this.ancho, height: this.alto}).then(() => {
      this.pixiListo();
    });

    this.vidas = 3;
    this.corazones = [];

    this.comidaConseguida = 0;
    this.contadorDeComidaTexto = null;

    this.hud = new PIXI.Container();
    this.app.stage.addChild(this.hud);
    this.fpsText = new PIXI.Text('FPS: 0', {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0xffffff,
} );
    this.fpsText.anchor.set(1, 0); // anclado arriba a la derecha
    this.fpsText.position.set(window.innerWidth - 10, 10);
    this.fpsText.zIndex = 1000;
    this.app.stage.addChild(this.fpsText);

    this.lastFpsUpdate = performance.now();
    this.frameCount = 0;
   
  
  
  }
  

  async pixiListo() {
    console.log("pixi listo");

    this.ponerCamara();

    document.body.appendChild(this.app.canvas);

    this.ponerEventListeners();

    window.__PIXI_APP__ = this.app;

    await this.ponerFondo();

    this.ponerSlime();

    this.ponerNpcs(Virus,10);

    this.ponerNpcs(Ameba,5000);

    this.dibujarCorazones();
    this.dibujarContador();
    
    this.app.ticker.add(() => this.gameLoop());
  }

  ponerSlime(){
    this.slime = new SlimeProta(1000, 1000, 20, this);
  }


  ponerNpcs(clase,cantidad){
    for (let i = 0; i < cantidad; i++) {
      const npcActual = new clase(Math.random() * this.fondo.width, Math.random() * this.fondo.height,this);
      this.todasLasEntidades.push(npcActual);
    }
  }
  
  dibujarContador(){
    this.contadorDeComidaTexto = new PIXI.Text("Comidos: 0", {
      fill: 0xffffff,
      fontSize: 24,
    });
    this.contadorDeComidaTexto.x = 20;
    this.contadorDeComidaTexto.y = 50;
    this.app.stage.addChild(this.contadorDeComidaTexto);
  }

  ponerCamara(){
    this.worldContainer = new PIXI.Container({
      // this will make moving this container GPU powered
      isRenderGroup: true,
    });
    this.app.stage.addChild(this.worldContainer);
  }

  ponerEventListeners() {
    window.onmousemove = (evento) => {
      this.cuandoSeMueveElMouse(evento);
    };
    window.addEventListener('keydown', (evento) => {
      this.cuandoSePresionaUnaTecla(evento)
    });
    window.addEventListener('wheel', (evento) => {
      this.cuandoSeGiraLaRueda(evento);
    }, { passive: false }/* arreglo con chatgpt */);
    window.addEventListener('resize', () => {
     this.ancho = window.innerWidth;
     this.alto = window.innerHeight;
     this.fpsText.position.set(this.ancho - 10, 10);
  });


  }

  cuandoSeMueveElMouse(evento) {
    this.mousePos = {x:evento.x, y:evento.y};
  }
  cuandoSeGiraLaRueda(evento){
    this.ajustarTamanioDeCamara(evento.deltaY / 1000);
    console.log(evento.deltaY / 1000);
  }

  cuandoSePresionaUnaTecla(evento){
    if (evento.key.toLowerCase() === 'r' && this.vidas <= 0) {
      reiniciarJuego();
    }
    if (evento.key.toLowerCase() === 'a') { // Tecla 'A' para alejar la cámara
        this.ajustarTamanioDeCamara();
    }

  }

  

  gameLoop() {
    //agrega quadrtree
    this.quadtree.limpiar();
    for (let entidad of this.todasLasEntidades) {
      this.quadtree.insertar(entidad);
    }
    this.delta = performance.now() - this.ultimoFrame;
    this.ultimoFrame = performance.now();

    this.actualizarCamara();

    this.slime.update();
    this.slime.render();

    for (let i = 0; i < this.todasLasEntidades.length; i++) {
      this.todasLasEntidades[i].update();
      this.todasLasEntidades[i].render();
    }
    //se ven los fps
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      const fps = this.frameCount;
      this.fpsText.text = `FPS: ${fps}`;
      this.lastFpsUpdate = now;
      this.frameCount = 0;
}
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

  dibujarCorazones() {
    for (let i = 0; i < 3; i++) {
      const corazon = new PIXI.Graphics()
        .circle(0, 0, 10)
        .fill({ color: 0xff0000 });
      corazon.x = 20 + i * 30;
      corazon.y = 20;
      this.app.stage.addChild(corazon);
      this.corazones.push(corazon);
    }
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

  async ponerFondo() {
    // Cargar la textura
    let textura = await PIXI.Assets.load("Assets/Graficos/bg.jpg");

    // Crear el TilingSprite con la textura y dimensiones
    this.fondo = new PIXI.TilingSprite(textura, this.ancho * 3, this.alto * 3);

    // Añadir al escenario
    this.worldContainer.addChild(this.fondo);
  }
  
}

window.reiniciarJuego = function () {
  location.reload(); // recarga la página para reiniciar todo
};

