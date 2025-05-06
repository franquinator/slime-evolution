class SlimeProta extends Entidad{
    //HOLA
    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,juego);

        this.cargarSprite("Assets/Graficos/bacteria2.png",10);
    }

    update(){
        //this.moverPupilasHaciaElMouse();
        this.asignarFuerzaQueMeLlevaAlMouse();
        super.update();
        this.verifecarColisiones();
    }

    moverOjos(){
        if(this.juego.mousePos === undefined) return;
        const distanciaAlMouse = distancia(this.position,this.juego.mousePos);
        const direccion = getUnitVector(this.juego.mousePos,this.position);
        const distanciaOjos = this.radio/2 + this.radio/4;
        const distanciaPupilas = this.radio/2 + this.radio/8;
    }


    asignarFuerzaQueMeLlevaAlMouse(){
        this.asignarAceleracion(0,0);
        if(this.juego.mousePos === undefined) return;

        //console.log(this.position,this.juego.mousePos);
        //onsole.log(distancia(this.position,this.juego.mousePos));

        if(distancia(this.juego.centro,this.juego.mousePos) < 50){
            //this.frenar();
            return;
        }

        const fuerza = getUnitVector(
            this.juego.mousePos,
            this.juego.centro
        );

        this.asignarAceleracionNormalizada(fuerza.x * this.MultiplicadorDeAceleracion , fuerza.y * this.MultiplicadorDeAceleracion);
    }
    verifecarColisiones(){
        //this.verificarColisionConSlimesMalos();
        this.verificarColisionesConSlimesTontos();
        this.verificarColisionConSlimesMalos();
    }
    verificarColisionesConSlimesTontos(){
        for (let i = 0; i < this.juego.slimeTontos.length; i++) {
            const slimeTonto = this.juego.slimeTontos[i];
            if(distancia(this.position,slimeTonto.position) < this.radio + slimeTonto.radio){
                this.comer(slimeTonto);
                //console.log("comi un slime tonto");
                this.juego.slimeTontos.splice(i, 1);
                i--;
            }
        }
    }

    verificarColisionConSlimesMalos() {
        for (let i = 0; i < this.juego.slimesMalos.length; i++) {
          const malo = this.juego.slimesMalos[i];
          if (distancia(this.position, malo.position) < this.radio + malo.radio) {
            this.juego.slimesMalos.splice(i, 1);
            malo.destroy();
            this.juego.perderVida();
            break;
          }
        }
      }
    comer(comida){
        var area = Math.PI * this.radio ** 2;
        var area2 = Math.PI * comida.radio ** 2;
        this.radio = Math.sqrt((area + area2) / Math.PI);

        this.sprite.setSize(this.radio * 2);

        //this.juego.alejarCamara();

        this.juego.slimesComidos += 1;
        this.juego.contadorTexto.text =  "Comidos: " + this.juego.slimesComidos;

        this.juego.app.stage.removeChild(comida);
        comida.destroy();
    }
}