class Quadtree {
  constructor(bounds, nivel = 0, maxObjetos = 10, maxNiveles = 4) {
    this.bounds = bounds; // { x, y, width, height }
    this.nivel = nivel;
    this.maxObjetos = maxObjetos;
    this.maxNiveles = maxNiveles;
    this.objetos = [];
    this.divisiones = []; // subdivisiones del árbol
  }

  limpiar() {
    this.objetos = [];
    for (let div of this.divisiones) {
      if (div) div.limpiar();
    }
    this.divisiones = [];
  }

  dividir() {
    const { x, y, width, height } = this.bounds;
    const mitadW = width / 2;
    const mitadH = height / 2;

    this.divisiones[0] = new Quadtree({ x: x + mitadW, y: y, width: mitadW, height: mitadH }, this.nivel + 1);
    this.divisiones[1] = new Quadtree({ x: x, y: y, width: mitadW, height: mitadH }, this.nivel + 1);
    this.divisiones[2] = new Quadtree({ x: x, y: y + mitadH, width: mitadW, height: mitadH }, this.nivel + 1);
    this.divisiones[3] = new Quadtree({ x: x + mitadW, y: y + mitadH, width: mitadW, height: mitadH }, this.nivel + 1);
  }

  getIndice(obj) {
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

  insertar(obj) {
    if (this.divisiones.length > 0) {
      const indice = this.getIndice(obj);
      if (indice !== -1) {
        this.divisiones[indice].insertar(obj);
        return;
      }
    }

    this.objetos.push(obj);

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

  recuperar(obj, resultado = []) {
    const indice = this.getIndice(obj);
    if (indice !== -1 && this.divisiones.length > 0) {
      this.divisiones[indice].recuperar(obj, resultado);
    }

    resultado.push(...this.objetos);
    return resultado;
  }

  entidadesCercanas(entidad, radio) {
    const resultado = [];
    
    // Verificar si la entidad intersecta con este quadtree
    if (!this.intersectaConCirculo(entidad.position.x, entidad.position.y, radio)) {
      return resultado;
    }

    // Agregar objetos de este nodo que estén dentro del radio
    for (const otraEntidad of this.objetos) {
      if (otraEntidad !== entidad) {
        const distanciaX = entidad.position.x - otraEntidad.position.x;
        const distanciaY = entidad.position.y - otraEntidad.position.y;
        const distanciaTotal = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
        
        if (distanciaTotal < radio + otraEntidad.radio) {
          resultado.push(otraEntidad);
        }
      }
    }

    // Si hay subdivisiones, revisar recursivamente las que intersecten con el círculo
    if (this.divisiones.length > 0) {
      for (const division of this.divisiones) {
        const entidadesDivision = division.entidadesCercanas(entidad, radio);
        resultado.push(...entidadesDivision);
      }
    }

    return resultado;
  }

  intersectaConCirculo(circuloX, circuloY, radio) {
    // Encontrar el punto más cercano del rectángulo al centro del círculo
    const puntoMasCercanoX = Math.max(this.bounds.x, Math.min(circuloX, this.bounds.x + this.bounds.width));
    const puntoMasCercanoY = Math.max(this.bounds.y, Math.min(circuloY, this.bounds.y + this.bounds.height));

    // Calcular la distancia entre el punto más cercano y el centro del círculo
    const distanciaX = circuloX - puntoMasCercanoX;
    const distanciaY = circuloY - puntoMasCercanoY;
    const distanciaCuadrada = distanciaX * distanciaX + distanciaY * distanciaY;

    // Si la distancia es menor que el radio, hay intersección
    return distanciaCuadrada <= radio * radio;
  }
}
