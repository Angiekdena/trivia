let puntaje = 0;
let trivia_categories = [];
let select = document.getElementById("categoria");
let preguntaActual = 0;
let respuestaCorrecta = "";
let preguntasTotales = [];

document.getElementById("buscar").addEventListener("click", consultarPregunta);

document
  .getElementById("reinicioTrivia")
  .addEventListener("click", pantallainicial);

function renderizarPregunta(pregunta) {
  let preguntaMostrada = pregunta[preguntaActual];
  document.getElementById(
    "pregunta"
  ).innerHTML = `${preguntaMostrada.question}`;

  let respuestas = preguntaMostrada.incorrect_answers;
  respuestas.push(preguntaMostrada.correct_answer);
  console.log(respuestas);

  respuestaCorrecta = decodeHtml(preguntaMostrada.correct_answer);
  console.log(respuestaCorrecta);

  let respuestasHtml = "";

  respuestas.sort(() => Math.random() - 0.5);

  respuestas.forEach((respuesta) => {
    respuestasHtml += `<div class="col-md-6 mb-2 px-2 cursor-pointer">
    <div class="answer rounded bg-light text-secondary-emphasis" data-value="${respuesta}">${respuesta}</div>
    </div>`;
  });
  document.getElementById("respuestas").innerHTML = respuestasHtml;

  document.querySelectorAll(".answer").forEach((boton) => {
    boton.addEventListener("click", validarRespuesta);
  });
}

function validarRespuesta(e) {
  let respuestaSeleccionada = e.target.getAttribute("data-value");
  console.log(respuestaSeleccionada);
  if (respuestaSeleccionada === respuestaCorrecta) {
    puntaje += 100;
    document.getElementById("score").innerHTML = `${puntaje}`;
    e.target.classList.add("correcto");
  } else{
    e.target.classList.add("incorrecto");
  }

  setTimeout(function () {
    preguntaActual++;
    if (preguntaActual < preguntasTotales.length) {
      renderizarPregunta(preguntasTotales);
    } else {
      document.getElementById("respuestas").innerHTML =
        "<h2>Has completado la trivia</h2>";
    }
  }, 1000);
}

fetch("https://opentdb.com/api_category.php")
  .then((response) => response.json())
  .then((data) => {
    data.trivia_categories.forEach((category) => {
      var opcion = document.createElement("option");
      opcion.value = category.id;
      opcion.text = category.name;
      select.add(opcion);
    });
  })
  .catch((e) => {
    console.error("Error:", e);
  });

function consultarPregunta() {
  let selecCategoria = document.getElementById("categoria").value;
  let selecDificultad = document.getElementById("dificultad").value;
  let selecTipo = document.getElementById("tipo").value;

  document.getElementById("parte1").classList.add("d-none");
  document.getElementById("parte2").classList.remove("d-none");

  fetch(
    `https://opentdb.com/api.php?amount=10&category=${selecCategoria}&difficulty=${selecDificultad}&type=${selecTipo}`
  )
    .then((response) => response.json())
    .then((data) => {
      preguntasTotales = data.results;

      renderizarPregunta(preguntasTotales);
    })
    .catch((e) => {
      console.error("Error:", e);
    });
}

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.textContent;
}

function pantallainicial() {
  document.getElementById("parte1").classList.remove("d-none");
  document.getElementById("parte2").classList.add("d-none");
  puntaje = 0;
  preguntaActual = 0;
  respuestaCorrecta = "";
  preguntasTotales = [];
}
