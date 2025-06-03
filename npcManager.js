class NpcManager{
    constructor(juego){
      //variables de quadtree
      this.quadtree = new Quadtree({
        x: 0,
        y: 0,
        width: this.ancho * 3,  // o this.fondo.width si ya está cargado
        height: this.alto * 3
      });
  
      //variables de spatial hash
      //this.spatialHash = new SpatialHash(100); // Tamaño de celda de 100 pixels
  
      this.juego = juego;
      this.todasLasEntidades = [];
    }
    update(){
      //this.actualizarSpatialHash();
      for(let i = 0; i < this.todasLasEntidades.length; i++){
        this.todasLasEntidades[i].update();
        this.todasLasEntidades[i].render();
      }
    }
    sacarNpcs(clase) {
      console.log("npc sacados");
      for(let i = 0; i < this.todasLasEntidades.length; i++){
        if(this.todasLasEntidades[i] instanceof clase){
          this.eliminarEntidadEn(i);
          i--;
        }
      }
      console.log(this.todasLasEntidades);
    }
    sacarNpcsNoVisibles(clase){
      for(let i = 0; i < this.todasLasEntidades.length; i++){
        if(this.todasLasEntidades[i] instanceof clase && this.todasLasEntidades[i].visible == false){
          this.eliminarEntidadEn(i);
          i--;
        }
      }
    }
    ponerNpcsEnTodoElMapa(clase, cantidad) {
      this.ponerNpcsEnZona(clase, cantidad, this.juego.fondo.position.x, this.juego.fondo.position.y, this.juego.fondo.width, this.juego.fondo.height);
    }
    ponerNpcsEnZona(clase, cantidad, x, y,ancho,largo) {
      for (let i = 0; i < cantidad; i++) {
        const npcActual = new clase(x + Math.random() * ancho, y + Math.random() * largo, this.juego);
        this.todasLasEntidades.push(npcActual);
      }
    }
    ponerNpcsAlrededorDeCuadrado(clase, cantidad, x, y,ancho,largo) {
      let cantidadDividida = cantidad / 4;
      /*
       _____ _____ _____
      |     |   s der   |
      |s izq|_____ _____|
      |     |     |     |
      |_____|_____|i der|
      |   i izq   |     |
      |_____ _____|_____|
      */     
      //rectangulo superior izquierdo
      this.ponerNpcsEnZona(clase, cantidadDividida, x-ancho, y-largo,ancho,largo * 2);
      //rectangulo superior derecho
      this.ponerNpcsEnZona(clase, cantidadDividida, x, y-largo,ancho * 2,largo);
      //rectangulo inferior izquierdo
      this.ponerNpcsEnZona(clase, cantidadDividida, x-ancho, y+largo,ancho * 2,largo);
      //rectangulo inferior derecho
      this.ponerNpcsEnZona(clase, cantidadDividida, x+ancho, y,ancho,largo *2);
    }
    agregarNpcsEnZonaNoVisible(clase, cantidad) {
      this.ponerNpcsAlrededorDeCuadrado(clase, cantidad, this.juego.fondo.position.x, this.juego.fondo.position.y, this.juego.fondo.width, this.juego.fondo.height);
    }
    obtenerEntidadesCercanasSinOptimizar(entidad, radio) {
      let entidadesCercanas = [];
      for (let i = 0; i < this.todasLasEntidades.length; i++) {
        const entidadActual = this.todasLasEntidades[i];
        if(entidadActual !== entidad && distancia(entidadActual.position, entidad.position) < radio+entidadActual.radio){
          entidadesCercanas.push(entidadActual);
        }
      }
      return entidadesCercanas;
    }
    obtenerEntidadesCercanasQuadtree(entidad, radio) {
      return this.quadtree.entidadesCercanas(entidad, radio);
    }
    obtenerEntidadesCercanasSpatialHash(entidad, radio) {
      return this.spatialHash.entidadesCercanas(entidad, radio);
    }
    actualizarQuadtree() {
      this.quadtree.limpiar();
      for (let entidad of this.todasLasEntidades) {
        this.quadtree.insertar(entidad);
      }
    }
    actualizarSpatialHash() {
      this.spatialHash.limpiar();
      for (const entidad of this.todasLasEntidades) {
        this.spatialHash.actualizarPosicion(entidad);
      }
    }
    hayNpcs(){
      return this.todasLasEntidades.length > 0;
    }
    eliminarEntidad(entidad){
      const index = this.todasLasEntidades.indexOf(entidad);
      this.todasLasEntidades.splice(index, 1);
      this.juego.app.stage.removeChild(entidad);
      entidad.destroy();
    }
    eliminarEntidadEn(index){
      let entidad = this.todasLasEntidades[index];
      
      this.todasLasEntidades.splice(index, 1);
  
      this.juego.app.stage.removeChild(entidad);
      entidad.destroy();
    }
  }