class Quadtree {
  /**
   * Crea una nueva instancia de Quadtree
   * @param {Object} bounds - Límites del quadtree {x, y, width, height}
   * @param {number} nivel - Nivel actual del nodo
   * @param {number} maxObjetos - Máximo de objetos antes de dividir
   * @param {number} maxNiveles - Máximo de niveles de profundidad
   */
  constructor(bounds, nivel = 0, maxObjetos = 10, maxNiveles = 4) {
    if (!bounds || typeof bounds.x !== 'number' || typeof bounds.y !== 'number' || 
        typeof bounds.width !== 'number' || typeof bounds.height !== 'number') {
      throw new Error('Bounds inválidos. Debe ser un objeto con x, y, width y height numéricos');
    }

    this.bounds = bounds;
    this.nivel = nivel;
    this.maxObjetos = maxObjetos;
    this.maxNiveles = maxNiveles;
    this.objetos = [];
    this.divisiones = [];
    this._objetosTotales = 0;
  }

  /**
   * Limpia el quadtree y sus subdivisiones
   */
  limpiar() {
    this.objetos = [];
    this._objetosTotales = 0;
    for (let div of this.divisiones) {
      if (div) div.limpiar();
    }
    this.divisiones = [];
  }

  /**
   * Divide el quadtree en cuatro subdivisiones
   * @private
   */
  dividir() {
    const { x, y, width, height } = this.bounds;
    const mitadW = width / 2;
    const mitadH = height / 2;

    // Crear las cuatro subdivisiones
    this.divisiones = [
      new Quadtree({ x: x + mitadW, y: y, width: mitadW, height: mitadH }, this.nivel + 1, this.maxObjetos, this.maxNiveles),
      new Quadtree({ x: x, y: y, width: mitadW, height: mitadH }, this.nivel + 1, this.maxObjetos, this.maxNiveles),
      new Quadtree({ x: x, y: y + mitadH, width: mitadW, height: mitadH }, this.nivel + 1, this.maxObjetos, this.maxNiveles),
      new Quadtree({ x: x + mitadW, y: y + mitadH, width: mitadW, height: mitadH }, this.nivel + 1, this.maxObjetos, this.maxNiveles)
    ];
  }

  /**
   * Obtiene el índice de la subdivisión donde debería ir el objeto
   * @param {Object} obj - Objeto a insertar
   * @returns {number} Índice de la subdivisión (-1 si no cabe en ninguna)
   * @private
   */
  getIndice(obj) {
    if (!obj || !obj.position || typeof obj.radio !== 'number') {
      throw new Error('Objeto inválido. Debe tener position y radio');
    }

    const verticalMid = this.bounds.x + this.bounds.width / 2;
    const horizontalMid = this.bounds.y + this.bounds.height / 2;

    const arriba = obj.position.y + obj.radio < horizontalMid;
    const abajo = obj.position.y - obj.radio > horizontalMid;
    const izquierda = obj.position.x + obj.radio < verticalMid;
    const derecha = obj.position.x - obj.radio > verticalMid;

    if (arriba) {
      if (derecha) return 0;
      else if (izquierda) return 1;
    } else if (abajo) {
      if (izquierda) return 2;
      else if (derecha) return 3;
    }

    return -1;
  }

  /**
   * Inserta un objeto en el quadtree
   * @param {Object} obj - Objeto a insertar
   */
  insertar(obj) {
    if (this.divisiones.length > 0) {
      const indice = this.getIndice(obj);
      if (indice !== -1) {
        this.divisiones[indice].insertar(obj);
        this._objetosTotales++;
        return;
      }
    }

    this.objetos.push(obj);
    this._objetosTotales++;

    if (this.objetos.length > this.maxObjetos && this.nivel < this.maxNiveles) {
      if (this.divisiones.length === 0) this.dividir();

      let i = 0;
      while (i < this.objetos.length) {
        const indice = this.getIndice(this.objetos[i]);
        if (indice !== -1) {
          const obj = this.objetos.splice(i, 1)[0];
          this.divisiones[indice].insertar(obj);
        } else {
          i++;
        }
      }
    }
  }

  /**
   * Recupera todos los objetos que podrían colisionar con el objeto dado
   * @param {Object} obj - Objeto a verificar
   * @param {Array} resultado - Array donde se almacenarán los resultados
   * @returns {Array} Array con los objetos que podrían colisionar
   */
  recuperar(obj, resultado = []) {
    const indice = this.getIndice(obj);
    if (indice !== -1 && this.divisiones.length > 0) {
      this.divisiones[indice].recuperar(obj, resultado);
    }

    resultado.push(...this.objetos);
    return resultado;
  }

  /**
   * Encuentra todas las entidades cercanas a una entidad dada dentro de un radio
   * @param {Object} entidad - Entidad a verificar
   * @param {number} radio - Radio de búsqueda
   * @returns {Array} Array con las entidades cercanas
   */
  entidadesCercanas(entidad, radio) {
    if (!entidad || !entidad.position || typeof radio !== 'number') {
      throw new Error('Parámetros inválidos para entidadesCercanas');
    }

    const resultado = [];
    
    if (!this.intersectaConCirculo(entidad.position.x, entidad.position.y, radio)) {
      return resultado;
    }

    // Optimización: usar distancia cuadrada en lugar de raíz cuadrada
    const radioCuadrado = radio * radio;
    
    for (const otraEntidad of this.objetos) {
      if (otraEntidad !== entidad) {
        const distanciaX = entidad.position.x - otraEntidad.position.x;
        const distanciaY = entidad.position.y - otraEntidad.position.y;
        const distanciaCuadrada = distanciaX * distanciaX + distanciaY * distanciaY;
        
        if (distanciaCuadrada < (radio + otraEntidad.radio) * (radio + otraEntidad.radio)) {
          resultado.push(otraEntidad);
        }
      }
    }

    if (this.divisiones.length > 0) {
      for (const division of this.divisiones) {
        resultado.push(...division.entidadesCercanas(entidad, radio));
      }
    }

    return resultado;
  }

  /**
   * Verifica si un círculo intersecta con el rectángulo del quadtree
   * @param {number} circuloX - Coordenada X del centro del círculo
   * @param {number} circuloY - Coordenada Y del centro del círculo
   * @param {number} radio - Radio del círculo
   * @returns {boolean} true si hay intersección
   * @private
   */
  intersectaConCirculo(circuloX, circuloY, radio) {
    const puntoMasCercanoX = Math.max(this.bounds.x, Math.min(circuloX, this.bounds.x + this.bounds.width));
    const puntoMasCercanoY = Math.max(this.bounds.y, Math.min(circuloY, this.bounds.y + this.bounds.height));

    const distanciaX = circuloX - puntoMasCercanoX;
    const distanciaY = circuloY - puntoMasCercanoY;
    const distanciaCuadrada = distanciaX * distanciaX + distanciaY * distanciaY;

    return distanciaCuadrada <= radio * radio;
  }

  /**
   * Obtiene el número total de objetos en el quadtree
   * @returns {number} Número total de objetos
   */
  getObjetosTotales() {
    return this._objetosTotales;
  }
}
