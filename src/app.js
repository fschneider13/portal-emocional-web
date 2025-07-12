// src/app.js

import { scorePHQ9, scoreGAD7, scoreDASS21 } from './score.js';

const tests = {
  phq9: {
    title: 'PHQ-9',
    questions: [
      'Pouco interesse ou prazer em fazer as coisas',
      'Sentir-se para baixo, deprimido ou sem perspectiva',
      'Dificuldade para pegar no sono ou permanecer dormindo, ou dormir em excesso',
      'Sentir-se cansado ou com pouca energia',
      'Falta de apetite ou comer demais',
      'Sentir-se mal consigo mesmo, sentir que é um fracasso ou que decepcionou sua família',
      'Dificuldade de concentração nas coisas, como ler o jornal ou ver televisão',
      'Mover-se ou falar tão devagar que as outras pessoas poderiam ter notado? Ou o oposto, ficando agitado ou inquieto mais que o habitual',
      'Pensamentos de que seria melhor estar morto ou se cortar de alguma forma'
    ],
    options: ['Nunca', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
    scorer: scorePHQ9
  },
  gad7: {
    title: 'GAD-7',
    questions: [
      'Sentir-se nervoso, ansioso ou no limite',
      'Não conseguir parar ou controlar a preocupação',
      'Preocupar-se demais com diferentes coisas',
      'Dificuldade para relaxar',
      'Ficar tão inquieto que é difícil ficar parado',
      'Facilmente ficar irritado ou aborrecido',
      'Sentir medo como se algo terrível pudesse acontecer'
    ],
    options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
    scorer: scoreGAD7
  },
  dass21: {
    title: 'DASS-21',
    questions: [
      'Me senti deprimido(a), melancólico(a) ou sem esperança',
      'Senti boca seca',
      'Não consegui vivenciar nenhum sentimento positivo',
      'Senti que estava respirando de forma ofegante (dificuldade para respirar, mesmo sem esforço físico)',
      'Tive dificuldade em "relaxar"',
      'Não consegui, de maneira alguma, ter iniciativa para fazer as coisas',
      'Tive tendência a reagir emocionalmente a situações',
      'Senti tremores (por exemplo, nas mãos)',
      'Senti que estava utilizando muita energia nervosa',
      'Me senti preocupado(a) com situações em que poderia entrar em pânico e passar vergonha',
      'Senti que não tinha nada a que ansiar',
      'Senti-me agitado(a)',
      'Achei difícil relaxar',
      'Me senti deprimido e sem ânimo',
      'Fui intolerante com tudo que me impedia de continuar o que eu estava fazendo',
      'Senti que estava perto de entrar em pânico',
      'Não consegui me entusiasmar com nada',
      'Senti que não tinha valor nenhum como pessoa',
      'Senti que estava irritado(a)',
      'Senti tremores',
      'Senti que a vida não tinha sentido'
    ],
    options: ['Nunca', 'Às vezes', 'Com frequência', 'Quase sempre'],
    scorer: scoreDASS21
  }
};

let currentTestKey = '';
let currentTest = null;
let currentQuestion = 0;
let answers = [];

const homeSection = document.getElementById('home');
const consentSection = document.getElementById('consent-section');
const questionSection = document.getElementById('questionnaire');
const questionContainer = document.getElementById('question-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const resultSection = document.getElementById('result');
const scoreDiv = document.getElementById('score');
const chartCanvas = document.getElementById('chart');
const downloadBtn = document.getElementById('download-pdf');

function renderQuestion() {
  const q = currentTest.questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];
  const opts = currentTest.options
    .map((o, i) => {
      const checked = currentAnswer === i ? 'checked' : '';
      return `<label><input type="radio" name="answer" value="${i}" ${checked}> ${o}</label>`;
    })
    .join('<br/>');
  questionContainer.innerHTML = `
    <h3>${q}</h3>
    <div class="options">${opts}</div>
  `;
  prevBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
  nextBtn.textContent = currentQuestion === currentTest.questions.length - 1 ? 'Finalizar' : 'Próximo';
}

function saveAnswer() {
  const selected = questionContainer.querySelector('input[name="answer"]:checked');
  if (!selected) return false;
  answers[currentQuestion] = Number(selected.value);
  localStorage.setItem(`${currentTestKey}-answers`, JSON.stringify(answers));
  return true;
}

function showResult() {
  questionSection.classList.add('hidden');
  resultSection.classList.remove('hidden');

  const result = currentTest.scorer(answers);

  if (currentTestKey === 'dass21') {
    scoreDiv.innerHTML = `
      Depressão: ${result.depression.score} (${result.depression.level})<br/>
      Ansiedade: ${result.anxiety.score} (${result.anxiety.level})<br/>
      Estresse: ${result.stress.score} (${result.stress.level})
    `;
    new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: ['Depressão', 'Ansiedade', 'Estresse'],
        datasets: [{ label: 'Pontuação', data: [result.depression.score, result.anxiety.score, result.stress.score] }]
      }
    });
  } else {
    scoreDiv.textContent = `Pontuação: ${result.total} (${result.level})`;
    new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: [currentTest.title],
        datasets: [{ label: 'Pontuação', data: [result.total] }]
      }
    });
  }
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(scoreDiv.innerText, 10, 10);
  doc.save('resultado.pdf');
}

function startTest(key) {
  currentTestKey = key;
  currentTest = tests[key];
  currentQuestion = 0;
  answers = JSON.parse(localStorage.getItem(`${key}-answers`) || '[]');
  homeSection.classList.add('hidden');
  questionSection.classList.remove('hidden');
  renderQuestion();
}

function initConsent() {
  const acceptBtn = document.getElementById('accept-consent');
  if (!localStorage.getItem('consent')) {
    consentSection.classList.remove('hidden');
  }
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('consent', 'true');
    consentSection.classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Consentimento
  initConsent();

  // Iniciar testes pelos cards
  document.querySelectorAll('.card').forEach(card => {
    card.querySelector('button').addEventListener('click', () => {
      startTest(card.dataset.test);
    });
  });

  // Navegação das perguntas
  prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0 && saveAnswer()) {
      currentQuestion--;
      renderQuestion();
    }
  });
  nextBtn.addEventListener('click', () => {
    if (!saveAnswer()) return;
    if (currentQuestion < currentTest.questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      showResult();
    }
  });

  // Exportar PDF
  downloadBtn.addEventListener('click', downloadPDF);
});
