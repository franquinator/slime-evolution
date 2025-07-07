class Nivel{
    constructor(listaNpcs,cantidades,npcsParaBorrar,tamaño,tamañoParaProxNivel,juego){
        this.juego = juego;
        this.listaNpcs = listaNpcs
        //la lista de npcs contiene los npcs que habra en el nivel
        this.cantidades = cantidades
        //la cantidad de npcs a agregar
        this.npcsParaBorrar = npcsParaBorrar;
        //una lista del nombre de los npcs a borrar
        this.tamaño = tamaño;
        //el tamaño es que tanto se va a agrandar el mapa y cuanto se va a hacer zoom
        this.tamañoParaProxNivel = tamañoParaProxNivel;
    }
    jugar(){
        for(let nombreNpc of this.npcsParaBorrar){
            this.juego.npcManager.sacarNpcs(nombreNpc);
        }

        let entidades = this.juego.npcManager.obtenerTodasLasEntidades();
        for(let entidad of entidades){
            entidad.dividir(this.tamaño);
        }
        this.juego.slime.dividir(this.tamaño);
        this.juego.camara.hacerZoom(this.tamaño);
        this.juego.fondo.ampliar(this.tamaño);
 
        this.juego.escalaDeJuego *= this.tamaño;
        for (let i = 0; i < this.listaNpcs.length; i++) {
             this.juego.npcManager.ponerNpcsEnTodoElMapa(this.listaNpcs[i],this.cantidades[i]);
            
        }
    }
}