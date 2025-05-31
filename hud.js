class Hud {
    constructor(app) {
        this.app = app;
        this.hud = new PIXI.Container();
        this.hud.zIndex = 1000;
        this.app.stage.addChild(this.hud);
        
        this.corazones = [];
        this.contadorDePuntos = null;
        this.fpsText = null;
        this.panelDeDebug = null;
        this.textoDeDebug = null;
    }

    async inicializar() {
        await this.dibujarCorazones();
        this.dibujarContador();
        this.dibujarContadorFps();
        this.dibujarPanelDeDebug();
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
        this.contadorDePuntos = new PIXI.Text("Comidos: 0", {
            fill: 0xffffff,
            fontSize: 24,
        });
        this.contadorDePuntos.position.set(20, 50);
        this.hud.addChild(this.contadorDePuntos);
    }

    dibujarContadorFps() {
        this.fpsText = new PIXI.Text('FPS: 0', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xffffff,
        });
        this.fpsText.anchor.set(1, 0);
        this.fpsText.position.set(window.innerWidth - 10, 10);
        this.hud.addChild(this.fpsText);
    }

    dibujarPanelDeDebug() {
        this.panelDeDebug = new PIXI.Container();
        this.panelDeDebug.zIndex = 1000;
        this.app.stage.addChild(this.panelDeDebug);

        this.textoDeDebug = new PIXI.Text("Debug", {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xffffff,
        });
        this.panelDeDebug.addChild(this.textoDeDebug);
        this.panelDeDebug.position.set(window.innerWidth / 2, 0);
        this.panelDeDebug.visible = false;
    }

    actualizarVidas(vidas) {
        for (let i = 0; i < this.corazones.length; i++) {
            this.corazones[i].visible = i < vidas;
        }
    }

    actualizarPuntos(cantidad) {
        if (this.contadorDePuntos) {
            this.contadorDePuntos.text = `Puntoss: ${cantidad}`;
        }
    }

    actualizarFPS(fps) {
        if (this.fpsText) {
            this.fpsText.text = `FPS: ${Math.round(fps)}`;
        }
    }

    actualizarDebug(texto) {
        this.textoDeDebug.text = texto;
    }

    togglePanelDebug() {
        if (this.panelDeDebug) {
            this.panelDeDebug.visible = !this.panelDeDebug.visible;
        }
    }
}

