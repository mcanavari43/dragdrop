import recorridos from './recorridos.js';



for (const nivel in recorridos ){
  if(recorridos.hasOwnProperty(nivel)){
    recorridos[nivel];
  }
  return recorridos[nivel];
}





function limpiarAreaDroppable() {
  const area = droppableElements;
  const nivelActualImages = area.querySelectorAll(`[data-nivel="${currentNivel}"]`);
  
  nivelActualImages.forEach(image => {
      image.parentNode.removeChild(image);
  });
}























//////////////////////////////



import recorridos from './recorridos.js';

let draggableElements = document.querySelector('.draggable-items');
let droppableElements = document.querySelector('.droppable-position');

const CARD = 6;
let win = false;
let imagenesDropeadas = [];

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

function getRandomRoute(nivel) {
    const rutasNivel = recorridos[nivel];
    const randomIndex = Math.floor(Math.random() * rutasNivel.length);
    return rutasNivel[randomIndex];
  }
  

  function updateNivel(imagenesDropeadas) {
    if (imagenesDropeadas.length >= 5) {
        if (currentNivel === "nivelUno") {
            currentNivel = "nivelDos";
            const nuevaRuta = getRandomRoute(currentNivel);
            showImages(nuevaRuta);
            console.log("Has subido de nivel a", currentNivel);
        } else if (currentNivel === "nivelDos") {
            currentNivel = "nivelTres";
            const nuevaRuta = getRandomRoute(currentNivel);
            showImages(nuevaRuta);
            console.log("Has subido de nivel a", currentNivel);
        }
        imagenesDropeadas = []
        limpiarAreaDroppable();
    } else {
        console.log("Nivel Incompleto");
    }
}

updateNivel(imagenesDropeadas);

function limpiarAreaDroppable() {
    const area = droppableElements;
    const nivelActualImages = area.querySelectorAll(`[data-nivel="${currentNivel}"]`);
    
    nivelActualImages.forEach(image => {
        image.parentNode.removeChild(image);
    });
}

function showImages() {
    imagenesDropeadas = [];
    // Obtiene una ruta aleatoria para el nivel actual
    let rutaElegida = getRandomRoute(currentNivel);
    console.log("Ruta Elegida:", rutaElegida.ruta);

    const area = droppableElements;
    const draggableArea = draggableElements;

    // Limpiamos el contenido actual antes de agregar nuevas imágenes
    area.innerHTML = "";
    let newContent = '';
    if (area && draggableArea) {
        rutaElegida.elementos.forEach((elemento) => {
            // Agregamos imágenes al área de destino
            const existingImage = area.querySelector(`.${elemento.nombre}`);
            if (!existingImage) {
                const image = document.createElement('div');
                image.style.position = 'absolute';
                image.style.left = `${elemento.posicion.x}px`;
                image.style.top = `${elemento.posicion.y}px`;
                const imagePath = 'pregunta.png';
                image.innerHTML = `
                    <img class="generic-image" width="50px" height="50px" src="../img/${imagePath}" alt="${elemento.nombre}">
                `;
                image.dataset.ruta = rutaElegida.ruta;
                image.dataset.nombreElemento = elemento.nombre;
                area.appendChild(image);
            }
        });

        // Agregamos imágenes a la zona de arrastre
        rutaElegida.elementos.forEach((elemento) => {
            newContent += `
                <div class="draggable-item" data-nivel="${currentNivel}" data-ruta="${rutaElegida.ruta}" data-nombre="${elemento.nombre}" draggable="true">
                    <img class="image" src="../img/${elemento.pathimagen}" alt="${elemento.nombre}">
                </div>
            `;
        });

        draggableElements.innerHTML = newContent;
    }
}

showImages();

let draggableItemsArrays = document.querySelectorAll('.draggable-item');

draggableItemsArrays.forEach(item => {
    item.addEventListener('dragstart', (event) => {
                 // Almacena el nombre de la imagen en el evento de arrastre
               event.dataTransfer.setData('text/plain', item.getAttribute('data-nombre'));
})
item.addEventListener('dragend', () => {
          item.style.display = 'none';
})
})

droppableElements.addEventListener('dragover', (event) => {
    event.preventDefault();
})

droppableElements.addEventListener('drop', (event) => {
    event.preventDefault();
  

    // Obtiene el nombre de la imagen desde el evento de transferencia de datos
    const dataNombre = event.dataTransfer.getData('text/plain');
    console.log("Nombre de la imagen:", dataNombre);

        // Encuentra la información completa de la imagen en recorridos
        const imagenDropped = recorridos[currentNivel].find(ruta => ruta.elementos.some(elemento => elemento.nombre === dataNombre));
        console.log(imagenDropped)

        if (!isImagePresent(dataNombre)) {
                // Encuentra la información completa de la imagen en recorridos
                const imagenDropped = recorridos[currentNivel].find(ruta => ruta.elementos.some(elemento => elemento.nombre === dataNombre));
                console.log(imagenDropped.ruta)
                if (imagenDropped) {
                    imagenesDropeadas.push(dataNombre);
            if(imagenesDropeadas.length == 6){
                updateNivel(imagenesDropeadas);
            }
            console.log(imagenesDropeadas)
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






//         if (imagenDropped) {
//             imagenesDropeadas.push(dataNombre);
//             if(imagenesDropeadas.length == 6){
//                 updateNivel(imagenesDropeadas);
//             }
//             console.log(imagenesDropeadas)
//           const { x, y } = imagenDropped.elementos.find(elemento => elemento.nombre === dataNombre).posicion;
//           console.log("Posición X:", x, "Posición Y:", y);
    
//       const newImage = document.createElement('div');
//       newImage.classList.add('draggable-item');
//       newImage.setAttribute('data-nivel', currentNivel); // Usa el nivel actual
//       newImage.setAttribute('data-nombre', dataNombre);
//       newImage.setAttribute('data-ruta', imagenDropped.ruta); // Nuevo atributo para almacenar la ruta

//       // Crea la imagen dentro del nuevo div
//       newImage.innerHTML = `
//         <img class="image" src="../img/${dataNombre}.png" alt="${dataNombre}">
//       `;

//       newImage.style.position = 'absolute';
//       newImage.style.left = `${x}px`;
//       newImage.style.top = `${y}px`;

//       // Agrega el nuevo elemento al área de destino
//       droppableElements.appendChild(newImage);

//       console.log("Nombre dejado:", dataNombre, "Ruta:", imagenDropped.ruta);
//         } else {
//             console.log("caca")
//         }
    
// })

// function isImagePresent(pathimagen) {
//     const existingImages = droppableElements.querySelectorAll('.draggable-item');
//     return Array.from(existingImages).some(image => image.getAttribute('data-nombre') === pathimagen);
//   }


// // Volvemos a seleccionar los elementos después de la actualización
// let draggableItemsArrays = document.querySelectorAll('.draggable-item');

// draggableItemsArrays.forEach(item => {
//     item.addEventListener('dragstart', (event) => {
//         // Almacena el nombre de la imagen en el evento de arrastre
//         event.dataTransfer.setData('text/plain', item.getAttribute('data-nombre'));
//     });
//     item.addEventListener('dragend', () => {
//       item.style.display = 'none';
//   });
// });

// droppableElements.addEventListener('dragover', (event) => {
//     event.preventDefault();
// })

// droppableElements.addEventListener('drop', (event) => {
//   event.preventDefault();

//   // Obtiene el nombre de la imagen desde el evento de transferencia de datos
//   const dataNombre = event.dataTransfer.getData('text/plain');
//   console.log("Nombre de la imagen:", dataNombre);

//   // Verifica si la imagen ya está presente en el área de destino
//   if (!isImagePresent(dataNombre)) {
//     // Encuentra la información completa de la imagen en recorridos
//     const imagenDropped = recorridos[currentNivel].find(ruta => ruta.elementos.some(elemento => elemento.nombre === dataNombre));
//     console.log(imagenDropped.ruta)
//     if (imagenDropped) {
//       const { x, y } = imagenDropped.elementos.find(elemento => elemento.nombre === dataNombre).posicion;
//       console.log("Posición X:", x, "Posición Y:", y);

//       // Elimina la imagen genérica actual, si existe
//       const existingGenericImage = droppableElements.querySelector('.generic');
//       if (existingGenericImage) {
//         droppableElements.removeChild(existingGenericImage);
//       }

    //   // Crea un nuevo elemento div para la imagen soltada
    //   const newImage = document.createElement('div');
    //   newImage.classList.add('draggable-item');
    //   newImage.setAttribute('data-nivel', currentNivel); // Usa el nivel actual
    //   newImage.setAttribute('data-nombre', dataNombre);
    //   newImage.setAttribute('data-ruta', imagenDropped.ruta); // Nuevo atributo para almacenar la ruta

    //   // Crea la imagen dentro del nuevo div
    //   newImage.innerHTML = `
    //     <img class="image" src="../img/${dataNombre}.png" alt="${dataNombre}">
    //   `;

    //   newImage.style.position = 'absolute';
    //   newImage.style.left = `${x}px`;
    //   newImage.style.top = `${y}px`;

    //   // Agrega el nuevo elemento al área de destino
    //   droppableElements.appendChild(newImage);

    //   console.log("Nombre dejado:", dataNombre, "Ruta:", imagenDropped.ruta);
//     } else {
//       console.log("No se encontró información para la imagen:", dataNombre);
//     }
//   } else {
//     console.log("La imagen ya está presente en el área de destino.");
//   }
// });


// // Función para verificar si la imagen ya está presente en el área de destino
// function isImagePresent(pathimagen) {
//   const existingImages = droppableElements.querySelectorAll('.draggable-item');
//   return Array.from(existingImages).some(image => image.getAttribute('data-nombre') === pathimagen);
// }

// // CONSEGUIR MAPA Y ALINEARLO A BUENA CALIDAD Y TAMAÑO
// // TERMINAR DE COLOCAR LAS POSICONES CORRESPONDIENTES POR CADA NIVEL PARA CADA IMAGEN
// // VISUALIZAR TIMER
// // ESTILOS CSS
// // RESPONSIVE - TABLET- MOBILE - DESKTOP

// // PANTALLA PRINCIPAL PARA COMENZAR JUEGO
// // PANTALLAZO POR SEGUNDOS MOSTRANDO COMO SE JUEGA
// // AGREGAR SONIDOS DE JUEGO - MUSICA AMBIENTAL












import recorridos from './recorridos.js';

let draggableElements = document.querySelector('.draggable-items');
let droppableElements = document.querySelector('.droppable-position');

const CARD = 6;
let win = false;
let imagenesDropeadas = [];

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


let currentNivel = 'nivelDos';

function getRandomRoute(nivel) {
    const rutasNivel = recorridos[nivel];
    const randomIndex = Math.floor(Math.random() * rutasNivel.length);
    return rutasNivel[randomIndex];
  }
  

  function updateNivel(imagenesDropeadas) {
    if (imagenesDropeadas.length == 5) {
        if (currentNivel === "nivelUno") {
            currentNivel = "nivelDos";
            const nuevaRuta = getRandomRoute(currentNivel);
            showImages(nuevaRuta);
            console.log("Has subido de nivel a", currentNivel);
        } else if (currentNivel === "nivelDos") {
            currentNivel = "nivelTres";
            const nuevaRuta = getRandomRoute(currentNivel);
            showImages(nuevaRuta);
            console.log("Has subido de nivel a", currentNivel);
        }
        imagenesDropeadas = []
        limpiarAreaDroppable();
    } else {
        console.log("Nivel Incompleto");
    }
}



function limpiarAreaDroppable() {
    const area = droppableElements;
    const nivelActualImages = area.querySelectorAll(`[data-nivel="${currentNivel}"]`);
    
    nivelActualImages.forEach(image => {
        image.parentNode.removeChild(image);
    });
}

function showImages() {
    imagenesDropeadas = [];
    // Obtiene una ruta aleatoria para el nivel actual
    let rutaElegida = getRandomRoute(currentNivel);
    console.log("Ruta Elegida:", rutaElegida.ruta);

    const area = droppableElements;
    const draggableArea = draggableElements;

    // Limpiamos el contenido actual antes de agregar nuevas imágenes
    area.innerHTML = "";
    let newContent = '';
    if (area && draggableArea) {
        rutaElegida.elementos.forEach((elemento) => {
            // Agregamos imágenes al área de destino
            const existingImage = area.querySelector(`.${elemento.nombre}`);
            if (!existingImage) {
                const image = document.createElement('div');
                image.style.position = 'absolute';
                image.style.left = `${elemento.posicion.x}px`;
                image.style.top = `${elemento.posicion.y}px`;
                const imagePath = 'pregunta.png';
                image.innerHTML = `
                    <img class="generic-image" width="50px" height="50px" src="../img/${imagePath}" alt="${elemento.nombre}">
                `;
                image.dataset.ruta = rutaElegida.ruta;
                image.dataset.nombreElemento = elemento.nombre;
                area.appendChild(image);
            }
        });

        // Agregamos imágenes a la zona de arrastre
        rutaElegida.elementos.forEach((elemento) => {
            newContent += `
                <div class="draggable-item" data-nivel="${currentNivel}" data-ruta="${rutaElegida.ruta}" data-nombre="${elemento.nombre}" draggable="true">
                    <img class="image" src="../img/${elemento.pathimagen}" alt="${elemento.nombre}">
                </div>
            `;
        });

        draggableElements.innerHTML = newContent;
    }
}

showImages();

let draggableItemsArrays = document.querySelectorAll('.draggable-item');

draggableItemsArrays.forEach(item => {
    item.addEventListener('dragstart', (event) => {
                 // Almacena el nombre de la imagen en el evento de arrastre
               event.dataTransfer.setData('text/plain', item.getAttribute('data-nombre'));
})
item.addEventListener('dragend', () => {
          item.style.display = 'none';
})
})

droppableElements.addEventListener('dragover', (event) => {
    event.preventDefault();
})

droppableElements.addEventListener('drop', (event) => {
    event.preventDefault();
  

    // Obtiene el nombre de la imagen desde el evento de transferencia de datos
    const dataNombre = event.dataTransfer.getData('text/plain');
    console.log("Nombre de la imagen:", dataNombre);

        // Encuentra la información completa de la imagen en recorridos
        const imagenDropped = recorridos[currentNivel].find(ruta => ruta.elementos.some(elemento => elemento.nombre === dataNombre));
        console.log(imagenDropped)

        if (!isImagePresent(dataNombre)) {
                // Encuentra la información completa de la imagen en recorridos
                const imagenDropped = recorridos[currentNivel].find(ruta => ruta.elementos.some(elemento => elemento.nombre === dataNombre));
                console.log(imagenDropped.ruta)
                if (imagenDropped) {
                    imagenesDropeadas.push(dataNombre);
            if(imagenesDropeadas.length == 6){
                updateNivel(imagenesDropeadas);
            }

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
            updateNivel(imagenesDropeadas);

            
function isImagePresent(pathimagen) {
    const existingImages = droppableElements.querySelectorAll('.draggable-item');
    return Array.from(existingImages).some(image => image.getAttribute('data-nombre') === pathimagen);
  }