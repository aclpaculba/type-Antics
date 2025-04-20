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

// Word bank for random text generation
const wordBank = [
 "apple", "banana", "table", "chair", "window", "school", "pencil", "bottle",
"coffee", "shirt", "music", "friend", "phone", "book", "paper", "carpet",
"cloud", "river", "mountain", "beach", "sunset", "garden", "kitchen", "mirror",
"flower", "forest", "animal", "teacher", "student", "family", "holiday", "dream",
"sleep", "morning", "evening", "lunch", "dinner", "breakfast", "rain", "snow",
"hat", "shoes", "pants", "glasses", "toothbrush", "soap", "water", "juice",
"milk", "cookie", "bread", "egg", "butter", "cheese", "basket", "candle",
"gift", "party", "picture", "painting", "clock", "door", "lamp", "blanket",
"pillow", "notebook", "bag", "purse", "wallet", "key", "train", "bus",
"street", "road", "house", "apartment", "store", "market", "park", "tree",
"bike", "ball", "game", "movie", "song", "voice", "face", "hand",
"finger", "toe", "leg", "arm", "smile", "laugh", "hug", "kiss"

];

// Function to generate a random text string
function generateRandomText() {
  let words = [];
  for (let i = 0; i < 10; i++) {
    words.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
  }
  textString = words.join(" "); // Full sentence as a string
  textArray = textString.split(""); // Convert words to character array
  textContainer.innerHTML = textArray.map(char => `<span>${char}</span>`).join("");
}

// Start the timer
function startTimer() {
  if (isTyping) return;

  isTyping = true;
  interval = setInterval(() => {
    timer--;
    timeDisplay.textContent = timer;

    if (timer === 0) {
      clearInterval(interval);
      typingInput.disabled = true;
      showFinalStats();
    }
  }, 1000);
}

// Check user input and detect game completion
typingInput.addEventListener("input", () => {
  startTimer();

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
  });

  correctChars = correctCount;
  wordCount = Math.floor(correctCount / 5); // Approx. words = chars / 5

  // Update stats
  const accuracy = (correctCount / totalChars) * 100 || 100;
  accuracyDisplay.textContent = accuracy.toFixed(2);
  wpmDisplay.textContent = Math.round(wordCount * (60 / (60 - timer)));

  // **End game if the full text is typed**
  if (userInput.length === textString.length) {
    clearInterval(interval);
    typingInput.disabled = true;
    showFinalStats();
  }
});

// Restart game and generate new text
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

// Show final stats
function showFinalStats() {
  alert(`Test completed! WPM: ${wpmDisplay.textContent}, Accuracy: ${accuracyDisplay.textContent}%`);
}

// Generate random text on page load
generateRandomText();

// Focus on the hidden input when clicking anywhere
document.addEventListener("click", () => {
  typingInput.focus();
});
