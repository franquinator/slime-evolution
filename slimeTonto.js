class SlimeTonto extends Slime{

    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,juego);

        this.velocidadMax = 0.8;
        this.radioDeEscape = 300;

        this.puntoDeDestino = {x:Math.random() * this.juego.fondo.width,
            y:Math.random() * this.juego.fondo.height};

        const direccion = getUnitVector(this.puntoDeDestino,this.position);

        this.asignarAceleracionNormalizada(direccion.x * this.MultiplicadorDeAceleracion,
                        direccion.y * this.MultiplicadorDeAceleracion);
        const graficos = new PIXI.Graphics()
        .circle(0, 0, this.radio)
        .fill({color: 0xff0000});

        this.sprite = graficos;
        this.sprite.zIndex = 9;

        this.juego.worldContainer.addChild(graficos);  
    }

    update(){
        if(this.slimeMuyCerca()){
            console.log("huyo");
            this.huir();
        }
        else{
            console.log("deambulo");
            this.deambular();
        }
        super.update();
    }
    irA(x,y){
        this.puntoDeDestino.x = x;
        this.puntoDeDestino.y = y;
    }
    huir(){
        const direccionDeHuida = getUnitVector(this.juego.slime.position,this.position);
        this.asignarAceleracionNormalizada(
            direccionDeHuida.x * -1 * this.MultiplicadorDeAceleracion,
            direccionDeHuida.y * -1 * this.MultiplicadorDeAceleracion);
    }
    deambular(){
        if(distancia(this.puntoDeDestino,this.position) < 10){
            console.log("llegue");
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