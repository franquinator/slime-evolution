class Grilla {
    constructor(juego, anchoCelda) {
        this.juego = juego;
        this.anchoCelda = anchoCelda;
        this.celdaALoAncho = Math.ceil(this.juego.tamanioBase / this.anchoCelda);
        this.celdaALoAlto = Math.ceil(this.juego.tamanioBase / this.anchoCelda);

        this.celdas = {};

        this.initGrilla();
    }
    initGrilla() {
        for (let x = 0; x < this.celdaALoAncho; x++) {
        for (let y = 0; y < this.celdaALoAlto; y++) {
            const celda = new Celda(this.juego, this.anchoCelda, x, y);
            const hash = this.obtenerHashDePosicion(x, y);
            this.celdas[hash] = celda;
        }
        }
        console.log("grilla inicializada", this.celdas);
    }
    añadirNpcEnGrilla(npc){
        const celda = this.obtenerCeldaEnPosicion(npc.position.x, npc.position.y);
        celda.agregame(npc);
    }
    actualizarNpcEnGrilla(npc){
        const celda = this.obtenerCeldaEnPosicion(npc.position.x, npc.position.y);
        if(npc.celda != celda){
            npc.celda.sacame(npc);
            celda.agregame(npc);
        }
    }

    obtenerHashDePosicion(x, y) {
        return "x_" + x + "_y_" + y;
    }

    obtenerCeldaEnPosicion(x, y) {
        const nuevaX = Math.floor(x / this.anchoCelda);
        const nuevaY = Math.floor(y / this.anchoCelda);
        const hash = this.obtenerHashDePosicion(nuevaX, nuevaY);

        let celda = this.celdas[hash];

        if (!celda) {
            console.error("la celda no existe en la posicion X:"+nuevaX+" Y:"+nuevaY);
            
        // console.log("nueva celda", nuevaX, nuevaY);
            /* celda = this.celdas[hash] = new Celda(
                this.juego,
                this.anchoCelda,
                nuevaX,
                nuevaY
            ); */
        }

        return celda;
    }
    obtenerCeldasADistancia(distancia,x,y){ 
        let celdas = [];
        let distXMin = this.calcularPosMinFormatoCelda(x-distancia);
        let distYMin = this.calcularPosMinFormatoCelda(y-distancia);

        let distXMax = this.calcularPosMaxFormatoCelda(x+distancia);
        let distYMax = this.calcularPosMaxFormatoCelda(y+distancia);
        for(let x = distXMin; x < distXMax; x++){
            for(let y = distYMin; y < distYMax; y++){
                celdas.push(this.celdas["x_" + x + "_y_" + y]);
            }
        }
        return celdas;
    }
    calcularPosMinFormatoCelda(num){
        let dist = num;
        dist =  Math.floor(dist / this.anchoCelda);
        dist = Math.max(0,dist);
        return(dist);
    }
    calcularPosMaxFormatoCelda(num){
        let dist = num;
        dist =  Math.ceil(dist / this.anchoCelda);
        dist = Math.min(this.celdaALoAncho,dist);
        return(dist);
    }
    obtenerNpsADistancia(distancia,npcIn){
        let nps = [];
        for(let celda of this.celdas){
            for(let npc of celda.entidadesAca){
                if(npc != npc && distancia(npcIn.position, npc.position) < distancia){
                    nps.push(npc);
                }
            }   
        }
        return nps;
    }
    test(){
        //al estar en 0 0 con distancia de 200 solo devuelve 1 celda
        let celdasTest = this.obtenerCeldasADistancia(200,0,0);
        assertEquals(1,celdasTest.length);

        //al estar en medio de una celda cerca de 0 0 solo devuelve 2 celdas 
        celdasTest = this.obtenerCeldasADistancia(200,100,0);
        assertEquals(2,celdasTest.length);

        //al estar entre dos celdas devuelve 2 en y 0
        celdasTest = this.obtenerCeldasADistancia(200,200,0);
        assertEquals(2,celdasTest.length);

        //al estar en medio de una celda devuelve 3 en y 0
        celdasTest = this.obtenerCeldasADistancia(200,300,0);
        assertEquals(3,celdasTest.length);

        //al estar entre dos celdadas devuelve 2 
        celdasTest = this.obtenerCeldasADistancia(200,400,0);
        assertEquals(2,celdasTest.length);

        //al estar entre 4 celdas devuelve 4
        celdasTest = this.obtenerCeldasADistancia(200,400,400);
        assertEquals(4,celdasTest.length);

        //al estar fuera de la pantalla devuelve 1 celda
        celdasTest = this.obtenerCeldasADistancia(200,3000,3000);
        assertEquals(1,celdasTest.length);
    }
}  