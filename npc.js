class Npc extends Entidad{
    constructor(posX,posY,radio,juego,radioDeVision,velocidadMax){
        super(posX,posY,radio,juego);
        this.velocidadMax = velocidadMax;
        this.radioDeEscape = radioDeVision;
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
            this.puntoDeDestino = {x:Math.random() * this.juego.fondo.width,
                                   y:Math.random() * this.juego.fondo.height};
        }
        const direccion = getUnitVector(this.puntoDeDestino,this.position);
        this.asignarAceleracionNormalizada(direccion.x * this.MultiplicadorDeAceleracion,
                                           direccion.y * this.MultiplicadorDeAceleracion);
    }
    estaA_DistaciaDe_(distacia,objetivo){
        if(this.juego.slime === undefined) return false;
        return distancia(this.position,objetivo.position) < distacia;
    }

}