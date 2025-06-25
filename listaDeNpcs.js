class Ameba extends NpcPasivo{
    constructor(posX,posY,juego){
        //el 20 es el radio y el 300 es el radio de vision y el 0.3 es la velocidad
        super(posX,posY,20,juego,2,"Virus");
        this.velocidadMax = 5;

        let probabilidadDeSprite = Math.random();
        if(probabilidadDeSprite < 0.5){
            this.cargarSprite2("Assets/Graficos/amoeba1.png",1);
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
        this.cargarSprite2("Assets/Graficos/bacteria1.png",2);
        //this.MostrarCollider();
    }
}
class Larva extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,600,juego,1,"Pez");
        this.cargarSprite("Assets/Graficos/larva.png",2);
        //this.MostrarCollider();
    }
}
class Pez extends NpcAgresivo{
    constructor(posX,posY,juego){
        super(posX,posY,2000,juego,600,0.8);
        this.cargarSprite("Assets/Graficos/pqz.png",500);
        this.tiempoDesdeUltimoAtaque = 0;
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
    }
}
class Gato extends NpcAgresivo {
    constructor(posX, posY, juego) {
        super(posX, posY, 800, juego, 400, 0.5);
        this.cargarSprite("Assets/Graficos/cat.png", 20);
    }
}