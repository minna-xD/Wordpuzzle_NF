const puzzles1 = [
  {
    word: "banana",
    description: "A yellow fruit"
  },
  {
    word: "pajamas",
    description: "Sleepwear"
  },
  {
    word: "lambada",
    description: "A Brazilian dance popular in the 80s–90s"
  },
  {
    word: "abracadabra",
    description: "A magic word"
  },
  {
    word: "Canada",
    description: "A northern country"
  }
];
const puzzles2 = [
  {
    word: "vasara",
    description: "Tällä ei kannata ruuvia vääntää"
  },
  {
    word: "salama",
    description: "Näkyy ukkosella"
  },
  {
    word: "ananas",
    description: "Kuuluuko pizzaan vai ei?"
  },
  {
    word: "alpakka",
    description: "Vilukissan eksoottinen pelastaja"
  },
  {
    word: "kataja",
    description: "Liian korkealle tavoitteleva putoaa tähän"
  }
];

const consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "z"];
const gamesContainer1 = document.getElementById("games1");
const gamesContainer2 = document.getElementById("games2");

const inputs = [];

puzzles1.forEach((puzzle) => {
  createGameEN(puzzle.word.toLowerCase(), puzzle.description);
});
puzzles2.forEach((puzzle) => {
  createGameFI(puzzle.word.toLowerCase(), puzzle.description);
});

function createGameEN(word, description) {
  let revealed = Array(word.length).fill(false);

  // Vowels
  for (let i = 0; i < word.length; i++) {
    if (!consonants.includes(word[i])) {
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
  inputs.push(input);

  gameDiv.append(descP, hintDiv, input, guessBtn, hintBtn, message);
  gamesContainer1.appendChild(gameDiv);

  function updateHint() {
    hintDiv.textContent = revealed
      .map((show, i) => (show ? word[i] : ""))
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
    input.disabled = true;
    guessBtn.disabled = true;
    hintBtn.disabled = true;
  }

  function checkGuess() {
    if (input.value.toLowerCase() === word) {
      // Reveal all letters
      revealed = revealed.map(() => true);
      updateHint();

      message.textContent = "🎉 Correct!";

      // Lock current game
      input.disabled = true;
      guessBtn.disabled = true;
      hintBtn.disabled = true;

      // Focus next input
      const currentIndex = inputs.indexOf(input);
      const nextInput = inputs[currentIndex + 1];

      if (nextInput) {
        nextInput.focus();
      }
    } else {
      message.textContent = "❌ Try again!";
    }
  }

  guessBtn.addEventListener("click", checkGuess);
  hintBtn.addEventListener("click", giveHint);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkGuess();
    }
  });

  updateHint();
}
function createGameFI(word, description) {
  let revealed = Array(word.length).fill(false);

  // Vowels
  for (let i = 0; i < word.length; i++) {
    if (!consonants.includes(word[i])) {
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
  inputs.push(input);

  gameDiv.append(descP, hintDiv, input, guessBtn, hintBtn, message);
  gamesContainer2.appendChild(gameDiv);

  function updateHint() {
    hintDiv.textContent = revealed
      .map((show, i) => (show ? word[i] : ""))
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
    input.disabled = true;
    guessBtn.disabled = true;
    hintBtn.disabled = true;
  }

  function checkGuess() {
    if (input.value.toLowerCase() === word) {
      // Reveal all letters
      revealed = revealed.map(() => true);
      updateHint();

      message.textContent = "🎉 Oikein!";

      // Lock current game
      input.disabled = true;
      guessBtn.disabled = true;
      hintBtn.disabled = true;

      // Focus next input
      const currentIndex = inputs.indexOf(input);
      const nextInput = inputs[currentIndex + 1];

      if (nextInput) {
        nextInput.focus();
      }
    } else {
      message.textContent = "❌ Yritä uudelleen!";
    }
  }

  guessBtn.addEventListener("click", checkGuess);
  hintBtn.addEventListener("click", giveHint);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkGuess();
    }
  });

  updateHint();
}
