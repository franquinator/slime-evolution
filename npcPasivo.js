class NpcPasivo extends Npc {
    constructor(posX, posY, radio, juego, velocidadMax,Enemigo) {
        super(posX, posY, radio, juego, velocidadMax);
        this.vel = { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 };
        this.aceleracion = { x: 0, y: 0 };
        this.velocidadMax = 10;
        this.maxForce = 0.2;
        this.npcsA100Mts = [];
        this.celda = null;
        this.juego.grilla.añadirNpcEnGrilla(this);
        this.Enemigo = Enemigo;
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
    
    escape(slime,radio){
        let perceptionRadius = radio;
        let steering = { x: 0, y: 0 };
        let d = distancia(this.position, slime.position);
        if(d < perceptionRadius + slime.radio){
            //console.log("slime cerca");
            let direccionDeHuida = getUnitVector(slime.position,this.position);
            direccionDeHuida = vectorMultiplicacion(direccionDeHuida, -1);
            //console.log(direccionDeHuida);
            steering = vectorSuma(steering, direccionDeHuida);
        }
        return steering;
    }
    persecucion(slime,radio){
        let perceptionRadius = radio;
        let steering = { x: 0, y: 0 };
        let d = distancia(this.position, slime.position);
        if(d < perceptionRadius + slime.radio){
            //console.log("slime cerca");
            let direccionDeHuida = getUnitVector(slime.position,this.position);
            //console.log(direccionDeHuida);
            steering = vectorSuma(steering, direccionDeHuida);
        }
        return steering;
    }

    comportamiento() {
        //se puede ver a esto como motivaciones
        //motivacion para alinearse juntarse y separarse

        this.aplicarAlineacion(this.npcsA100Mts,1.5);
        this.aplicarCohesion(this.npcsA100Mts,0.5);
        this.aplicarSeparacion(this.npcsA100Mts,2,50);
        this.aplicarSeparacion(this.npcsMalosParaMiA50mts,4,400);


        if(this.radio > this.juego.slime.radio){
            this.aplicarPersecucion(this.juego.slime,.5,600)
        }
        else{
            this.aplicarEscape(this.juego.slime,2,400)
        }
    }

    aplicarAlineacion(boids,potencia){
        let alignment = this.align(boids);
        alignment = vectorMultiplicacion(alignment, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, alignment);
    }
    aplicarCohesion(boids,potencia){
        let cohesion = this.cohesion(boids);
        cohesion = vectorMultiplicacion(cohesion, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, cohesion);
    }
    aplicarSeparacion(boids,potencia,radio){
        let separation = this.separation(boids,radio);
        separation = vectorMultiplicacion(separation, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, separation);
    }
    aplicarEscape(unBoid,potencia,radio){
        let escape = this.escape(unBoid,radio);
        escape = vectorMultiplicacion(escape, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, escape);
    }
    aplicarPersecucion(unBoid,potencia,radio){
        let persecucion = this.persecucion(unBoid,radio);
        persecucion = vectorMultiplicacion(persecucion, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, persecucion);
    }

    recopilarDatos(){
        const distBusqueda = 100;
        
        this.npcsA100Mts = [];
        let npcsEnCeldasA100Mts = this.juego.grilla.obtenerNpsADistancia(distBusqueda,this)
        
        for(let npc of npcsEnCeldasA100Mts){
            let d = distancia(this.position, npc.position);
            if(npc != this && d < distBusqueda){
                    this.npcsA100Mts.push({Npc:npc,Dist:d});
            }
        }

        this.npcsMalosParaMiA50mts = [];
        for(let npc of this.juego.npcManager.obtenerGrupoDeEntidades(this.Enemigo)){
            let d = distancia(this.position, npc.position);
            if(npc != this && d < 400){
                this.npcsMalosParaMiA50mts.push({Npc:npc,Dist:d});
            }
        }
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
        this.comportamiento();
        this.subUpdate();
        this.edges();
    }

    actualizarPosicionEnGrilla(){
        this.juego.grilla.actualizarNpcEnGrilla(this);
    }
    dividir(veces){
        super.dividir(veces);
    }
}