class Ameba extends NpcPasivo{
    constructor(posX,posY,juego){
        //el 20 es el radio y el 300 es el radio de vision y el 0.3 es la velocidad
        super(posX,posY,20,juego,300,0.3);

        let probabilidadDeSprite = Math.random();
        if(probabilidadDeSprite < 0.5){
            this.cargarSprite2("Assets/Graficos/amoeba1.png",10);
        }
        else{
            this.cargarSprite2("Assets/Graficos/amoeba2.png",10);
        }
        this.MostrarCollider();
    }
}
class Virus extends NpcAgresivo{
    constructor(posX,posY,juego){
        super(posX,posY,100,juego,300,0.3);
        this.cargarSprite("Assets/Graficos/bacteria1.png",40);
        this.MostrarCollider();
    }
}
class Larva extends NpcAgresivo{
    constructor(posX,posY,juego){
        super(posX,posY,500,juego,200,0.3);
        this.cargarSprite("Assets/Graficos/larva.png",500);
        this.MostrarCollider();
    }
}
class Pez extends NpcAgresivo{
    constructor(posX,posY,juego){
        super(posX,posY,2000,juego,200,0.3);
        this.cargarSprite("Assets/Graficos/pqz.png",500);
        this.MostrarCollider();
    }
}
class Gato extends NpcAgresivo {
    constructor(posX, posY, juego) {
        super(posX, posY, 600, juego, 250, 0.3);
        this.cargarSprite("Assets/Graficos/cat.png", 20);
    }
}