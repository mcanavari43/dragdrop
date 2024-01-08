import recorridos from './recorridos.js';

const CARD = 6;
let juegoTerminado = false;
let currentRutaIndex = 0;

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
            console.log("Tiempo agotado. Fin del juego.");
            // Aquí puedes realizar acciones adicionales al finalizar el temporizador
        }

        updateTimerDisplay();
    }, 1000);
}

// Inicia el temporizador después de un breve retardo (por ejemplo, 3 segundos)
setTimeout(() => {
    startTimer();
    console.log("Timer iniciado");
}, 3000);

let currentNivel = 'nivelUno';
console.log(`Current Nivel: ${currentNivel}`);

function obtenerRutaAleatoria(rutas) {
    let rutaElegida;
    do {
        rutaElegida = rutas[Math.floor(Math.random() * rutas.length)].ruta;
    } while (rutaElegida === obtenerRutaAleatoria.ultimaRutaElegida);
    obtenerRutaAleatoria.ultimaRutaElegida = rutaElegida;
    return rutaElegida;
}

function showImages() {
    const todosNivelesCompletados = Object.keys(recorridos).every(nivel => isNivelCompleto(nivel));
    console.log("Nivel Completo: " + todosNivelesCompletados)

    if (todosNivelesCompletados) {
        console.log('¡Has completado todos los niveles!');
        juegoTerminado = true; // Marca el juego como terminado
        // Puedes realizar acciones al completar todos los niveles, como mostrar un mensaje final.
        return;
    }

    const rutasNivelActual = recorridos[currentNivel];
console.log(rutasNivelActual);

// Obtén la ruta aleatoria
const rutaElegida = obtenerRutaAleatoria(rutasNivelActual);
console.log(rutaElegida);

draggableElements.innerHTML = '';

// Obtén el índice de la ruta elegida
const indiceRutaElegida = rutasNivelActual.findIndex(ruta => ruta.ruta === rutaElegida);

// Asegúrate de que el índice sea válido (mayor o igual a 0)
const indiceValido = indiceRutaElegida >= 0 ? indiceRutaElegida : 0;

rutasNivelActual[indiceValido].elementos.forEach((elemento, index) => {
    const { nombre, pathimagen } = elemento;
    draggableElements.innerHTML += `
        <div class="draggable-item" data-nivel="${currentNivel}" data-ruta="${rutaElegida}" data-nombre="${nombre}" draggable="false">
            <img class="image" src="../img/${pathimagen}" alt="${nombre}">
        </div>
    `;
    console.log(nombre, rutasNivelActual[indiceValido]);

    // Puedes utilizar el índice "index" para ajustar la posición de cada elemento si es necesario
});
    
    // Llama a la función updateNivel con la ruta elegida
    updateNivel(currentNivel, rutaElegida);

    // Verifica si todos los elementos del nivel se han completado
    if (isNivelCompleto(currentNivel)) {
        console.log(`¡Has completado el nivel ${currentNivel}!`);

        // Avanzar al siguiente nivel
        const niveles = Object.keys(recorridos);
        const currentIndex = niveles.indexOf(currentNivel);

        if (currentIndex < niveles.length - 1) {
            const nextNivel = niveles[currentIndex + 1];
            console.log(`Avanzar al siguiente nivel: ${nextNivel}`);
            currentNivel = nextNivel;
            currentRutaIndex = 0; // Restablecer el índice de la ruta al cambiar de nivel
            showImages();
        } else {
            console.log('¡Has completado todos los niveles!');
            // Puedes realizar acciones al completar todos los niveles, como reiniciar el juego.
        }
    }
}

function updateNivel(nivel, rutaElegida) {
    let newContent = '';

    recorridos[nivel].forEach((ruta, index) => {
        if (index === currentRutaIndex) {
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

// Llama a la función showImages para mostrar las imágenes al cargar la página o en eventos relevantes
showImages();

// Llama a la función updateNivel con la ruta elegida

// Volvemos a seleccionar los elementos después de la actualización
let draggableItemsArrays = document.querySelectorAll('.draggable-item');

draggableItemsArrays.forEach(item => {
    item.addEventListener('dragstart', (event) => {
        const dataNombre = item.getAttribute('data-nombre');
        const dataRuta = item.getAttribute('data-ruta');
        console.log(dataRuta)

        // Almacena el nombre y la ruta de la imagen en el evento de arrastre
        event.dataTransfer.setData('text/plain', JSON.stringify({ nombre: dataNombre, ruta: dataRuta }));
    });

    item.addEventListener('dragend', () => {
        item.style.display = 'none';
    });
});

// Evento para permitir el arrastre sobre el área de destino
droppableElements.addEventListener('dragover', (event) => {
    event.preventDefault();
});

// Función para verificar si la imagen ya está presente en el área de destino
function isImagePresent(pathimagen) {
    const existingImages = droppableElements.querySelectorAll('.draggable-item');
    return Array.from(existingImages).some(image => image.getAttribute('data-nombre') === pathimagen);
}

function isNivelCompleto(nivel) {
    const elementosPresentes = Array.from(droppableElements.querySelectorAll('.draggable-item'));

    // Verificar si hay exactamente 6 elementos en elementosPresentes
    if (elementosPresentes.length !== 6) {
        return false;
    }

    const elementosNivel = recorridos[nivel][0].elementos.map(ruta => ruta.nombre);

    return elementosNivel.every(elemento =>
        elementosPresentes.some(item =>
            item.dataset.nombre === elemento.nombre && item.dataset.ruta === elemento.ruta
        )
    );
}

// Declara el array para almacenar las imágenes dropeadas
let imagenesDropeadas = [];

droppableElements.addEventListener('drop', (e) => {
    e.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    // EL ERROR VIENE DE ACA , ESTA TRAYENDO MAL LA IMAGEN QUE ME TRAE AL DROP , NO MATCHEA CON LA RUTA QUE LE CORRESPONDE
    console.log(data)
})


// DESCOMENTAR DROP Y ELIMINAR EL DROP  DE ARRIBA EN CASO DE USARLO

// droppableElements.addEventListener('drop', (event) => {
//     event.preventDefault();

//     if (juegoTerminado) {
//         console.log('¡El juego ha terminado!');
//         // Puedes realizar acciones específicas cuando el juego ha terminado.
//     } else {
//         // Obtiene la información completa de la imagen desde el objeto de transferencia de datos
//         const data = JSON.parse(event.dataTransfer.getData('text/plain'));
//         const dataNombre = data.nombre;
//         const dataRuta = data.ruta;
        
//         // Verifica si la imagen ya está presente en el área de destino
//         if (!isImagePresent(dataNombre)) {
//             // Encuentra la información completa de la imagen en recorridos
//             const rutaActual = recorridos[currentNivel][0].ruta; // Obtén la ruta correspondiente al nivel actual
        
//             const imagenDropped = recorridos[currentNivel].find(ruta => ruta.elementos.some(elemento => elemento.nombre === dataNombre));
        
//             if (imagenDropped) {
//                 const nombreElemento = imagenDropped.elementos.find(elemento => elemento.nombre === dataNombre).nombre;
//                 const { x, y } = imagenDropped.elementos.find(elemento => elemento.nombre === dataNombre).posicion;
        

//                 // Elimina la imagen genérica actual, si existe
//                 const existingGenericImage = droppableElements.querySelector('.generic');
//                 if (existingGenericImage) {
//                     droppableElements.removeChild(existingGenericImage);
//                 }

//                 // Crea un nuevo elemento div para la imagen soltada
//                 const newImage = document.createElement('div');
//                 const rutaDropeada = rutaActual;
//                 newImage.setAttribute('data-ruta', rutaDropeada);
//                 newImage.setAttribute('data-nivel', currentNivel); // Usa el nivel actual
//                 newImage.setAttribute('data-nombre', dataNombre); // Utiliza la ruta obtenida del objeto de transferencia
//                 newImage.classList.add('draggable-item');
                
//                 // Crea la imagen dentro del nuevo div
//                 newImage.innerHTML = `
//                     <img class="image" src="../img/${dataNombre}.png" alt="${dataNombre}">
//                 `;

//                 newImage.style.position = 'absolute';
//                 newImage.style.left = `${x}px`;
//                 newImage.style.top = `${y}px`;

//                 // Agrega el nuevo elemento al área de destino
//                 droppableElements.appendChild(newImage);

//                 // Almacena la información de la imagen en el array
//                 imagenesDropeadas.push({ nombre: dataNombre, ruta: dataRuta, x: x, y: y });

//                 // Muestra el contenido actual del array en la consola
//                 console.log("Imagen Drop:", dataNombre, " Ruta:", dataRuta);
//                 console.log("Imágenes Dropeadas:", imagenesDropeadas);

//                 // Verifica si se han dropeado 6 imágenes para ejecutar updateNivel
//                 if (imagenesDropeadas.length === CARD) {
//                     console.log(`Se han dropeado ${CARD} imágenes. Ejecutando updateNivel.`);
//                     droppableElements.innerHTML = '';
//                     // Puedes llamar a updateNivel con la información necesaria
//                     // Por ejemplo, la ruta actual y la lista de imágenes dropeadas.
//                     // updateNivel(currentNivel, imagenesDropeadas);

//                     // Limpia el array para el siguiente conjunto de imágenes
//                     imagenesDropeadas = [];

//                     // Puedes agregar aquí la lógica adicional que necesites después de dropear 6 imágenes
//                     updateNivel(currentNivel, currentRutaIndex);
//                 }
//             } else {
//                 console.log("No se encontró información para la imagen:", dataNombre);
//             }
//         } else {
//             console.log("La imagen ya está presente en el área de destino.");
//         }
//     }
// });
