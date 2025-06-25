function getUnitVector(objX, objY, mouseX, mouseY) {
  // Paso 1: Vector dirección
  let dx = mouseX - objX;
  let dy = mouseY - objY;

  // Paso 2: Magnitud (longitud del vector)
  let length = Math.sqrt(dx * dx + dy * dy);

  // Paso 3: Evitar dividir por cero
  if (length === 0) return { x: 0, y: 0 };

  // Paso 4: Normalizar
  return {
    x: dx / length,
    y: dy / length,
  };
}
function getUnitVector(posObj2, posObj) {
  // Paso 1: Vector dirección
  let dx = posObj2.x - posObj.x;
  let dy = posObj2.y - posObj.y;

  // Paso 2: Magnitud (longitud del vector)
  let length = Math.sqrt(dx * dx + dy * dy);

  // Paso 3: Evitar dividir por cero
  if (length === 0) return { x: 0, y: 0 };

  // Paso 4: Normalizar
  return {
    x: dx / length,
    y: dy / length,
  };
}
function vaMuyLento(x, y) {
  return velocidadLinear(x,y) < 0.1;
}
function velocidadLinear(x, y) {
  return Math.sqrt(x * x + y * y);
}
function distancia(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
function distancia(pos1, pos2) {
  return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2);
}
function normalizar(vel){

  let length = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

  if (length === 0) return { x: 0, y: 0 };

  return {
    x: vel.x / length,
    y: vel.y / length,
  };
}
function normalizar(x,y){

  let length = Math.sqrt(x * x + y * y);

  if (length === 0) return { x: 0, y: 0 };

  return {
    x: x / length,
    y: y / length,
  };
}
function clamp(valor, min, max) {
  return Math.max(min, Math.min(max, valor));
}
function limit(vector, max) {
  const magnitudActual = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  
  if (magnitudActual > max && magnitudActual > 0) {
    const ratio = max / magnitudActual;
    return {
      x: vector.x * ratio,
      y: vector.y * ratio
    };
  }
  
  return vector;
}
function vectorSuma(vector1, vector2) {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  };
}
function vectorResta(vector1, vector2) {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y
  };
}
function vectorMultiplicacion(vector, factor) {
  return {
    x: vector.x * factor,
    y: vector.y * factor
  };
}
function vectorDivision(vector, factor) {
  return {
    x: vector.x / factor,
    y: vector.y / factor
  };
}
function setMag(vector, magnitud) {
  // Primero normalizamos el vector (lo convertimos en un vector unitario)
  const vectorNormalizado = normalizar(vector.x, vector.y);
  
  // Luego multiplicamos por la magnitud deseada
  return {
    x: vectorNormalizado.x * magnitud,
    y: vectorNormalizado.y * magnitud
  };
}
function verificarValor(valor,nombre){
  if(!valor){
    console.error(nombre+" es invalida");
  }
}
function distanciaCuadrada(pos1, pos2) {
  return (pos2.x - pos1.x) + (pos2.y - pos1.y);
}
function interpolacionLineal(valorInicial,valorFinal,t){
  return valorInicial + (valorFinal - valorInicial) * t;
}

