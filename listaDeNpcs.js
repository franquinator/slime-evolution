class Ameba extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,20,juego,300,0.5);

        let probabilidadDeSprite = Math.random();
        if(probabilidadDeSprite < 0.5){
            this.cargarSprite("Assets/Graficos/amoeba1.png",10);
        }
        else{
            this.cargarSprite("Assets/Graficos/amoeba2.png",10);
        }
    }
}
class Virus extends NpcAgresivo{
    constructor(posX,posY,juego){
        super(posX,posY,80,juego,300,0.3);
        this.cargarSprite("Assets/Graficos/bacteria1.png",40);
    }
}
class Gato extends NpcAgresivo {
    constructor(posX, posY, juego) {
        super(posX, posY, 200, juego, 250, 0.4);
        this.cargarSprite("Assets/Graficos/cat.png", 20);
    }

}