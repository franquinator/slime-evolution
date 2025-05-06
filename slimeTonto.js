class SlimeTonto extends Entidad{

    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,juego);

        this.velocidadMax = 0.5;
        this.radioDeEscape = 300;

        this.puntoDeDestino = {x:Math.random() * this.juego.fondo.width,
            y:Math.random() * this.juego.fondo.height};

        const direccion = getUnitVector(this.puntoDeDestino,this.position);

        this.asignarAceleracionNormalizada(direccion.x * this.MultiplicadorDeAceleracion,
                        direccion.y * this.MultiplicadorDeAceleracion);
        
        let probabilidadDeSprite = Math.random();
        if(probabilidadDeSprite < 0.5){
            this.cargarSprite("Assets/Graficos/amoeba1.png",10);
        }
        else{
            this.cargarSprite("Assets/Graficos/amoeba2.png",10);
        }
    }

    update(){
        if(this.slimeMuyCerca()){
            this.huir();
        }
        else{
            this.deambular();
        }
        super.update();
    }
    huir(){
        const direccionDeHuida = getUnitVector(this.juego.slime.position,this.position);
        this.asignarAceleracionNormalizada(
            direccionDeHuida.x * -1 * this.MultiplicadorDeAceleracion,
            direccionDeHuida.y * -1 * this.MultiplicadorDeAceleracion);
    }
    deambular(){
        if(distancia(this.puntoDeDestino,this.position) < 10){
            this.puntoDeDestino = {x:Math.random() * this.juego.fondo.width,
                                   y:Math.random() * this.juego.fondo.height};
        }
        const direccion = getUnitVector(this.puntoDeDestino,this.position);
        this.asignarAceleracionNormalizada(direccion.x * this.MultiplicadorDeAceleracion,
                                           direccion.y * this.MultiplicadorDeAceleracion);
    }

    slimeMuyCerca(){
        if(this.juego.slime === undefined) return false;
        return distancia(this.position,this.juego.slime.position) < this.radioDeEscape;
    }


}