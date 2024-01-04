const CARD = 3;
let win = false;

let wrongMsg = document.querySelector('.wrong')
let points = 0;

let draggableElements = document.querySelector('.draggable-items');
let droppableElements = document.querySelector('.droppable-elements');

let options = [
  {
  "name":"cordillera",
  "img": "cordillera.png",
},
  {
  "name":"cataratas",
  "img": "cataratas.png"
},
  {
  "name":"llama",
  "img": "llama.png"
},
];


options.forEach(image => {

  draggableElements.innerHTML += `
  <div class="option">
  <img id="${image.name}" draggable="true" class="image" src="../img/${image.img}" width="50px" heigth="50px">
  </div>`
})


droppableElements.innerHTML = '';

options.forEach((name, index) => {

  droppableElements.innerHTML += `
  <div class="names name${index+1}">
  <p>${name.name}</p>
  </div>`
})

let opciones = document.querySelectorAll('.image')
console.log(opciones)
opciones.forEach(opcion => {
  opcion.innerHTML += "<img src='../img/pregunta.png'>"
  opcion.addEventListener('dragstart', event => {
    event.dataTransfer.setData('text',event.target.id)
  })
})

let names = document.querySelectorAll('.names')


console.log(names)

names.forEach(name => {
  name.addEventListener('dragover',event => {
    event.preventDefault();
  })

  name.addEventListener('drop',event => {
    event.preventDefault();
    const draggableElementData = event.dataTransfer.getData('text');
    console.log(draggableElementData)
    let optionElement = document.querySelector(`#${draggableElementData}`)

   
    if(event.target.innerText == draggableElementData ){
      points++;
      event.target.innerHTML = '';
      event.target.appendChild(optionElement);

      if(points == CARD){
        console.log("Ganaste")
        draggableElementData.innerHTML = '<p>WIN</p>'
        win = true;
      }
    } else {
      console.log("error es este")
    }
  })
})
  //   if(event.target.innerText == draggableElementData){
  //     points++;
  //     event.target.innerHTML = ''
  //     event.target.appendChild(optionElement)

  //     if(points == CARD){
  //       console.log("Ganaste")
  //       draggableElementData.innerHTML = `<p class="win">Ganaste!!</p>`
  //       win = true;
  //     }
  //   } else {
  //     console.log("Error")
  //   }
  // })



// // 