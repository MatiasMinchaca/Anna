const MIN_OBSTACLE_TIME = 1.5;
const MAX_OBSTACLE_TIME = 2;
const MIN_CLOUD_TIME = 0.7;
const MAX_CLOUD_TIME = 2.7;
const GRAVITY = 2500;
const IMPULSE = 900;
const VELOCITY_FACTOR = 1280 / 3;
const INITIAL_VELOCITY = 1;

// Variables globales
var time = new Date();
var deltaTime = 0;
var sueloY = 22;
var velY = 0;
var impulso = IMPULSE;
var gravedad = GRAVITY;
var dinoPosX = 42;
var dinoPosY = sueloY;
var sueloX = 0;
var velEscenario = VELOCITY_FACTOR;
var gameVel = INITIAL_VELOCITY;
var score = 0;
var parado = false;
var saltando = false;
var tiempoHastaObstaculo = 2;
var tiempoHastaNube = 0.5;
var obstaculos = [];
var nubes = [];
var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;
var gameRestartButton;
var velNube = 0.5;

// Eventos de carga
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}

// Manejadores de eventos
document.addEventListener("keydown", HandleKeyDown);
document.addEventListener("click", HandleScreenTouch);

// Función Init
function Init() {
    time = new Date();
    Start();
    Loop();
}

// Función Loop
function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

// Función Start
function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    gameRestartButton = document.getElementById('restartButton');
}

// Función Update
function Update() {
    if (parado) return;
    
    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

// Función HandleKeyDown
function HandleKeyDown(ev) {
    if (ev.keyCode == 32) {
        Saltar();
    }
}

// Función HandleScreenTouch
function HandleScreenTouch() {
    Saltar();
}

// Función Saltar
function Saltar() {
    if (dinoPosY === sueloY) {
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}

// Función MoverDinosaurio
function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if (dinoPosY < sueloY) {
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY + "px";
}

// Función TocarSuelo
function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if (saltando) {
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

// Función MoverSuelo
function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

// Función CalcularDesplazamiento
function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

// Función Estrellarse
function Estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    parado = true;
}

// Función DecidirCrearObstaculos
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

// Función DecidirCrearNubes
function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

// Función CrearObstaculo
function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = MIN_OBSTACLE_TIME + Math.random() * (MAX_OBSTACLE_TIME - MIN_OBSTACLE_TIME) / gameVel;
}

// Función CrearNube
function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = Math.floor(Math.random() * (270 - 100 + 1) + 100) + "px";
    
    nubes.push(nube);
    tiempoHastaNube = MIN_CLOUD_TIME + Math.random() * (MAX_CLOUD_TIME - MIN_CLOUD_TIME) / gameVel;
}

// Función MoverObstaculos
function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

// Función MoverNubes
function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

// Función GanarPuntos
function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if (score == 5) {
        gameVel = 1.2;
        contenedor.classList.add("mediodia");
    } else if (score == 10) {
        gameVel = 1.7;
        contenedor.classList.add("tarde");
    } else if (score == 20) {
        gameVel = 2;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3 / gameVel) + "s";
}

// Función GameOver
function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
    gameRestartButton.style.display = "flex";
}

// Función DetectarColision
function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            // EVADE
            break; // al estar en orden, no puede chocar con más
        } else {
            if (IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

// Función IsCollision
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

// Agrega el evento de clic al botón de reinicio
document.getElementById('restartButton').addEventListener('click', RestartGame);

// Función para reiniciar el juego
function RestartGame() {
    // Restablece las variables del juego a sus valores iniciales
    parado = false;
    gameOver.style.display = "none"; // Oculta el mensaje de game over
    gameRestartButton.style.display = "none"; // Oculta el botón de reinicio
    score = 0;
    textoScore.innerText = score;
    tiempoHastaObstaculo = 2; // o cualquier valor inicial que desees
    // Reinicia otras configuraciones necesarias para el juego

    // Devuelve el juego al principio
    sueloX = 0;
    velEscenario = VELOCITY_FACTOR;
    tiempoHastaNube = 0.5;
    nubes.forEach(nube => nube.parentNode.removeChild(nube)); // Elimina todas las nubes
    nubes = []; // Vacía el array de nubes
    obstaculos.forEach(obstaculo => obstaculo.parentNode.removeChild(obstaculo)); // Elimina todos los obstáculos
    obstaculos = []; // Vacía el array de obstáculos
    gameVel = INITIAL_VELOCITY; // Restablece la velocidad del juego a su valor inicial
    // Ajusta cualquier otra cosa que necesite ser reiniciada para devolver el juego al principio
}


document.getElementById('startButton').addEventListener('click', RestartGame);

// Función para iniciar el juego
function RestartGame() {
    contenedor.style.display = "block";
    document.getElementById('startButton').style.display = "none";
    parado = false;
    gameOver.style.display = "none"; 
    gameRestartButton.style.display = "none"; 
    score = 0;
    textoScore.innerText = score;
    tiempoHastaObstaculo = 2; 

    sueloX = 0;
    velEscenario = VELOCITY_FACTOR;
    tiempoHastaNube = 0.5;
    nubes.forEach(nube => nube.parentNode.removeChild(nube)); 
    nubes = []; // Vacía el array de nubes
    obstaculos.forEach(obstaculo => obstaculo.parentNode.removeChild(obstaculo));
    obstaculos = []; 
    gameVel = INITIAL_VELOCITY; 
    
}