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
let selectedWord = getRandomWord(words);

const result = document.querySelector(".result-section");
const wordResult = document.querySelector(".word-result");
const mainAction = document.querySelector(".main-action");
const optionalAction = document.querySelector(".optional-action");
const imageElementHangman = document.querySelector(".hangman");
const fullGuessForm = document.querySelector(".full-guess-form");
const fullGuessInput = document.querySelector(".full-guess-input");
let gameFinished = false;

let guessedLetters = [];
// The following will keep track of the wrong and right inputs
let wrongInput = 0;
let rightInput = 0;

function getRandomWord(words) {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function visualizeHangmanLetters() {
  // This will clear previous output and will print the updates output
  wordResult.textContent = "";
  for (let i = 0; i < selectedWord.length; i++) {
    const letter = selectedWord[i];
    if (guessedLetters.includes(letter)) {
      wordResult.textContent += letter + " ";
    } else {
      wordResult.textContent += "_ ";
    }
  }
}

function visualizeHangman() {
  switch (wrongInput) {
    case 1:
      imageElementHangman.src = './assets/hangman-1.svg';
      break;
    case 2:
      imageElementHangman.src = './assets/hangman-2.svg';
      break;
    case 3:
      imageElementHangman.src = './assets/hangman-3.svg';
      break;
    case 4:
      imageElementHangman.src = './assets/hangman-4.svg';
      break;
    case 5:
      imageElementHangman.src = './assets/hangman-5.svg';
      break;
    case 6:
      imageElementHangman.src = './assets/hangman-6.svg';
      break;
    default:
      imageElementHangman.src = './assets/hangman-0.svg'; // Default image if no condition matches
  }
}

function handleWrongInput(wrongInput) {
  visualizeHangman();
  if (wrongInput === 6) {
    mainAction.textContent = "You lost buddy, the word should have been:";
    optionalAction.textContent = "";
    wordResult.textContent = formatStringForResult(selectedWord);
    gameFinished = true;
    initializeGame();
  } else {
    mainAction.textContent = "wrong guess";
  }
}

function handleRightInput(letter) {
  // Below message will only been shown if the player already guessed once at least and if the letter already exists in the guessedLetters array.
  if (guessedLetters.length >= 1 && guessedLetters.includes(letter)) {
    mainAction.textContent = "You already got this letter";
  } else {
    mainAction.textContent = "You guest a correct letter";
    // This will get the guessed letter and if there are more duplicates it will add them to the rightInput variable
    rightInput += selectedWord.split(letter).length - 1;
    guessedLetters.push(letter);
    // Eventually if the the all letters has been guessed the game is over. And initialize game will be activated.
    if (rightInput === selectedWord.length) {
      mainAction.textContent = "You won";
      gameFinished = true;
      initializeGame();
    }
    // The hangman will be updated to the correct image
    visualizeHangmanLetters();
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

function formatStringForResult(string) {
  return string.split("").join(" ");
}

function checkFullWord(e, word) {
  e.preventDefault();
  e.target.reset();
  if (selectedWord !== word) {
    wrongInput++;
    handleWrongInput(wrongInput)
  } else {
    wordResult.textContent = formatStringForResult(word);
    mainAction.textContent = "You won";
    gameFinished = true;
    initializeGame();
  }
}

function handleKeyPress(event) {
  if (!musicStartPlaying) {
    playMusic();
  }
  // This will prevent the key handling is also being activated while pressing inside the input element
  if (document.activeElement === fullGuessInput) {
    return;
  }
  const keyCode = event.keyCode;
  if (keyCode >= 97 && keyCode <= 122) {
    const letter = keyCodeToLetter[keyCode];
    checkLetter(letter);
  }
}

function refreshAllValuesForGame() {
  selectedWord = getRandomWord(words);
  mainAction.textContent = "Enter your first letter";
  guessedLetters.length = 0;
  wrongInput = 0;
  rightInput = 0;
}

function initializeGame() {

  if (!gameFinished) {
    document.addEventListener('keypress', handleKeyPress);
    fullGuessForm.addEventListener('submit', (e) => {
      checkFullWord(e, fullGuessInput.value);
    });
    // The following will run the first time the page is loaded
    visualizeHangmanLetters();
    visualizeHangman();
  } else {
    // This will get rid of the 2 event listeners
    document.removeEventListener('keypress', handleKeyPress);
    fullGuessForm.removeEventListener('submit', (e) => {
      checkFullWord(e, fullGuessInput.value);
    });
    // restart the game
    const restartGameButton = document.createElement("button");
    restartGameButton.classList.add("btn-game-starter");
    restartGameButton.textContent = "Start again";
    result.appendChild(restartGameButton);
    restartGameButton.addEventListener("click", () => {
      gameFinished = false;
      restartGameButton.remove();
      refreshAllValuesForGame();
      initializeGame()
    });
  }
}

// The initializeGame will start with every load of this page
initializeGame();


// Below is the part that is handling the music and the story line
let musicStartPlaying = false;
const audio = new Audio("https://www.televisiontunes.com/uploads/audio/The%20Good%20the%20Bad%20and%20the%20Ugly.mp3");
const audio2 = new Audio("./assets/mp3-files/howdy.mp3");
const audioBtn = document.querySelector(".play-music-button");
let audioBtnIsPressed = false;

function playMusic() {
  musicStartPlaying = true;
  audio.play().catch(error => {
    console.error("Error playing the audio: ", error)
  })
  audio2.play().catch(error => {
    console.error("Error playing the audio: ", error);
  })
}

function toggleSoundAudioButton() {
  if (!audioBtnIsPressed) {
    audioBtnIsPressed = true;
    audio.volume = 0;
    audio2.volume = 0;
    audioBtn.src = './assets/volume-off.svg';
  } else {
    audioBtnIsPressed = false;
    audio.volume = 1;
    audioBtn.src = './assets/volume-on.svg';
  }
}

audioBtn.addEventListener("click", toggleSoundAudioButton);

audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  playMusic();
});

const story = "\n" +
    "In the dusty town of Sundown, the townsfolk gathered around the gallows as a mysterious stranger challenged them to a gam of Hangman. Each correct guess brought hope, each wrong one brought doom. Sweat dripped as they revealed the word: S H E R I F F. The stranger’s revelation shocked them all: the bandit was their own sheriff. Justice would be served, but trust was forever shattered in Sundown.";
const storyText = document.querySelector(".story-text");
let index = 0;

function showNextLetter() {
  if (index < story.length) {
    storyText.textContent += story[index];
    index++;
    setTimeout(showNextLetter, 100);
  }
}

showNextLetter();
