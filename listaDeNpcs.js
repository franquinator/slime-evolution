class Ameba extends NpcPasivo{
    constructor(posX,posY,juego){
        //el 20 es el radio y el 300 es el radio de vision y el 0.3 es la velocidad
        super(posX,posY,20,juego,300,0.3);

        this.cargarSprite2("Assets/Graficos/ameba agua.png",10);
        //this.MostrarCollider();
    }
}
class Virus extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,100,juego,300,0.3);
        this.cargarSprite("Assets/Graficos/virusPixel.png",40);
        //this.MostrarCollider();
    }
}
class Larva extends NpcAgresivo{
    constructor(posX,posY,juego){
        super(posX,posY,700,juego,350,0.5);
        this.cargarSprite("Assets/Graficos/larva.png",500);
        //this.MostrarCollider();
    }
}
class Pez extends NpcAgresivo{
    constructor(posX,posY,juego){
        super(posX,posY,2000,juego,600,0.8);
        this.cargarSprite("Assets/Graficos/pezPixel.png",500);
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