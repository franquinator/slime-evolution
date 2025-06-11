class NpcPasivo extends Npc {
    constructor(posX, posY, radio, juego, radioDeVision, velocidadMax) {
        super(posX, posY, radio, juego, radioDeVision, velocidadMax);
        this.vel = { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 };
        this.aceleracion = { x: 0, y: 0 };
        this.velocidadMax = 20;
        this.maxForce = 0.2;
    }
    edges() {
        if (this.position.x < 0) this.position.x = this.juego.fondo.width;
        if (this.position.x > this.juego.fondo.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = this.juego.fondo.height;
        if (this.position.y > this.juego.fondo.height) this.position.y = 0;
    }
    align(boids) {
        let perceptionRadius = 100;
        let steering = { x: 0, y: 0 };
        let total = 0;

        for (let other of boids) {
            let d = distancia(this.position, other.position);
            if (other != this && d < perceptionRadius) {

                steering = vectorSuma(steering, other.vel);
                total++;
            }
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
        let perceptionRadius = 100;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = distancia(this.position, other.position);
            if (other != this && d < perceptionRadius) {
                let diff = vectorResta(this.position, other.position);
                diff = vectorDivision(diff, d * d);
                steering = vectorSuma(steering, diff);
                total++;
            }
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

        for (let other of boids) {
            let d = distancia(this.position, other.position);
            if (other != this && d < perceptionRadius) {
                steering = vectorSuma(steering, other.position);
                total++;
            }
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

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment = vectorMultiplicacion(alignment, 0.2);
        cohesion = vectorMultiplicacion(cohesion, 0.2);
        separation = vectorMultiplicacion(separation, 0.6);


        this.aceleracion = vectorSuma(this.aceleracion, alignment);
        this.aceleracion = vectorSuma(this.aceleracion, cohesion);
        this.aceleracion = vectorSuma(this.aceleracion, separation);
    }
    subUpdate() {
        this.position = vectorSuma(this.position, this.vel);

        this.vel = vectorSuma(this.vel, this.aceleracion);

        this.vel = limit(this.vel, this.velocidadMax);

        this.aceleracion = { x: 0, y: 0 };
    }
    update() {
        this.edges();
        this.flock(this.juego.npcManager.todasLasEntidades);
        this.subUpdate();
    }
}