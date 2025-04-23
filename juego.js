class Juego {
  constructor() {
    this.app = new PIXI.Application();
    this.ancho = 2000;
    this.alto = 2000;
    this.camara = { x: 0, y: 0 };
    this.camaraCentro = { x: this.ancho / 2, y: this.alto / 2 };  

    this.mouse = { x: 0, y: 0 };

    this.gravedad = { x: 0, y: 3 };

    this.slimeTontos = [];

    this.slime = null;


    this.ultimoFrame = 0;
    this.delta = 0;

    this.app.init({width: this.ancho, height: this.alto }).then(() => {
      this.pixiListo();
    });
    this.slimesMalos = [];
    this.vidas = 3;
    this.corazones = [];
    this.slimesComidos = 0;
    this.contadorTexto = null;
    this.hud = new PIXI.Container();
    this.app.stage.addChild(this.hud);
    
  }

  pixiListo() {
    console.log("pixi listo");

    document.body.appendChild(this.app.canvas);

    this.ponerEventListeners();

    window.__PIXI_APP__ = this.app;

    this.ponerSlime();

    this.ponerSlimesTontos(200);

    this.app.ticker.add(() => this.gameLoop());

    this.ponerSlimesMalos(10);
    this.dibujarCorazones();
    this.contadorTexto = new PIXI.Text("Comidos: 0", {
      fill: 0xffffff,
      fontSize: 24,
    });
    this.contadorTexto.x = 20;
    this.contadorTexto.y = 50;
    this.app.stage.addChild(this.contadorTexto);
  }
  ponerSlimesMalos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const malo = new SlimeMalo(300 + i * 100, 300, 15, this);
      this.slimesMalos.push(malo);
    }
  }

  ponerEventListeners() {
    window.onmousemove = (evento) => {
      this.cuandoSeMueveElMouse(evento);
    };
  }

  cuandoSeMueveElMouse(evento) {
    this.mousePos = {x:evento.x, y:evento.y};
  }
  gameLoop() {
    this.delta = performance.now() - this.ultimoFrame;
    this.ultimoFrame = performance.now();

    this.actualizarCamara();
    this.slime.update();
    this.slime.render();

    for (let i = 0; i < this.slimeTontos.length; i++) {
      this.slimeTontos[i].update();
    }
    for (let i = 0; i < this.slimeTontos.length; i++) {
      this.slimeTontos[i].render();
    }
    for (let i = 0; i < this.slimesMalos.length; i++) {
      this.slimesMalos[i].update();
      this.slimesMalos[i].render();
    }
  }
  actualizarCamara() {
    const objetivo = this.slime.position;
  
    this.camara.x = objetivo.x - this.camaraCentro.x;
    this.camara.y = objetivo.y - this.camaraCentro.y;
  
    this.app.stage.x = -this.camara.x;
    this.app.stage.y = -this.camara.y;
  }
  ponerSlime(){
    this.slime = new Slime(200, 200, 20, 10, this);
  }
  ponerSlimesTontos(cantidad){
    for (let i = 0; i < cantidad; i++) {
      const slimeTonto = new SlimeTonto(400, 400, 20, 10, this);
      this.slimeTontos.push(slimeTonto);
    }
  }
  ponerSlimesMalos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const malo = new SlimeMalo(300 + i * 100, 300, 15, this);
      this.slimesMalos.push(malo);
    }
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
      alert("¡Perdiste!");
      this.app.stop();
    }
  }
}

