class Hud {
    constructor(juego) {
        this.juego = juego;
        this.hud = new PIXI.Container();
        this.hud.zIndex = 1000;
        this.juego.app.stage.addChild(this.hud);
        
        this.corazones = [];
        this.contadorDePuntos = null;
        this.fpsText = null;
        this.panelDeDebug = null;
        this.textoDeDebug = null;
        this.botones = new Map(); // Para almacenar los botones creados
    }

    async inicializar() {
        await this.dibujarCorazones();
        this.dibujarContador();
        this.dibujarContadorFps();
        this.dibujarPanelDeDebug();
        this.dibujarBotonDePrueba();
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
        this.hud.addChild(this.panelDeDebug);

        this.textoDeDebug = new PIXI.Text("Debug", {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xffffff,
        });
        this.panelDeDebug.addChild(this.textoDeDebug);
        this.panelDeDebug.position.set(window.innerWidth / 2, 0);
        this.panelDeDebug.visible = false;
    }

    dibujarBotonDePrueba() {
        this.crearBoton("Alternar colisiones", window.innerWidth - 150, 50, () => {
            this.juego.slime.alternarColisiones();
        });
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

    crearBoton(texto, x, y, callback) {
        // Crear el contenedor del botón
        const boton = new PIXI.Container();
        
        // Crear el fondo del botón
        const fondo = new PIXI.Graphics();
        fondo.beginFill(0x4a4a4a);
        fondo.drawRoundedRect(0, 0, 120, 40, 8);
        fondo.endFill();
        
        // Crear el texto del botón
        const textoBoton = new PIXI.Text(texto, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
        });
        textoBoton.anchor.set(0.5);
        textoBoton.position.set(60, 20);
        
        // Agregar fondo y texto al contenedor del botón
        boton.addChild(fondo);
        boton.addChild(textoBoton);
        
        // Posicionar el botón
        boton.position.set(x, y);
        
        // Hacer el botón interactivo
        boton.eventMode = 'static';
        boton.cursor = 'pointer';
        
        // Efectos de hover
        boton.on('pointerover', () => {
            fondo.tint = 0x666666;
        });
        
        boton.on('pointerout', () => {
            fondo.tint = 0xFFFFFF;
        });
        
        // Callback al hacer click
        boton.on('pointerdown', callback);
        
        // Agregar el botón al HUD
        this.hud.addChild(boton);
        
        // Guardar referencia al botón
        this.botones.set(texto, boton);
        
        return boton;
    }

    eliminarBoton(texto) {
        const boton = this.botones.get(texto);
        if (boton) {
            this.hud.removeChild(boton);
            this.botones.delete(texto);
        }
    }
}

