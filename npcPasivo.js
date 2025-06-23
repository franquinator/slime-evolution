class NpcPasivo extends Npc {
    constructor(posX, posY, radio, juego, radioDeVision, velocidadMax) {
        super(posX, posY, radio, juego, radioDeVision, velocidadMax);
        this.vel = { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 };
        this.aceleracion = { x: 0, y: 0 };
        this.velocidadMax = 10;
        this.maxForce = 0.2;
        this.npcsA50Mts = [];
        this.celda = null;
        this.juego.grilla.añadirNpcEnGrilla(this);
    }
    edges() {
        if (this.position.x < 0) this.position.x = this.juego.fondo.width-1;
        if (this.position.x > this.juego.fondo.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = this.juego.fondo.height-1;
        if (this.position.y > this.juego.fondo.height) this.position.y = 0;
    }
    align(boids) {
        let perceptionRadius = 100;
        let steering = { x: 0, y: 0 };
        let total = 0;

/*         for (let other of boids) {
            let d = distancia(this.position, other.position);
            if (other != this && d < perceptionRadius) {

                steering = vectorSuma(steering, other.vel);
                total++;
            }
        } */
        for(let npc of boids){
            if(npc.Dist > 50) continue;
            steering = vectorSuma(steering, npc.Npc.vel);
            total++;
        }

        if (total > 0) {
            steering = vectorDivision(steering, total);
            steering = setMag(steering, this.velocidadMax);
            steering = vectorResta(steering, this.vel);
            steering = limit(steering, this.maxForce);
        }
        return steering;
    }

    separation(boids,perceptionRadius) {
        let steering = { x: 0, y: 0 };
        let total = 0;
/*         for (let other of boids) {
            let d = distancia(this.position, other.position);
            if (other != this && d < perceptionRadius) {
                let diff = vectorResta(this.position, other.position);
                diff = vectorDivision(diff, d * d);
                steering = vectorSuma(steering, diff);
                total++;
            }
        } */
        for(let npc of boids){
            if(npc.Dist > perceptionRadius) continue; //no me separo de los grandes
            let diff = vectorResta(this.position, npc.Npc.position);
            diff = vectorDivision(diff, npc.Dist * npc.Dist);
            steering = vectorSuma(steering, diff);
            total++;
        }

        if (total > 0) {
            steering = vectorDivision(steering, total);
            steering = setMag(steering, this.velocidadMax);
            steering = vectorResta(steering, this.vel);
            steering = limit(steering, this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 100;
        let steering = { x: 0, y: 0 };
        let total = 0;

/*         for (let other of boids) {
            let d = distancia(this.position, other.position);
            if (other != this && d < perceptionRadius) {
                steering = vectorSuma(steering, other.position);
                total++;
            }
        } */
        for(let npc of boids){
            if(npc.Dist > 50) continue;
            steering = vectorSuma(steering, npc.Npc.position);
            total++;
        }

        if (total > 0) {
            steering = vectorDivision(steering, total);
            steering = vectorResta(steering, this.position);
            steering = setMag(steering, this.velocidadMax);
            steering = vectorResta(steering, this.vel);
            steering = limit(steering, this.maxForce);
        }
        return steering;
    }
    escape(slime){
        let perceptionRadius = 400;
        let steering = { x: 0, y: 0 };
        let d = distancia(this.position, slime.position);
        if(d < perceptionRadius){
            //console.log("slime cerca");
            let direccionDeHuida = getUnitVector(slime.position,this.position);
            direccionDeHuida = vectorMultiplicacion(direccionDeHuida, -1);
            //console.log(direccionDeHuida);
            steering = vectorSuma(steering, direccionDeHuida);
        }
        return steering;
    }

    flock(boids) {
        //se puede ver a esto como motivaciones
        //motivacion para alinearse juntarse y separarse

        let alignment = this.align(this.npcsA50Mts);
        let cohesion = this.cohesion(this.npcsA50Mts);
        let separation = this.separation(this.npcsA50Mts,50);
        let escape = this.escape(this.juego.slime);
        let separacionDeGrandes = this.separation(this.npcsMalosParaMiA50mts,400);

        alignment = vectorMultiplicacion(alignment, 1.5);
        cohesion = vectorMultiplicacion(cohesion, 0.5);
        separation = vectorMultiplicacion(separation, 2);
        escape = vectorMultiplicacion(escape, 2);
        separacionDeGrandes = vectorMultiplicacion(separacionDeGrandes, 4);


        this.aceleracion = vectorSuma(this.aceleracion, alignment);
        this.aceleracion = vectorSuma(this.aceleracion, cohesion);
        this.aceleracion = vectorSuma(this.aceleracion, separation);
        this.aceleracion = vectorSuma(this.aceleracion, escape);
        this.aceleracion = vectorSuma(this.aceleracion, separacionDeGrandes);
    }
    recopilarDatos(){
        const distBusqueda = 100;
        
        this.npcsA50Mts = [];
        let celdasA100Mts = this.juego.grilla.obtenerCeldasADistancia(distBusqueda,this.position.x,this.position.y)
        for(let celda of celdasA100Mts){
            for(let npc of celda.entidadesAca){
                let d = distancia(this.position, npc.position);
                if(npc != this && d < distBusqueda){
                        this.npcsA50Mts.push({Npc:npc,Dist:d});
                }
            }
        }

        this.npcsMalosParaMiA50mts = [];
        for(let npc of this.juego.npcManager.todasLasEntidades.get("Virus")){
            let d = distancia(this.position, npc.position);
            if(npc != this && d < 400){
                this.npcsMalosParaMiA50mts.push({Npc:npc,Dist:d});
            }
        }
        /*         for(let npc of this.juego.npcManager.todasLasEntidades){
            let d = distancia(this.position, npc.position);
            if(npc != this && d < 100){
                this.npcsA100Mts.push({Npc:npc,Dist:d});
            }
        } */
    }
    subUpdate() {
        this.position = vectorSuma(this.position, this.vel);

        this.vel = vectorSuma(this.vel, this.aceleracion);

        this.vel = limit(this.vel, this.velocidadMax);

        this.aceleracion = { x: 0, y: 0 };
    }
    update() {
        this.actualizarPosicionEnGrilla();  
        this.recopilarDatos();
        this.flock(this.juego.npcManager.todasLasEntidades);
        this.subUpdate();
        this.edges();
    }
    actualizarPosicionEnGrilla(){
        this.juego.grilla.actualizarNpcEnGrilla(this);
    }
}