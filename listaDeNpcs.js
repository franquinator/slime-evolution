class Ameba extends NpcPasivo{
    constructor(posX,posY,juego){
        //el 20 es el radio y el 300 es el radio de vision y el 0.3 es la velocidad
        super(posX,posY,20,juego,2,"Virus");
        this.velocidadMax = 5;

        let probabilidadDeSprite = Math.random();
        if(probabilidadDeSprite < 0.5){
            this.cargarSprite2("Assets/Graficos/ameba agua.png",1);
        }
        else{
            this.cargarSprite2("Assets/Graficos/amoeba2.png",1);
        }
        //this.MostrarCollider();
    }
}
class Virus extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,100,juego,2,"Larva");
        this.cargarSprite2("Assets/Graficos/virusPixel.png",2);
        //this.MostrarCollider();
    }
}
class Larva extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,500,juego,1,"Pez");
        this.cargarSprite("Assets/Graficos/larva.png",2);
        //this.MostrarCollider();
    }
    render(){
        super.render();
        if(this.sprite == undefined)return;
        this.sprite.rotation = Math.atan2(-this.vel.y, -this.vel.x);
    }
}
class Pez extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,2500,juego,1,"nadie");
        this.cargarSprite("Assets/Graficos/pezPixel.png",1.5);}
    render(){
        super.render()
        if(this.sprite == undefined)return;
        if(this.vel.x > 0){
            this.container.scale.y = 1;
            this.sprite.rotation = Math.atan2(this.vel.y, this.vel.x);
        }
        else if(this.vel.x < 0){
            this.container.scale.y = -1;
            this.sprite.rotation = Math.atan2(-this.vel.y, this.vel.x);
        }
    }
/*         this.tiempoDesdeUltimoAtaque = 0;
        this.intervaloAtaque = 1000;
        this.territorio = {
            x: posX,
            y: posY,
            radio: 800
        };
    }

    update() {
        const distanciaAlTerritorio = distancia(this.position, this.territorio);
        if (distanciaAlTerritorio < this.territorio.radio) {
            if (this.estaA_DistaciaDe_(this.radioDeEscape, this.juego.slime)) {
                if (this.tiempoDesdeUltimoAtaque <= 0) {
                    this.perseguirA(this.juego.slime);
                    this.tiempoDesdeUltimoAtaque = this.intervaloAtaque;
                } else {
                    this.tiempoDesdeUltimoAtaque -= this.juego.delta;
                }
            }
        } else {
            super.update();
        }
    } */
}
class Gato extends NpcAgresivo {
    constructor(posX, posY, juego) {
        super(posX, posY, 800, juego, 400, 0.5);
        this.cargarSprite("Assets/Graficos/cat.png", 20);
    }
}