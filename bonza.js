// =======================================================
// Bonza-style puzzle with vertical stacks
// =======================================================

const CELL = 28;
const SNAP_DISTANCE = 12;

// ---------------------------
// Tile (fragment)
class Tile {
  constructor(text, x, y, direction = 'horizontal') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.direction = direction; // 'horizontal' or 'vertical'
    this.offsetX = 0;
    this.offsetY = 0;
    this.connectedTo = null; // tile below which this is stacked
    this.cluster = [this];   // group of connected tiles
  }

  draw(rc, ctx) {
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#333';

    for (let i = 0; i < this.text.length; i++) {
      const { x, y } = this.getLetterPosition(i);

      rc.rectangle(x, y, CELL, CELL, {
        roughness: 1.2,
        fill: '#fffef5',
        stroke: '#444'
      });

      ctx.fillText(this.text[i], x + CELL / 2 - 5, y + CELL / 2 + 6);
    }
  }

  contains(px, py) {
    for (let i = 0; i < this.text.length; i++) {
      const { x, y } = this.getLetterPosition(i);
      if (
        px >= x &&
        px <= x + CELL &&
        py >= y &&
        py <= y + CELL
      ) return true;
    }
    return false;
  }

  getLetterPosition(index) {
    return {
      x: this.x + (this.direction === 'horizontal' ? index * CELL : 0),
      y: this.y + (this.direction === 'vertical' ? index * CELL : 0)
    };
  }

  getLetters() {
    const letters = [];
    for (let i = 0; i < this.text.length; i++) {
      const pos = this.getLetterPosition(i);
      letters.push({
        char: this.text[i],
        index: i,
        tile: this,
        cx: pos.x + CELL / 2,
        cy: pos.y + CELL / 2
      });
    }
    return letters;
  }

  // cluster move helper
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    if (this.cluster) {
      for (const t of this.cluster) {
        if (t !== this) {
          t.x += dx;
          t.y += dy;
        }
      }
    }
  }

  // top/bottom connectors for vertical stacking
  getTopConnector() {
    const pos = this.getLetterPosition(0);
    return { cx: pos.x + CELL / 2, cy: pos.y + CELL / 2 };
  }

  getBottomConnector() {
    const last = this.text.length - 1;
    const pos = this.getLetterPosition(last);
    return { cx: pos.x + CELL / 2, cy: pos.y + CELL / 2 };
  }
}

// ---------------------------
// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rc = rough.canvas(canvas);

// Example fragments
const tiles = [
  new Tile('KIS', 60, 160, 'horizontal'),
  new Tile('UK', 144, 160, 'horizontal'),
  new Tile('EIJ', 200, 160, 'horizontal'),
  new Tile('U', 284, 160, 'horizontal'),

  new Tile('KÄT', 200, 60, 'vertical'),
  new Tile('AT', 200, 148, 'vertical'),
  new Tile('TI', 200, 210, 'vertical')
];

let activeTile = null;

// ---------------------------
// Mouse interaction
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = tiles.length - 1; i >= 0; i--) {
    if (tiles[i].contains(x, y)) {
      activeTile = tiles[i];
      activeTile.offsetX = x - activeTile.x;
      activeTile.offsetY = y - activeTile.y;

      // bring to front
      tiles.splice(i, 1);
      tiles.push(activeTile);
      draw();
      break;
    }
  }
});

canvas.addEventListener('mousemove', e => {
  if (!activeTile) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  activeTile.move(x - activeTile.offsetX - activeTile.x, y - activeTile.offsetY - activeTile.y);
  draw();
});

canvas.addEventListener('mouseup', () => {
  if (activeTile) {
    if (!tryAnchorSnap(activeTile)) {
      tryStackSnap(activeTile);
    }
  }
  activeTile = null;
});

canvas.addEventListener('mouseleave', () => {
  activeTile = null;
});

// ---------------------------
// Letter-based snapping to horizontal tiles
function tryAnchorSnap(tile) {
  const lettersA = tile.getLetters();
  for (const other of tiles) {
    if (other === tile) continue;
    if (other.direction !== 'horizontal') continue;

    const lettersB = other.getLetters();
    for (const a of lettersA) {
      for (const b of lettersB) {
        if (a.char !== b.char) continue;

        const dx = a.cx - b.cx;
        const dy = a.cy - b.cy;
        const distance = Math.hypot(dx, dy);

        if (distance < SNAP_DISTANCE) {
          tile.move(-dx, -dy);
          // attach to cluster
          tile.connectedTo = other;
          tile.cluster = [tile, ...other.cluster];
          draw();
          return true;
        }
      }
    }
  }
  return false;
}

// ---------------------------
// Vertical stack snapping (tile on top of another vertical)
function tryStackSnap(tile) {
  if (tile.direction !== 'vertical') return false;

  for (const other of tiles) {
    if (other === tile) continue;
    if (other.direction !== 'vertical') continue;

    const top = tile.getTopConnector();
    const bottom = other.getBottomConnector();

    const dx = top.cx - bottom.cx;
    const dy = top.cy - (bottom.cy + CELL);

    if (Math.hypot(dx, dy) < SNAP_DISTANCE) {
      tile.move(-dx, -dy);
      tile.connectedTo = other;
      // merge clusters
      tile.cluster = [...other.cluster, tile];
      draw();
      return true;
    }
  }
  return false;
}

// ---------------------------
// Render
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tiles.forEach(tile => tile.draw(rc, ctx));
}

draw();
