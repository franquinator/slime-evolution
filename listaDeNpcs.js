class Ameba extends NpcPasivo{
    constructor(posX,posY,juego){
        //el 20 es el radio y el 300 es el radio de vision y el 0.3 es la velocidad
        super(posX,posY,20,10,juego,"Virus");
        this.velocidadMax = 5;

        let probabilidadDeSprite = Math.random();
        if(probabilidadDeSprite < 0.5){
            this.cargarSprite("amebaAgua",1);
        }
        else{
            this.cargarSprite("amebaAmarilla",1);
        }
        //this.MostrarCollider();
    }
}
class Virus extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,100,10,juego,"Larva");
        this.cargarSprite("virus",2);
        //this.MostrarCollider();
    }
}
class Larva extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,500,10,juego,"Pez");
        this.cargarSprite("larva",2);
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
        super(posX,posY,2500,10,juego,"nadie");
        this.cargarSprite("pez",1.5);}
    
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
}

class Tiburon extends NpcPasivo{
    constructor(posX,posY,juego){
        super(posX,posY,20000,20,juego,"nadie");
        this.cargarSprite("tiburon",2);
        // Configurar rango de ataque más grande
        this.alcanceDePersecucion = 10000; // 10000 unidades de rango
        this.multDePerseguir = 2; // Más agresivo
    }
    
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
}