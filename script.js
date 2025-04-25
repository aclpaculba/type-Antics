const textContainer = document.getElementById("text-container");
const typingInput = document.getElementById("typing-input");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart-btn");

let timer = 60;
let interval;
let isTyping = false;
let wordCount = 0;
let correctChars = 0;
let totalChars = 0;
let textArray = [];
let textString = "";

const wordBank = [
  "banana", "object", "laptop", "sample", "design", "planet", "orange", "number", "hidden", "simple"
];

function generateRandomText() {
  let words = [];
  for (let i = 0; i < 10; i++) {
    words.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
  }
  textString = words.join(" ");
  textArray = textString.split("");
  textContainer.innerHTML = textArray.map(char => `<span>${char}</span>`).join("");
}

function startTimer() {
  isTyping = true;
  interval = setInterval(() => {
    timer--;
    timeDisplay.textContent = timer;

    if (timer === 0) {
      clearInterval(interval);
      typingInput.disabled = true;
      showFinalStats(); // backup — just in case user never finishes typing
    }
  }, 1000);
}

typingInput.addEventListener("input", () => {
  if (!isTyping) startTimer();

  const userInput = typingInput.value;
  totalChars = userInput.length;

  let correctCount = 0;

  textArray.forEach((char, index) => {
    const span = textContainer.children[index];
    const typedChar = userInput[index];

    if (typedChar === undefined) {
      span.classList.remove("correct", "incorrect");
      span.style.opacity = 0.4;
    } else if (typedChar === char) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      span.style.opacity = 1;
      correctCount++;
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
      span.style.opacity = 1;
    }

    if (index === userInput.length - 1 && span) {
      span.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  });

  correctChars = correctCount;
  wordCount = Math.floor(correctCount / 5);

  const accuracy = (correctCount / totalChars) * 100 || 100;
  accuracyDisplay.textContent = accuracy.toFixed(2);
  wpmDisplay.textContent = Math.round(wordCount * (60 / (60 - timer)));

  const currentSpan = textContainer.children[userInput.length] || textContainer.lastElementChild;
moveCaretToSpan(currentSpan);


  // Immediately end game if the full text is typed
  if (userInput.length === textString.length) {
    clearInterval(interval);
    typingInput.disabled = true;
    showFinalStats();
  }
});

restartBtn.addEventListener("click", () => {
  clearInterval(interval);
  isTyping = false;
  timer = 60;
  wordCount = 0;
  correctChars = 0;
  totalChars = 0;

  timeDisplay.textContent = timer;
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 100;

  typingInput.value = "";
  typingInput.disabled = false;

  generateRandomText();
});

function savePerformance(wpm, accuracy) {
  const history = JSON.parse(localStorage.getItem("performanceHistory") || "[]");
  history.push({
    date: new Date().toISOString().split("T")[0],
    wpm: parseInt(wpm),
    accuracy: parseFloat(accuracy)
  });
  localStorage.setItem("performanceHistory", JSON.stringify(history));
}

function showFinalStats() {
  const wpm = wpmDisplay.textContent;
  const accuracy = accuracyDisplay.textContent;

  savePerformance(wpm, accuracy);
  window.location.href = `results.html?wpm=${wpm}&accuracy=${accuracy}`;
}

generateRandomText();

document.addEventListener("click", () => {
  typingInput.focus();

});

function moveCaretToSpan(span) {
  const caret = document.getElementById("caret");
  if (!span) return;
  const rect = span.getBoundingClientRect();
  const containerRect = textContainer.getBoundingClientRect();

  caret.style.top = `${rect.top - containerRect.top + textContainer.scrollTop}px`;
  caret.style.left = `${rect.left - containerRect.left + textContainer.scrollLeft}px`;
}

