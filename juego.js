class Juego {
  constructor() {
    this.app = new PIXI.Application();
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;

    this.centro = {
      x:this.ancho/2,
      y:this.alto/2
    }

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
    
  }

  async pixiListo() {
    console.log("pixi listo");

    this.ponerCamara();

    document.body.appendChild(this.app.canvas);

    this.ponerEventListeners();

    window.__PIXI_APP__ = this.app;

    await this.ponerFondo();

    this.ponerSlime();

    this.ponerNpcs(Virus,5);

    this.ponerNpcs(Ameba,100);

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
  }

  cuandoSeMueveElMouse(evento) {
    this.mousePos = {x:evento.x, y:evento.y};
  }

  cuandoSePresionaUnaTecla(evento){
    if (evento.key.toLowerCase() === 'r' && this.vidas <= 0) {
      reiniciarJuego();
    }
  }

  gameLoop() {
    this.delta = performance.now() - this.ultimoFrame;
    this.ultimoFrame = performance.now();

    this.actualizarCamara();

    this.slime.update();
    this.slime.render();

    for (let i = 0; i < this.todasLasEntidades.length; i++) {
      this.todasLasEntidades[i].update();
      this.todasLasEntidades[i].render();
    }
  }

  actualizarCamara() {
    const cuanto = 0.5;

    const valorFinalX = -this.slime.position.x + this.ancho / 2;
    const valorFinalY = -this.slime.position.y + this.alto / 2;

    this.worldContainer.x -=
      (this.worldContainer.x - valorFinalX) * cuanto;
    this.worldContainer.y -=
      (this.worldContainer.y - valorFinalY) * cuanto;
  }
  
  alejarCamara() {
    this.worldContainer.scale.x -= 0.1;
    this.worldContainer.scale.y -= 0.1;
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

