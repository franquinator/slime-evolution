class NpcPasivo extends Npc {
    constructor(posX, posY, radio, juego, radioDeVision, velocidadMax) {
        super(posX, posY, radio, juego, radioDeVision, velocidadMax);

        this.visionAlineacion = 300;
        this.visionSeparacion = 150;
        this.visionCohesion = 300;

        // Factores muy reducidos para movimiento más lento
        this.factorCohesion = 0.02;
        this.factorAlineacion = 0.03;
        this.factorSeparacion = 0.04;

        // Configuración de movimiento base
        this.MultiplicadorDeAceleracion = 0.1;
        this.velocidadMax = 0.5;

        // Dar velocidad inicial aleatoria más lenta
        const velocidadInicial = 0.3;
        const angulo = Math.random() * Math.PI * 2;
        this.vel = {
            x: Math.cos(angulo) * velocidadInicial,
            y: Math.sin(angulo) * velocidadInicial
        };

        // Inicializar aceleración
        this.aceleracion = { x: 0, y: 0 };
    }

    update() {
        if (!this.position || !this.vel) {
            console.error('Posición o velocidad no definida');
            return;
        }

        // Reiniciar aceleración al inicio de cada frame
        this.aceleracion.x = 0;
        this.aceleracion.y = 0;

        // Obtener límites antes de aplicar fuerzas
        const limites = this.getLimites();
        
        // Verificar valores antes de usar
        if (isNaN(this.position.x) || isNaN(this.position.y)) {
            console.error('Posición NaN detectada');
            this.position.x = limites.limX.min + 100;
            this.position.y = limites.limY.min + 100;
        }

        if (isNaN(this.vel.x) || isNaN(this.vel.y)) {
            console.error('Velocidad NaN detectada');
            this.vel.x = 0.1;
            this.vel.y = 0.1;
        }

        // Aplicar fuerza repulsiva de los bordes
        this.aplicarRepulsionBordes(limites);

        // Aplicar comportamiento de boids
        this.recopilarDatos();
        this.aplicarSeparacion();
        this.aplicarAlineacion();
        this.aplicarCohesion();

        // Limitar la velocidad máxima
        const velocidadActual = Math.hypot(this.vel.x, this.vel.y);
        if (velocidadActual > this.velocidadMax && velocidadActual > 0) {
            this.vel.x = (this.vel.x / velocidadActual) * this.velocidadMax;
            this.vel.y = (this.vel.y / velocidadActual) * this.velocidadMax;
        }

        // Asegurar que la velocidad no sea NaN
        if (isNaN(this.vel.x) || isNaN(this.vel.y)) {
            this.vel.x = 0.1;
            this.vel.y = 0.1;
        }

        super.update();
    }

    aplicarFuerza(fuerza) {
        if (!fuerza || isNaN(fuerza.x) || isNaN(fuerza.y)) {
            console.error('Fuerza inválida');
            return;
        }
        this.aceleracion.x += fuerza.x;
        this.aceleracion.y += fuerza.y;
    }

    recopilarDatos() {
        this.recopilarDatosSeparacion();
        this.recopilarDatosAlineacion();
        this.recopilarDatosCohesion();
    }
    recopilarDatosSeparacion(){
        this.promedioDePosicionParaSeparacion = {
            x: 0,
            y: 0,
        };

        this.aliadosParaSeparacion = this.juego.npcManager.obtenerEntidadesCercaDe(this.position, this.visionSeparacion);
        if(this.aliadosParaSeparacion.length == 0)return;
        
        for (let i = 0; i < this.aliadosParaSeparacion.length; i++) {
            const aliado = this.aliadosParaSeparacion[i];
            this.promedioDePosicionParaSeparacion.x += aliado.position.x;
            this.promedioDePosicionParaSeparacion.y += aliado.position.y;
        }   
        this.promedioDePosicionParaSeparacion.x /= this.aliadosParaSeparacion.length;
        this.promedioDePosicionParaSeparacion.y /= this.aliadosParaSeparacion.length;
    }
    recopilarDatosCohesion(){
        this.promedioDePosicionParaCohesion = {
            x: 0,
            y: 0,
        };

        this.aliadosParaCohesion = this.juego.npcManager.obtenerEntidadesCercaDe(this.position, this.visionCohesion);
        if(this.aliadosParaCohesion.length == 0)return;

        for (let i = 0; i < this.aliadosParaCohesion.length; i++) {
            const aliado = this.aliadosParaCohesion[i];
            this.promedioDePosicionParaCohesion.x += aliado.position.x;
            this.promedioDePosicionParaCohesion.y += aliado.position.y;
        }
        this.promedioDePosicionParaCohesion.x /= this.aliadosParaCohesion.length;
        this.promedioDePosicionParaCohesion.y /= this.aliadosParaCohesion.length;
    }
    recopilarDatosAlineacion(){
        this.promedioDeVelParaAlineacion = {
            x: 0,
            y: 0,
        };

        this.aliadosParaAlineacion = this.juego.npcManager.obtenerEntidadesCercaDe(this.position, this.visionAlineacion);
        if(this.aliadosParaAlineacion.length == 0)return;

        for (let i = 0; i < this.aliadosParaAlineacion.length; i++) {
            const aliado = this.aliadosParaAlineacion[i];
            if (aliado.vel) {
                this.promedioDeVelParaAlineacion.x += aliado.vel.x;
                this.promedioDeVelParaAlineacion.y += aliado.vel.y;
            }
        }
        this.promedioDeVelParaAlineacion.x /= this.aliadosParaAlineacion.length;
        this.promedioDeVelParaAlineacion.y /= this.aliadosParaAlineacion.length;
    }
    aplicarAlineacion(){
        if(this.aliadosParaAlineacion.length == 0)return;
        
        const fuerzaAlineacion = {
            x: this.promedioDeVelParaAlineacion.x * this.factorAlineacion,
            y: this.promedioDeVelParaAlineacion.y * this.factorAlineacion
        };
        this.aplicarFuerza(fuerzaAlineacion);
    }
    aplicarCohesion(){
        if(this.aliadosParaCohesion.length == 0)return;
        
        const dx = this.promedioDePosicionParaCohesion.x - this.position.x;
        const dy = this.promedioDePosicionParaCohesion.y - this.position.y;
        const distancia = Math.hypot(dx, dy);
        
        if (distancia > 0) {
            const fuerzaCohesion = {
                x: (dx / distancia) * this.factorCohesion,
                y: (dy / distancia) * this.factorCohesion
            };
            this.aplicarFuerza(fuerzaCohesion);
        }
    }
    aplicarSeparacion(){
        if(this.aliadosParaSeparacion.length == 0)return;
        
        const dx = this.promedioDePosicionParaSeparacion.x - this.position.x;
        const dy = this.promedioDePosicionParaSeparacion.y - this.position.y;
        const distancia = Math.hypot(dx, dy);
        
        if (distancia > 0) {
            const fuerzaSeparacion = {
                x: -(dx / distancia) * this.factorSeparacion,
                y: -(dy / distancia) * this.factorSeparacion
            };
            this.aplicarFuerza(fuerzaSeparacion);
        }
    }

    aplicarRepulsionBordes(limites) {
        const margenBorde = 200; // Distancia desde el borde donde empieza la repulsión
        const factorRepulsion = 0.05; // Qué tan fuerte es la repulsión
        
        // Calcular distancias a los bordes
        const distIzquierda = this.position.x - limites.limX.min;
        const distDerecha = limites.limX.max - this.position.x;
        const distArriba = this.position.y - limites.limY.min;
        const distAbajo = limites.limY.max - this.position.y;

        // Función para calcular la fuerza basada en la distancia al borde
        const calcularFuerza = (distancia) => {
            if (distancia > margenBorde) return 0;
            const factor = (1 - distancia / margenBorde) * factorRepulsion;
            return factor;
        };

        // Aplicar fuerzas en cada dirección si está cerca de los bordes
        if (distIzquierda < margenBorde) {
            this.aplicarFuerza({
                x: calcularFuerza(distIzquierda),
                y: 0
            });
        }
        if (distDerecha < margenBorde) {
            this.aplicarFuerza({
                x: -calcularFuerza(distDerecha),
                y: 0
            });
        }
        if (distArriba < margenBorde) {
            this.aplicarFuerza({
                x: 0,
                y: calcularFuerza(distArriba)
            });
        }
        if (distAbajo < margenBorde) {
            this.aplicarFuerza({
                x: 0,
                y: -calcularFuerza(distAbajo)
            });
        }
    }
}