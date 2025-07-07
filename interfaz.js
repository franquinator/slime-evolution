let juego = null;
function iniciarJuego() {
    document.getElementById("menu").style.display = "none";
    juego = new Juego();
}

function mostrarOpciones() {
    document.getElementById("panelOpciones").style.display = "block";
}

function mostrarTutorial() {
    document.getElementById("panelTutorial").style.display = "block";
}

function cerrarPanel(id) {
    document.getElementById(id).style.display = "none";
}

function cerrarJuego() {
    alert("Gracias por jugar :)");
    window.close();
}

function volverAlMenu() {
    if (juego) {
        // Detener el juego actual
        juego.app.stop();
        juego = null;
    }
    // Mostrar el menú principal
    document.getElementById("menu").style.display = "block";
    // Limpiar el canvas si existe
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.remove();
    }
}

// Cerrar paneles al hacer clic fuera de ellos
window.onclick = function (event) {
    if (event.target == document.getElementById("panelOpciones")) {
        cerrarPanel("panelOpciones");
    }
    if (event.target == document.getElementById("panelTutorial")) {
        cerrarPanel("panelTutorial");
    }
}