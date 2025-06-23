class Npc extends Entidad{
    constructor(posX,posY,radio,juego,radioDeVision,velocidadMax){
        super(posX,posY,radio,juego);
        this.velocidadMax = velocidadMax;
        this.radioDeEscape = radioDeVision;
        this.distanciaAlJugador = 0;
        this.tiempoQuieto = 0;
        this.ultimaPosicion = {x: posX, y: posY};
        this.tiempoMaximoQuieto = 5000; // 5 segundos
    }
    update() {
        // Verificar si está quieto
        if (distancia(this.position, this.ultimaPosicion) < 1) {
            this.tiempoQuieto += this.juego.delta;
            if (this.tiempoQuieto >= this.tiempoMaximoQuieto) {
                this.juego.npcManager.eliminarEntidad(this);
                return;
            }
        } else {
            this.tiempoQuieto = 0;
            this.ultimaPosicion = {x: this.position.x, y: this.position.y};
        }
        super.update();
    }

    perseguirA(objetivo) {
        const dir = getUnitVector(objetivo.position, this.position);
        this.asignarAceleracionNormalizada(
          dir.x * this.MultiplicadorDeAceleracion,
          dir.y * this.MultiplicadorDeAceleracion
        );
    }
    huirDe(enemigo){
        const direccionDeHuida = getUnitVector(enemigo.position,this.position);
        this.asignarAceleracionNormalizada(
            direccionDeHuida.x * -1 * this.MultiplicadorDeAceleracion,
            direccionDeHuida.y * -1 * this.MultiplicadorDeAceleracion);
    }
    deambular(){
        if(this.puntoDeDestino === undefined || distancia(this.puntoDeDestino,this.position) < 10 ){
            this.puntoDeDestino = {x:this.getLimites().limX.min + (Math.random() * (this.juego.fondo.width - this.radio * 2)) ,
                                   y:this.getLimites().limY.min + (Math.random() * (this.juego.fondo.height - this.radio * 2)) };
        }
        //console.log(this.puntoDeDestino);
        //console.log(this.position);
        const direccion = getUnitVector(this.puntoDeDestino,this.position);
        this.asignarAceleracionNormalizada(direccion.x * this.MultiplicadorDeAceleracion,
                                           direccion.y * this.MultiplicadorDeAceleracion);
    }
    estaA_DistaciaDe_(distacia,objetivo){
        if(objetivo === undefined) return false;
        return distancia(this.position,objetivo.position)-objetivo.radio-this.radio < distacia;
    }

}