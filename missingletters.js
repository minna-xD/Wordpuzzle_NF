const puzzles1 = [
  {
    word: "trillion",
    description: "1,000,000,000,000 or 10^12"
  },
  {
    word: "billion",
    description: "1,000,000,000 or 10^9"
  },
  {
    word: "quintillion",
    description: "1,000,000,000,000,000,000 or 10^18"
  },
  {
    word: "bit",
    description: "A morsel of digital information"
  },
  {
    word: "byte",
    description: "A pinch of digital information"
  }
];
const puzzles2 = [
  {
    word: "biljoona",
    description: "1 000 000 000 000 eli 10^12"
  },
  {
    word: "miljardi",
    description: "1 000 000 000 eli 10^9"
  },
  {
    word: "triljoona",
    description: "1 000 000 000 000 000 000 eli 10^18"
  },
  {
    word: "bitti",
    description: "Hitunen digitaalista tietoa"
  },
  {
    word: "tavu",
    description: "Hyppysellinen digitaalista tietoa"
  }
];

const vowels = ["a", "e", "i", "o", "u", "y"];
const gamesContainer1 = document.getElementById("games1");
const gamesContainer2 = document.getElementById("games2");

puzzles1.forEach((puzzle) => {
  createGameEN(puzzle.word.toLowerCase(), puzzle.description);
});
puzzles2.forEach((puzzle) => {
  createGameFI(puzzle.word.toLowerCase(), puzzle.description);
});

function createGameEN(word, description) {
  let revealed = Array(word.length).fill(false);

  // Reveal consonants initially
  for (let i = 0; i < word.length; i++) {
    if (!vowels.includes(word[i])) {
      revealed[i] = true;
    }
  }

  // Create DOM elements
  const gameDiv = document.createElement("div");
  const descP = document.createElement("p");
  const hintDiv = document.createElement("div");
  const input = document.createElement("input");
  const guessBtn = document.createElement("button");
  const hintBtn = document.createElement("button");
  const message = document.createElement("p");

  gameDiv.className = "game1";
  descP.textContent = description;
  guessBtn.textContent = "Guess";
  hintBtn.textContent = "❓";
  input.placeholder = "Type your guess";

  gameDiv.append(descP, hintDiv, input, guessBtn, hintBtn, message);
  gamesContainer1.appendChild(gameDiv);

  function updateHint() {
    hintDiv.textContent = revealed
      .map((show, i) => (show ? word[i] : "_"))
      .join("");
  }

  function giveHint() {
    for (let i = word.length - 1; i >= 0; i--) {
      if (!revealed[i]) {
        revealed[i] = true;
        updateHint();
        return;
      }
    }
  }

  function checkGuess() {
    if (input.value.toLowerCase() === word) {
      message.textContent = "🎉 Correct!";
    } else {
      message.textContent = "❌ Try again!";
    }
  }

  guessBtn.addEventListener("click", checkGuess);
  hintBtn.addEventListener("click", giveHint);

  updateHint();
}
function createGameFI(word, description) {
  let revealed = Array(word.length).fill(false);

  // Reveal consonants initially
  for (let i = 0; i < word.length; i++) {
    if (!vowels.includes(word[i])) {
      revealed[i] = true;
    }
  }

  // Create DOM elements
  const gameDiv = document.createElement("div");
  const descP = document.createElement("p");
  const hintDiv = document.createElement("div");
  const input = document.createElement("input");
  const guessBtn = document.createElement("button");
  const hintBtn = document.createElement("button");
  const message = document.createElement("p");

  gameDiv.className = "game2";
  descP.textContent = description;
  guessBtn.textContent = "Arvaa";
  hintBtn.textContent = "❓";
  input.placeholder = "Kirjoita arvauksesi";

  gameDiv.append(descP, hintDiv, input, guessBtn, hintBtn, message);
  gamesContainer2.appendChild(gameDiv);

  function updateHint() {
    hintDiv.textContent = revealed
      .map((show, i) => (show ? word[i] : "_"))
      .join("");
  }

  function giveHint() {
    for (let i = word.length - 1; i >= 0; i--) {
      if (!revealed[i]) {
        revealed[i] = true;
        updateHint();
        return;
      }
    }
  }

  function checkGuess() {
    if (input.value.toLowerCase() === word) {
      message.textContent = "🎉 Oikein!";
    } else {
      message.textContent = "❌ Yritä uudelleen!";
    }
  }

  guessBtn.addEventListener("click", checkGuess);
  hintBtn.addEventListener("click", giveHint);

  updateHint();
}
