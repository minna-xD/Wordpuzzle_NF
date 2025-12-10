// Letter grid
const grid = [
    ["A", "T", "M", "L", "V", "I", "C", "Y", "T", "D"],
    ["S", "H", "C", "🚗", "S", "Z", "H", "L", "F", "Z"],
    ["N", "J", "X", "K", "R", "T", "R", "Y", "R", "M"],
    ["F", "D", "O", "J", "B", "R", "I", "D", "G", "E"],
    ["W", "C", "T", "R", "O", "E", "S", "I", "U", "R"],
    ["L", "A", "W", "R", "A", "I", "T", "H", "A", "R"],
    ["P", "N", "Q", "P", "I", "O", "M", "X", "W", "Y"],
    ["J", "D", "G", "E", "O", "E", "A", "N", "👨", "X"],
    ["N", "Y", "I", "L", "A", "R", "S", "B", "H", "M"],
    ["S", "C", "R", "A", "B", "B", "L", "E", "P", "A"],
    ["G", "A", "W", "V", "D", "K", "A", "U", "M", "S"],
    ["🎄", "N", "T", "Y", "B", "I", "N", "G", "C", "S"],
    ["M", "E", "S", "I", "U", "P", "D", "F", "I", "H"],
    ["Q", "S", "A", "E", "V", "K", "F", "A", "Q", "G"]
];

// Hidden solution path (continuous top → bottom)
const solutionPath = [
    { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 0, c: 6 },
    { r: 1, c: 6 },
    { r: 2, c: 6 }, { r: 2, c: 9 },
    { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 3, c: 6 }, { r: 3, c: 7 }, { r: 3, c: 8 }, { r: 3, c: 9 },
    { r: 4, c: 1 }, { r: 4, c: 6 }, { r: 4, c: 9 },
    { r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }, { r: 5, c: 5 }, { r: 5, c: 6 }, { r: 5, c: 7 }, { r: 5, c: 9 },
    { r: 6, c: 1 }, { r: 6, c: 6 }, { r: 6, c: 9 },
    { r: 7, c: 1 }, { r: 7, c: 6 }, { r: 7, c: 8 }, { r: 7, c: 9 },
    { r: 8, c: 1 }, { r: 8, c: 6 }, { r: 8, c: 9 },
    { r: 9, c: 0 }, { r: 9, c: 1 }, { r: 9, c: 2 }, { r: 9, c: 3 }, { r: 9, c: 4 }, { r: 9, c: 5 }, { r: 9, c: 6 }, { r: 9, c: 7 }, { r: 9, c: 9 },
    { r: 10, c: 1 }, { r: 10, c: 6 }, { r: 10, c: 9 },
    { r: 11, c: 1 }, { r: 11, c: 4 }, { r: 11, c: 5 }, { r: 11, c: 6 }, { r: 11, c: 7 },
    { r: 12, c: 1 }, { r: 12, c: 6 },
    { r: 13, c: 1 },
];

// If each vertical run on the solution path is a “word”:
const pathWords = ["VIC", "WRAITH", "BING", "BRIDGE", "MERRYXMAS", "👨X", "SCRABBLE", "CANDYCANES", "CHRISTMASLAND"];

// ----------------------------------------------
// EXTERNAL CONSTANTS YOU MUST DEFINE BEFORE THIS:
// const grid = [...];
// const solutionPath = [...];
// const pathWords = [...];
// ----------------------------------------------

// -------- CONFIG --------
const CELL = 40;
const rows = grid.length;
const cols = grid[0].length;

const OFFSET_X = 20;
const OFFSET_Y = 20;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rc = rough.canvas(canvas);
const generator = rc.generator;

// Dynamic size
canvas.width = cols * CELL + OFFSET_X * 2;
canvas.height = rows * CELL + OFFSET_Y * 2 + 40;

// -------- STATE --------
let permanentHighlights = [];
let foundWords = new Set();
let wordsFound = 0;

let selecting = false;
let selectedCells = [];

let showCongrats = false;
let buttonBox = null;  // store play-again button hit area

// -------- CACHE STATIC GRID --------
let cachedGrid = [];

function buildGridCache() {
  cachedGrid = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rect = generator.rectangle(
        c * CELL + OFFSET_X,
        r * CELL + OFFSET_Y,
        CELL,
        CELL,
        {
          stroke: '#444',
          strokeWidth: 1,
          fill: 'transparent',
          seed: 82517
        }
      );
      cachedGrid.push(rect);
    }
  }
}

// -------- UTILS --------
function cellAtPos(x, y) {
  const c = Math.floor((x - OFFSET_X) / CELL);
  const r = Math.floor((y - OFFSET_Y) / CELL);
  if (r >= 0 && r < rows && c >= 0 && c < cols) return { r, c };
  return null;
}
function key(r, c) { return `${r},${c}`; }

// -------- DRAW --------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw cached grid lines
  cachedGrid.forEach(shape => rc.draw(shape));

  // Permanent highlights
  permanentHighlights.forEach(h => {
    const shape = generator.rectangle(
      h.c * CELL + OFFSET_X,
      h.r * CELL + OFFSET_Y,
      CELL,
      CELL,
      {
        fill: h.color,
        fillStyle: 'zigzag',
        stroke: 'transparent',
        hachureAngle: 60,
        hachureGap: 4,
        roughness: 2,
        seed: 82517
      }
    );
    rc.draw(shape);
  });

  // Temporary selection
  selectedCells.forEach(s => {
    const shape = generator.rectangle(
      s.c * CELL + OFFSET_X,
      s.r * CELL + OFFSET_Y,
      CELL,
      CELL,
      {
        fill: 'rgba(173,216,230,1)',
        stroke: 'transparent',
        seed: 82517
      }
    );
    rc.draw(shape);
  });

  // Letters
  ctx.fillStyle = '#222';
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillText(
        grid[r][c],
        c * CELL + CELL / 2 + OFFSET_X,
        r * CELL + CELL / 2 + OFFSET_Y
      );
    }
  }

  // Word counter
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Words found: ${wordsFound} / ${pathWords.length}`, OFFSET_X, canvas.height - 25);

  // Start triangle
  const start = solutionPath[0];
  const startTri = generator.polygon(
    [start.c * CELL + CELL / 2,
    start.r * CELL + CELL / 2 - 15],
    [start.c * CELL + CELL / 2 - 10,
    start.r * CELL + CELL / 2 + 10],
    [start.c * CELL + CELL / 2 + 10,
    start.r * CELL + CELL / 2 + 10],
    { fill: 'green', seed: 82517 }
  );
  rc.draw(startTri);

  // End triangle
  const end = solutionPath[solutionPath.length - 1];
  const endTri = generator.polygon(
    [end.c * CELL + CELL / 2,
    end.r * CELL + CELL / 2 + 15],
    [end.c * CELL + CELL / 2 - 10,
    end.r * CELL + CELL / 2 - 10],
    [end.c * CELL + CELL / 2 + 10,
    end.r * CELL + CELL / 2 - 10],
    { fill: 'red', seed: 82517 }
  );
  rc.draw(endTri);

  // --------------------------------------------------------
  //  CONGRATS OVERLAY
  // --------------------------------------------------------
  if (showCongrats) {
    // Dim the background
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center box
    const boxW = 260;
    const boxH = 160;
    const boxX = (canvas.width - boxW) / 2;
    const boxY = (canvas.height - boxH) / 2;

    const msgBox = generator.rectangle(boxX, boxY, boxW, boxH, {
      fill: 'rgba(144,238,144,0.8)',
      fillStyle: 'zigzag',
      roughness: 2,
      seed: 82517
    });
    rc.draw(msgBox);

    // Main text
    ctx.fillStyle = '#222';
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Thanks for playing!', boxX + boxW / 2, boxY + 40);

    // --- PLAY AGAIN BUTTON ---
    const btnW = 150;
    const btnH = 50;
    const btnX = boxX + (boxW - btnW) / 2;
    const btnY = boxY + 80;

    const btn = generator.rectangle(btnX, btnY, btnW, btnH, {
      fill: 'rgba(144,238,144,1)',
      fillStyle: 'solid',
      stroke: '#333',
      roughness: 2,
      seed: 82517
    });
    rc.draw(btn);

    ctx.fillStyle = '#222';
    ctx.font = '20px Arial';
    ctx.fillText('Play again', btnX + btnW / 2, btnY + btnH / 2);

    // store clickable area
    buttonBox = { x: btnX, y: btnY, w: btnW, h: btnH };
  }
}

// -------- RESET FUNCTION (Play Again) --------
function resetGame() {
  permanentHighlights = [];
  foundWords = new Set();
  wordsFound = 0;
  selectedCells = [];
  selecting = false;
  showCongrats = false;
  buttonBox = null;
  draw();
}

// -------- SELECTION HANDLERS --------
canvas.addEventListener('mousedown', e => {
  if (showCongrats) return;

  selecting = true;
  selectedCells = [];
});

canvas.addEventListener('mouseup', e => {
  if (showCongrats) return;

  selecting = false;
  finishSelection();
  selectedCells = [];
  draw();
});

canvas.addEventListener('mousemove', e => {
  if (!selecting || showCongrats) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const cell = cellAtPos(x, y);
  if (!cell) return;
  if (!selectedCells.some(s => s.r === cell.r && s.c === cell.c)) {
    selectedCells.push(cell);
    draw();
  }
});

// --- Handle clicking "Play Again"
canvas.addEventListener('click', e => {
  if (!showCongrats || !buttonBox) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    x >= buttonBox.x &&
    x <= buttonBox.x + buttonBox.w &&
    y >= buttonBox.y &&
    y <= buttonBox.y + buttonBox.h
  ) {
    resetGame();
  }
});

// -------- FINISH SELECTION --------
function finishSelection() {
  if (selectedCells.length === 0) return;

  const wordString = selectedCells.map(s => grid[s.r][s.c]).join("");
  const solSet = new Set(solutionPath.map(p => key(p.r, p.c)));

  if (pathWords.includes(wordString) && !foundWords.has(wordString)) {
    foundWords.add(wordString);
    wordsFound = foundWords.size;

    permanentHighlights = permanentHighlights.filter(h => {
      const inWord = selectedCells.some(s => s.r === h.r && s.c === h.c);
      return !(inWord && h.color === 'orange');
    });

    selectedCells.forEach(s => {
      if (!permanentHighlights.some(h => h.r === s.r && h.c === s.c))
        permanentHighlights.push({ r: s.r, c: s.c, color: 'lightgreen' });
    });

    if (wordsFound >= pathWords.length) {
      showCongrats = true;
    }
  } else {
    const intersections = selectedCells.filter(s => solSet.has(key(s.r, s.c)));
    intersections.forEach(s => {
      if (!permanentHighlights.some(h => h.r === s.r && h.c === s.c))
        permanentHighlights.push({ r: s.r, c: s.c, color: 'orange' });
    });
  }
}

// -------- INITIALIZE --------
buildGridCache();
draw();
