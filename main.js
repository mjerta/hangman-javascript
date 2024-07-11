const keyCodeToLetter = {
  97: 'a',
  98: 'b',
  99: 'c',
  100: 'd',
  101: 'e',
  102: 'f',
  103: 'g',
  104: 'h',
  105: 'i',
  106: 'j',
  107: 'k',
  108: 'l',
  109: 'm',
  110: 'n',
  111: 'o',
  112: 'p',
  113: 'q',
  114: 'r',
  115: 's',
  116: 't',
  117: 'u',
  118: 'v',
  119: 'w',
  120: 'x',
  121: 'y',
  122: 'z'
};

const words = ["apple", "banana", "orange", "grape", "pineapple", "kiwi", "strawberry", "blueberry", "watermelon", "peach", "pear", "plum", "mango", "cherry", "apricot", "fig", "lemon", "lime", "coconut", "pomegranate", "raspberry", "blackberry", "nectarine", "avocado", "guava", "persimmon", "melon", "dragonfruit"];

const output = document.querySelector(".word-result");
const selectedWord = getRandomWord(words);
const summary = document.querySelector(".summary");
let guessedLetters = new Set();
let wrongInput = 0;
let rightInput = 0;
const imageElement = document.querySelector(".hangman");

function getRandomWord(words) {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
  0
}

function visualizeHangmanLetters(word, guessedLetters) {
  output.textContent = ""; // Clear previous output
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    if (guessedLetters.has(letter)) {
      output.textContent += letter + " ";
    } else {
      output.textContent += "_ ";
    }
  }
}

function visualizeHangman() {
  if (wrongInput === 1) {
    imageElement.src = './assets/hangman-1.svg';
  } else if (wrongInput === 2) {
    imageElement.src = './assets/hangman-2.svg';
  } else if (wrongInput === 3) {
    imageElement.src = './assets/hangman-3.svg';
  } else if (wrongInput === 4) {
    imageElement.src = './assets/hangman-4.svg';
  } else if (wrongInput === 5) {
    imageElement.src = './assets/hangman-5.svg';
  } else if (wrongInput === 6) {
    imageElement.src = './assets/hangman-6.svg';
    console.log(summary);
    summary.textContent = "You lost buddy";
    console.log("you lost buddy");
  } else {
    imageElement.src = './assets/hangman-0.svg'; // Default image if no condition matches

  }
  console.log(wrongInput);
}

function handleWrongInput(wrongInput) {
  visualizeHangman();
  if (wrongInput === 6) {
    summary.textContent = "You lost buddy";
  } else {
    summary.textContent = "Enter a letter";
  }
}

function handleRightInput(letter) {
  if (guessedLetters.size >= 1 && guessedLetters.has(letter)) {
    console.log("test1")
    summary.textContent = "You already got this letter";
  } else {
    console.log(letter);
    console.log(selectedWord.split(letter).length - 1);
    rightInput++;
    console.log(`right input ${rightInput}`);
    guessedLetters.add(letter);
    summary.textContent = "You guest a correct letter";
    console.log(rightInput)
    console.log(selectedWord.length);
    if (rightInput === selectedWord.length) {
      summary.textContent = "You won";
    }

    visualizeHangmanLetters(selectedWord, guessedLetters, letter);
  }
}

function checkLetter(letter) {
  if (!selectedWord.includes(letter)) {
    wrongInput++;
    handleWrongInput(wrongInput)
  } else {
    handleRightInput(letter);

  }
}

function handleKeyPress(event) {
  const keyCode = event.keyCode;
  if (keyCode >= 97 && keyCode <= 122) {
    const letter = keyCodeToLetter[keyCode];
    console.log(letter);
    checkLetter(letter);
  }
}

document.addEventListener('keypress', handleKeyPress);

visualizeHangmanLetters(selectedWord, guessedLetters);
visualizeHangman();
console.log("test");
console.log(wrongInput);
