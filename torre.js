/*
var torre1 = 1;
var torre2 = 2;
var torre3 = 3;
var discos = 2; // Numero de discos 

var origen = torre1;
var fin = torre3;
var auxiliar = torre2;
*/

function hanoi(torre1, torre2, torre3, discos)
{
    var divDerecha = document.getElementById('derecha');
    var divNuevo = document.createElement('div');
    var checNuevo = document.createElement('input');
    checNuevo.type = 'checkbox';

    // Caso exito
    if(discos==1)
    {
        // document.write("Disco " + discos + ", de torre " + torre1 + " a " + torre3 + "</br>");

 
        divNuevo.textContent = "Disco " + discos + ", de torre " + torre1 + " a " + torre3;
        divNuevo.appendChild(checNuevo);
        divDerecha.appendChild(divNuevo);
        //console.log("Disco " + discos + ", de torre " + torre1 + " a " + torre3)
    }
    else
    {
        // 1, 1, 2, 3
        hanoi(torre1, torre3, torre2, discos-1);
        // document.write("Disco " + discos + ", de torre " + torre1 + " a " + torre3 + "</br>");

    
        divNuevo.textContent = "Disco " + discos + ", de torre " + torre1 + " a " + torre3;
        divNuevo.appendChild(checNuevo);
        divDerecha.appendChild(divNuevo);
        // console.log("Disco " + discos + ", de torre " + torre1 + " a " + torre3)
        // Se mueve de aux a fin
        hanoi(torre2, torre1, torre3, discos-1);
    }
}

function clean()
{
    document.getElementById('derecha').innerHTML = "<h1>Solucion</h1><br>";
}

let diskCount;
let selectedDisk = null;
let sourceTower = null;
let towers = {
    towerA: [],
    towerB: [],
    towerC: []
};

function startGame() {
  diskCount = parseInt(document.getElementById("diskCount").value);
  initializeTowers();
  render();
}

function initializeTowers() {
  towers.towerA = Array.from({ length: diskCount }, (_, index) => diskCount - index);
  towers.towerB = [];
  towers.towerC = [];
}

function moveDisk(from, to) {
  const disk = towers[from].pop();
  towers[to].push(disk);
  selectedDisk = null;
  sourceTower = null;
  render(); // Llamar a render() después de actualizar los datos
}

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

function isValidMove(sourceTower, targetTower) {
  const sourceDisk = towers[sourceTower][towers[sourceTower].length - 1];
  const targetDisk = towers[targetTower][towers[targetTower].length - 1];
  return typeof sourceDisk !== "undefined" && (typeof targetDisk === "undefined" || sourceDisk < targetDisk);
}