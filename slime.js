class Slime{
    constructor(posX,posY,radio,juego){
        this.position = {x:posX, y:posY};

        this.radio = radio; 
        this.juego = juego;

        this.vel = {x:0, y:0};
        this.aceleracion = {x:0, y:0};

        this.velocidadMax = 1;
        this.MultiplicadorDeAceleracion = 0.1;
        this.friccion = 0.90;

    }
    update(){
        this.aplicarAceleracion();
        this.aplicarFriccion();
        this.aplicarVelocidad();
    }
    asignarVelocidad(x,y){
        this.vel.x = x;
        this.vel.y = y;
    }

    asignarAceleracion(x,y){
        this.aceleracion.x = x;
        this.aceleracion.y = y;
    }

    asignarAceleracionNormalizada(x,y){
        const aceleracionNormalizada = normalizar(x,y);
        this.aceleracion.x = x;
        this.aceleracion.y = y;
    }

    asignarVelocidadNormalizada(x,y){
        const velocidadNormalizada = normalizar(x,y);
        //console.log(direcciónNormalizada);
        this.vel.x = velocidadNormalizada.x;
        this.vel.y = velocidadNormalizada.y;
    }

    aplicarAceleracion(){
        if(velocidadLinear(this.vel.x,this.vel.y) < this.velocidadMax){
            this.vel.x += this.aceleracion.x;
            this.vel.y += this.aceleracion.y;
        }
    }
    aplicarVelocidad() {
        const delta = this.juego.delta;
        const tamañoJuego = this.juego.fondo;
    
        this.position.x = clamp(this.position.x + this.vel.x * delta, 0, tamañoJuego.width);
        this.position.y = clamp(this.position.y + this.vel.y * delta, 0, tamañoJuego.height);
    }
    irA(x,y){
        this.position.x = x;
        this.position.y = y;
    }
    frenar(){
        this.vel.x = 0;
        this.vel.y = 0;
        this.aceleracion.x = 0;
        this.aceleracion.y = 0;
    }
    aplicarFriccion(){
        this.vel.x *= this.friccion;
        this.vel.y *= this.friccion;
    }
    render(){
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
    }
    destroy(){
        this.sprite.destroy();
    }
}
class SlimeProta extends Slime{
    //HOLA
    constructor(posX,posY,radio,juego){
        super(posX,posY,radio,juego);

        var graficos = new PIXI.Graphics()
        .circle(0, 0, this.radio)
        .fill({color: 0x00ff00});

        this.sprite = graficos;

        this.juego.worldContainer.addChild(graficos);
        this.sprite.zIndex = 11   
    }
    update(){
        this.asignarFuerzaQueMeLlevaAlMouse();
        super.update();
        this.verifecarColisiones();
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

        this.juego.slimesComidos += 1;
        this.juego.contadorTexto.text =  "Comidos: " + this.juego.slimesComidos;

        this.juego.app.stage.removeChild(comida);
        comida.destroy();
    }
}

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
class SlimeMalo {
    constructor(x, y, radio, juego) {
      this.position = { x, y };
      this.radio = radio;
      this.juego = juego;
  
      this.sprite = new PIXI.Graphics()
        .circle(0, 0, this.radio)
        .fill({ color: 0x0000ff }); // AZUL

      this.sprite.zIndex = 10
  
      this.juego.worldContainer.addChild(this.sprite);   
  
      this.direccion = normalizar(Math.random() * 2 - 1, Math.random() * 2 - 1);
      this.velocidad = 0.7;
    }
  
    update() {
      this.position.x += this.direccion.x * this.juego.delta * this.velocidad;
      this.position.y += this.direccion.y * this.juego.delta * this.velocidad;
  
      // Rebote contra bordes
      if (this.position.x < 0 || this.position.x > this.juego.ancho) this.direccion.x *= -1;
      if (this.position.y < 0 || this.position.y > this.juego.alto) this.direccion.y *= -1;
    }
  
    render() {
      this.sprite.x = this.position.x;
      this.sprite.y = this.position.y;
    }
  
    destroy() {
      this.sprite.destroy();
    }
  }
  