
// Variable de funcion para frenar una funcion por un tiempo predeterminado
var sleep = function(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
};


// Funcion recursiva que imprime en pantalla la solucion paso a paso de la torre de hanoi
// Se agrega cada paso a paso en el div de la derecha de la pagina web
// Se agrega un check para guia del usuario
function hanoi(torre1, torre2, torre3, discos)
{
    var divDerecha = document.getElementById('derecha');
    var divNuevo = document.createElement('div');
    var checNuevo = document.createElement('input');
    checNuevo.type = 'checkbox';

    // Caso exito
    if(discos==1)
    {
      divNuevo.textContent = "Disc " + discos + ", from " + torre1 + " to " + torre3 + " ";
      divNuevo.appendChild(checNuevo);
        divDerecha.appendChild(divNuevo);
    }
    else
    {
        hanoi(torre1, torre3, torre2, discos-1);
        
        divNuevo.textContent = "Disc " + discos + ", from " + torre1 + " to " + torre3 + " ";
        divNuevo.appendChild(checNuevo);
        divDerecha.appendChild(divNuevo);

        // Se mueve de aux a fin
        hanoi(torre2, torre1, torre3, discos-1);
    }
}

// Funcion recursiva que imprime en pantalla la solucion paso a paso de la torre de hanoi cada 2 segundos
// Cada 2 segundos mueve un disco automaticamente, usando las funciones internas de moveDisk()
async function hanoiAuto(torre1, torre2, torre3, discos) {
  var divDerecha = document.getElementById('derecha');
  var divNuevo = document.createElement('div');

  // Caso éxito
  if (discos == 1) {
    divNuevo.textContent = "Disc " + discos + ", from " + torre1 + " to " + torre3;
    divDerecha.appendChild(divNuevo);
    moveDisk(torre1, torre3);
    await sleep(2000);

  } 
  else {
    await hanoiAuto(torre1, torre3, torre2, discos - 1);

    divNuevo.textContent = "Disc " + discos + ", from " + torre1 + " to " + torre3;
    divDerecha.appendChild(divNuevo);
    moveDisk(torre1, torre3);
    await sleep(2000);

    // Mueve de aux a fin
    await hanoiAuto(torre2, torre1, torre3, discos - 1);
  }
}


// Borra y reinicia la parte derecha de la pagina web, donde sale el paso a paso de la solucion para el juego
function clean()
{
    document.getElementById('derecha').innerHTML = "<h1 class='title-2'>Solution</h1><br>";
}

// Declaracion de variables que seran usadas en el funcionamiento interno del aplicativo
// Como el disco seleccionado (selectedDisk), sourceTower (Torre de origen), towers(Arreglo de las 3 torres del juego)
let diskCount;
let selectedDisk = null;
let sourceTower = null;
let towers = {
    towerA: [],
    towerB: [],
    towerC: []
};
let towerD = null;

// Inicia el juego, ademas valida si se ingreso un numero de discos valido
function startGame() {
  diskCount = parseInt(document.getElementById("diskCount").value);
  if ( !Number.isInteger(diskCount))
  { 
    Swal.fire('Put the number of discs');
  }
  initializeTowers();
  render(); 
  
}

// Inicializa las torres con el numero de elementos que el usuario proporcionó
function initializeTowers() {
  towers.towerA = Array.from({ length: diskCount }, (_, index) => diskCount - index);
  towers.towerB = [];
  towers.towerC = [];
  towerD = [...towers.towerA]; // EL '...' funciona para hacer una copia independiente de la torreA, ya que esta copia funciona para validar si el usuario termino el juego
  console.log(towers.towerA);
  console.log(towerD);
}


// Mueve un disco, con parametro from(Torre Origen) y to(Torre Destino)
function moveDisk(from, to) {
  const disk = towers[from].pop();
  towers[to].push(disk);
  selectedDisk = null;
  sourceTower = null;

  // Verificar si la torre B es igual a la torre A inicial
  if (JSON.stringify(towers.towerB) === JSON.stringify(towerD) || JSON.stringify(towers.towerC) === JSON.stringify(towerD)) {
    console.log("La torre B es igual a la torre A inicial");
    Swal.fire({
      position: 'top-center',
      icon: 'success',
      title: '¡Perfecto Crack!',
      showConfirmButton: false,
      timer: 3000
    })
  }

  render(); // Llamar a render() después de actualizar los datos y la visualizacion de la interfaz
}

// Actualiza la parte visual de las torres despues de cada movimiento
// Recorre cada arreglo de las 3 torres, imprimiendo los discos usando divs
function render() {
  const towerElements = document.getElementsByClassName("tower");
  for (let i = 0; i < towerElements.length; i++) {
    const tower = towerElements[i];
    const towerName = tower.id;
    const diskValues = towers[towerName];

    while (tower.firstChild) {
      tower.firstChild.remove();
    }

    diskValues.forEach((diskValue) => {
      const disk = document.createElement("div");
      disk.className = "disk";
      disk.style.width = (diskValue * 20) + "px";
      disk.draggable = true;
      disk.ondragstart = function(event) { drag(event, diskValue, towerName); };
      tower.appendChild(disk);
    });
    }
}

function drag(event, diskValue, towerName) {
  selectedDisk = diskValue;
  sourceTower = towerName;
}

function allowDrop(event) {
  event.preventDefault();
}

// Permite dejar un disco en una torre distinta, validando que se pueda hacer el movimiento con el isValidMove()
function drop(event) {
  event.preventDefault();
  const targetTower = event.currentTarget.id;
  if (sourceTower !== targetTower && isValidMove(sourceTower, targetTower)) {
    moveDisk(sourceTower, targetTower);
  }
  selectedDisk = null;
  sourceTower = null;
  render();
}


// Valida que se pueda realizar un movimiento, validando que no sean indefinidos los valores, y 
// que el disco origen, sea menor al disco destino, donde se pondra el disco origen
function isValidMove(sourceTower, targetTower) {
  const sourceDisk = towers[sourceTower][towers[sourceTower].length - 1];
  const targetDisk = towers[targetTower][towers[targetTower].length - 1];
  return typeof sourceDisk !== "undefined" && (typeof targetDisk === "undefined" || sourceDisk < targetDisk);
}