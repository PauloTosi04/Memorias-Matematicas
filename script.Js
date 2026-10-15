console.log("Js carregado");
const board = document.getElementById("game-board");
const tempoEl = document.getElementById("tempo");
const tentativasEl = document.getElementById("tentativas");

let firstCard = null;
let secondCard = null;
let lock = false;
let tentativas = 0;
let tempo = 0;
let timerInterval;

function gerarContas(qtdPares = 6) {
  const operacoes = ["+", "-", "×", "÷"];
  const pares = [];

  while (pares.length < qtdPares) {
    const op = operacoes[Math.floor(Math.random() * operacoes.length)];
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    let resultado;

    switch (op) {
      case "+":
        resultado = a + b;
        break;
      case "-":
        resultado = a - b;
        break;
      case "×":
        resultado = a * b;
        break;
      case "÷":
        // garante que a/b seja inteiro
        resultado = a;
        a = a * b; // ex: 6 ÷ 3 = 2 → vira 6 ÷ 3
        break;
    }

    if (resultado >= 0 && Number.isInteger(resultado)) {
      const conta = `${a} ${op} ${b}`;
      if (!pares.some(p => p.answer === resultado.toString())) {
        pares.push({ question: conta, answer: resultado.toString() });
      }
    }
  }

  return pares;
}

function startGame() {
  board.innerHTML = "";
  tentativas = 0;
  tempo = 0;
  atualizarStatus();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    tempo++;
    tempoEl.textContent = tempo;
  }, 1000);

  const pairs = gerarContas(6);
  const cards = [];

  pairs.forEach(pair => {
    cards.push({ text: pair.question, match: pair.answer });
    cards.push({ text: pair.answer, match: pair.question });
  });

  cards.sort(() => Math.random() - 0.5);

  cards.forEach(info => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.match = info.match;
    card.textContent = "?";
    card.addEventListener("click", () => flipCard(card, info.text));
    board.appendChild(card);
  });
}

function flipCard(card, text) {
  if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  card.textContent = text;

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    tentativas++;
    atualizarStatus();
    checkMatch();
  }
}

function checkMatch() {
  lock = true;

  const isMatch =
    firstCard.dataset.match === secondCard.textContent ||
    secondCard.dataset.match === firstCard.textContent;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    resetTurn();
    verificarVitoria();
  } else {
    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [firstCard, secondCard, lock] = [null, null, false];
}

function verificarVitoria() {
  const todas = document.querySelectorAll(".card");
  const vencidas = document.querySelectorAll(".matched");

  if (todas.length === vencidas.length) {
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`🎉 Parabéns! Você encontrou todos os pares!\n⏱ Tempo: ${tempo}s\n🔢 Tentativas: ${tentativas}`);
    }, 300);
  }
}

function atualizarStatus() {
  tempoEl.textContent = tempo;
  tentativasEl.textContent = tentativas;
}

startGame();
