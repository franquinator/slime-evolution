class SpatialHash {
    constructor(tamanioCelda = 100) {
        this.tamanioCelda = tamanioCelda;
        this.celdas = new Map(); // Map para almacenar las entidades en cada celda
    }

    // Función para obtener la clave de la celda basada en las coordenadas
    obtenerClaveCelda(x, y) {
        const celdaX = Math.floor(x / this.tamanioCelda);
        const celdaY = Math.floor(y / this.tamanioCelda);
        return `${celdaX},${celdaY}`;
    }

    // Obtener todas las claves de celdas que una entidad ocupa
    obtenerClavesCeldasEntidad(entidad) {
        const claves = new Set();
        
        // Calcular las celdas que el círculo de la entidad podría ocupar
        const minX = entidad.position.x - entidad.radio;
        const maxX = entidad.position.x + entidad.radio;
        const minY = entidad.position.y - entidad.radio;
        const maxY = entidad.position.y + entidad.radio;

        const celdaMinX = Math.floor(minX / this.tamanioCelda);
        const celdaMaxX = Math.floor(maxX / this.tamanioCelda);
        const celdaMinY = Math.floor(minY / this.tamanioCelda);
        const celdaMaxY = Math.floor(maxY / this.tamanioCelda);

        // Agregar todas las claves de celdas que la entidad ocupa
        for (let x = celdaMinX; x <= celdaMaxX; x++) {
            for (let y = celdaMinY; y <= celdaMaxY; y++) {
                claves.add(`${x},${y}`);
            }
        }

        return claves;
    }

    // Limpiar todas las celdas
    limpiar() {
        this.celdas.clear();
    }

    // Insertar una entidad en el spatial hash
    insertar(entidad) {
        const clavesCeldas = this.obtenerClavesCeldasEntidad(entidad);
        
        for (const clave of clavesCeldas) {
            if (!this.celdas.has(clave)) {
                this.celdas.set(clave, new Set());
            }
            this.celdas.get(clave).add(entidad);
        }
    }

    // Encontrar entidades cercanas a una entidad dada
    entidadesCercanas(entidad, radio) {
        const resultado = new Set();
        const clavesCeldas = this.obtenerClavesCeldasEntidad(entidad);

        // Revisar todas las celdas que la entidad ocupa
        for (const clave of clavesCeldas) {
            const celda = this.celdas.get(clave);
            if (!celda) continue;

            // Revisar cada entidad en la celda
            for (const otraEntidad of celda) {
                if (otraEntidad !== entidad && !resultado.has(otraEntidad)) {
                    const distanciaX = entidad.position.x - otraEntidad.position.x;
                    const distanciaY = entidad.position.y - otraEntidad.position.y;
                    const distanciaTotal = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

                    if (distanciaTotal < radio + otraEntidad.radio) {
                        resultado.add(otraEntidad);
                    }
                }
            }
        }

        return Array.from(resultado);
    }

    // Actualizar la posición de una entidad
    actualizarPosicion(entidad, antiguaPosicion) {
        // Si hay una posición antigua, primero removemos la entidad de sus celdas anteriores
        if (antiguaPosicion) {
            const antiguasClaves = this.obtenerClavesCeldasEntidad({
                position: antiguaPosicion,
                radio: entidad.radio
            });

            for (const clave of antiguasClaves) {
                const celda = this.celdas.get(clave);
                if (celda) {
                    celda.delete(entidad);
                    if (celda.size === 0) {
                        this.celdas.delete(clave);
                    }
                }
            }
        }

        // Insertar la entidad en sus nuevas celdas
        this.insertar(entidad);
    }

    // Remover una entidad del spatial hash
    remover(entidad) {
        const clavesCeldas = this.obtenerClavesCeldasEntidad(entidad);

        for (const clave of clavesCeldas) {
            const celda = this.celdas.get(clave);
            if (celda) {
                celda.delete(entidad);
                if (celda.size === 0) {
                    this.celdas.delete(clave);
                }
            }
        }
    }
} 