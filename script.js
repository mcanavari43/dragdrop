import recorridos from './recorridos.js';


const CARD = 6;
let win = false;

let draggableElements = document.querySelector('.draggable-items');
let droppableElements = document.querySelector('.droppable-position');

let timerDisplay = document.getElementsByClassName('cronometro');

let timerSeconds = 60;

function updateTimerDisplay() {
    timerDisplay.textContent = timerSeconds + "s";
}

updateTimerDisplay();

function startTimer() {
    const timerInterval = setInterval(() => {
        timerSeconds--;

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            ("Tiempo agotado. Fin del juego.");
            // Aquí puedes realizar acciones adicionales al finalizar el temporizador
        }

        updateTimerDisplay();
    }, 1000);
}

// Inicia el temporizador después de un breve retardo (por ejemplo, 3 segundos)
setTimeout(() => {
    startTimer();
    ("Timer iniciado")
}, 3000);


let currentNivel = 'nivelUno';

function showImages() {
  const rutaElegida = "R1C";

  recorridos[currentNivel].forEach((ruta) => {
    const area = droppableElements; // Suponiendo que ruta.ruta es el ID del área

    if (ruta.ruta === rutaElegida) {
      console.log(ruta.ruta)
      if (area) {
        ruta.elementos.forEach((elemento) => {
          const existingImage = area.querySelector(`.${elemento.nombre}`);
          console.log(elemento.nombre)

          if (!existingImage) {
            // Si no hay una imagen específica, crea y muestra la imagen predeterminada
            const image = document.createElement('div');
            image.classList.add('draggable-item', elemento.nombre);
            image.style.position = 'absolute';
            image.style.left = `${elemento.posicion.x}px`;
            image.style.top = `${elemento.posicion.y}px`;

            // Verifica si es una imagen por defecto y configura la ruta en consecuencia
            const imagePath = 'pregunta.png';

            image.innerHTML = `
              <img class="draggable-image" width="50px" height="50px" src="../img/${imagePath}" alt="${elemento.nombre}">
            `;

            // Asigna un atributo de datos para almacenar la ruta
            image.dataset.ruta = ruta.ruta;

            // Asigna un atributo de datos para almacenar el nombre del elemento
            image.dataset.nombreElemento = elemento.nombre;

            area.appendChild(image);
          }
        });
      }
    }
  });
}

// Llama a la función para mostrar las imágenes
showImages();


draggableElements.innerHTML = '';

// Usamos Object.entries para obtener tanto la clave (nivel) como el valor (rutasNivel)
let rutaElegida = "R1C";  // Puedes ajustar esto según tus necesidades

for (const [nivel, rutasNivel] of Object.entries(recorridos)) {
  rutasNivel.forEach(ruta => {
    // Asegúrate de que la ruta actual coincida con la ruta elegida
    if (ruta.ruta === rutaElegida) {
      ruta.elementos.forEach(elemento => {
        draggableElements.innerHTML += `
          <div class="draggable-item" data-nivel="${nivel}" data-ruta="${ruta.ruta}" data-nombre="${elemento.nombre}" draggable="false">
              <img class="image" src="../img/${elemento.pathimagen}" alt="${elemento.nombre}">
          </div>
        `;
      });
    }
  });
}
function updateNivel(nivel, rutaElegida) {
  let newContent = '';

  recorridos[nivel].forEach(ruta => {
    // Asegúrate de que la ruta actual coincida con la ruta elegida
    if (ruta.ruta === rutaElegida) {
      ruta.elementos.forEach(elemento => {
        newContent += `
          <div class="draggable-item" data-nivel="${nivel}" data-ruta="${ruta.ruta}" data-nombre="${elemento.nombre}" draggable="true">
              <img class="image" src="../img/${elemento.pathimagen}" alt="${elemento.nombre}">
          </div>
        `;
      });
    }
  });

  draggableElements.innerHTML = newContent;
}

// Llama a la función updateNivel con la ruta elegida
updateNivel("nivelUno", "R1C");  // Puedes ajustar los valores según tus necesidades

// Volvemos a seleccionar los elementos después de la actualización
let draggableItemsArrays = document.querySelectorAll('.draggable-item');

draggableItemsArrays.forEach(item => {
    item.addEventListener('dragstart', (event) => {
        // Almacena el nombre de la imagen en el evento de arrastre
        event.dataTransfer.setData('text/plain', item.getAttribute('data-nombre'));
    });
    item.addEventListener('dragend', () => {
      item.style.display = 'none';
  });
});

droppableElements.addEventListener('dragover', (event) => {
    event.preventDefault();
})

droppableElements.addEventListener('drop', (event) => {
  event.preventDefault();

  // Obtiene el nombre de la imagen desde el evento de transferencia de datos
  const dataNombre = event.dataTransfer.getData('text/plain');
  console.log("Nombre de la imagen:", dataNombre);

  // Verifica si la imagen ya está presente en el área de destino
  if (!isImagePresent(dataNombre)) {
    // Encuentra la información completa de la imagen en recorridos
    const imagenDropped = recorridos[currentNivel].find(ruta => ruta.elementos.some(elemento => elemento.nombre === dataNombre));
    console.log(imagenDropped.ruta)
    if (imagenDropped) {
      const { x, y } = imagenDropped.elementos.find(elemento => elemento.nombre === dataNombre).posicion;
      console.log("Posición X:", x, "Posición Y:", y);

      // Elimina la imagen genérica actual, si existe
      const existingGenericImage = droppableElements.querySelector('.generic');
      if (existingGenericImage) {
        droppableElements.removeChild(existingGenericImage);
      }

      // Crea un nuevo elemento div para la imagen soltada
      const newImage = document.createElement('div');
      newImage.classList.add('draggable-item');
      newImage.setAttribute('data-nivel', currentNivel); // Usa el nivel actual
      newImage.setAttribute('data-nombre', dataNombre);
      newImage.setAttribute('data-ruta', imagenDropped.ruta); // Nuevo atributo para almacenar la ruta

      // Crea la imagen dentro del nuevo div
      newImage.innerHTML = `
        <img class="image" src="../img/${dataNombre}.png" alt="${dataNombre}">
      `;

      newImage.style.position = 'absolute';
      newImage.style.left = `${x}px`;
      newImage.style.top = `${y}px`;

      // Agrega el nuevo elemento al área de destino
      droppableElements.appendChild(newImage);

      console.log("Nombre dejado:", dataNombre, "Ruta:", imagenDropped.ruta);
    } else {
      console.log("No se encontró información para la imagen:", dataNombre);
    }
  } else {
    console.log("La imagen ya está presente en el área de destino.");
  }
});


// Función para verificar si la imagen ya está presente en el área de destino
function isImagePresent(pathimagen) {
  const existingImages = droppableElements.querySelectorAll('.draggable-item');
  return Array.from(existingImages).some(image => image.getAttribute('data-nombre') === pathimagen);
}

// CONSEGUIR MAPA Y ALINEARLO A BUENA CALIDAD Y TAMAÑO
// TERMINAR DE COLOCAR LAS POSICONES CORRESPONDIENTES POR CADA NIVEL PARA CADA IMAGEN
// VISUALIZAR TIMER
// ESTILOS CSS
// RESPONSIVE - TABLET- MOBILE - DESKTOP

// PANTALLA PRINCIPAL PARA COMENZAR JUEGO
// PANTALLAZO POR SEGUNDOS MOSTRANDO COMO SE JUEGA
// AGREGAR SONIDOS DE JUEGO - MUSICA AMBIENTAL
