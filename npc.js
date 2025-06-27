class Npc extends Entidad {
    constructor(posX, posY, radio, velocidadMax, juego) {
        super(posX, posY, radio, velocidadMax, juego);

        this.celda = null;
        this.juego.grilla.añadirNpcEnGrilla(this);
    }
    aplicarAlineacion(boids, potencia) {
        let fuerzaDeAlign = this.align(boids);
        fuerzaDeAlign = vectorMultiplicacion(fuerzaDeAlign, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, fuerzaDeAlign);
    }

    aplicarCohesion(boids, potencia) {
        let fuerzaDeCohesion = this.cohesion(boids);
        fuerzaDeCohesion = vectorMultiplicacion(fuerzaDeCohesion, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, fuerzaDeCohesion);
    }

    aplicarSeparacion(boids, potencia) {
        let fuerzaDeSeparacion = this.separation(boids);
        fuerzaDeSeparacion = vectorMultiplicacion(fuerzaDeSeparacion, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, fuerzaDeSeparacion);
    }

    aplicarEscape(unBoid, potencia, radio) {
        let fuerzaDeEscape = this.escape(unBoid, radio);
        fuerzaDeEscape = vectorMultiplicacion(fuerzaDeEscape, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, fuerzaDeEscape);
    }

    aplicarPersecucion(unBoid, potencia, radio) {
        let fuerzaDePersecucion = this.persecucion(unBoid, radio);
        fuerzaDePersecucion = vectorMultiplicacion(fuerzaDePersecucion, potencia);
        this.aceleracion = vectorSuma(this.aceleracion, fuerzaDePersecucion);
    }

    align(boids) {
        let steering = { x: 0, y: 0 };
        let total = 0;
        
        for (let npc of boids) {
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

    separation(boids) {
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let npc of boids) {
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
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let npc of boids) {
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

    escape(slime, radio) {
        verificarValor(slime, "slime");
        verificarNumero(radio, "radio");
        
        let perceptionRadius = radio + slime.radio;
        let steering = { x: 0, y: 0 };
        let d = distancia(this.position, slime.position);
        if (d < perceptionRadius) {
            //console.log("slime cerca");
            let direccionDeHuida = getUnitVector(slime.position, this.position);
            direccionDeHuida = vectorMultiplicacion(direccionDeHuida, -1);
            //console.log(direccionDeHuida);
            steering = vectorSuma(steering, direccionDeHuida);
        }
        return steering;
    }

    persecucion(slime, radio) {
        let perceptionRadius = radio;
        let steering = { x: 0, y: 0 };
        let d = distancia(this.position, slime.position);
        if (d < perceptionRadius + slime.radio) {
            //console.log("slime cerca");
            let direccionDeHuida = getUnitVector(slime.position, this.position);
            //console.log(direccionDeHuida);
            steering = vectorSuma(steering, direccionDeHuida);
        }
        return steering;
    }

    actualizarPosicionEnGrilla(){
        this.juego.grilla.actualizarNpcEnGrilla(this);
    }
    destroy(){
        this.celda.sacarNpc(this);
        super.destroy();
    }
}