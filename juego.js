class Juego {
  constructor() {
    this.app = new PIXI.Application();
    this.ancho = 800;
    this.alto = 800;

    this.mouse = { x: 0, y: 0 };

    this.gravedad = { x: 0, y: 3 };

    this.slimeTontos = [];

    this.slime = null;


    this.ultimoFrame = 0;
    this.delta = 0;

    this.app.init({width: this.ancho, height: this.alto }).then(() => {
      this.pixiListo();
    });
    
  }

  pixiListo() {
    console.log("pixi listo");

    document.body.appendChild(this.app.canvas);

    this.ponerEventListeners();

    window.__PIXI_APP__ = this.app;

    this.ponerSlime();

    this.ponerSlimesTontos(5);

    this.app.ticker.add(() => this.gameLoop());

    
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

    this.slime.update();
    this.slime.render();

    for (let i = 0; i < this.slimeTontos.length; i++) {
      this.slimeTontos[i].update();
    }
    for (let i = 0; i < this.slimeTontos.length; i++) {
      this.slimeTontos[i].render();
    }
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
}
