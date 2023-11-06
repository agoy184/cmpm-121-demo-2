/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./style.css";
const app: HTMLDivElement = document.querySelector("#app")!;

// Title
const gameName = "Drawing Game!😂";
document.title = gameName;
const header = document.createElement("h2");
header.innerHTML = gameName;
app.append(header);

// Canvas creation
const canvas = document.createElement("canvas");
canvas.width = 150;
canvas.height = 150;
const canvasX = 0;
const canvasY = 0;

const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "yellow";
ctx.fillRect(canvasX, canvasY, canvas.width, canvas.height);
app.append(canvas);

// Drawing creation
let isDrawing = false;
let x = 0;
let y = 0;
const zero = 0;
const one = 1;
const two = 2;
const three = 3;
const four = 4;
const five = 5;
let toolRadius = 0;
let thickChecker = 0; // 1 is thin, 5 is thick
interface Point {
  x: number;
  y: number;
}
class Command {
  arrayOfPoints: Point[] = [];

  display(ctx: CanvasRenderingContext2D) {
    let prevPoint = this.arrayOfPoints[zero];
    ctx.beginPath();
    for (let i = 1; i < this.arrayOfPoints.length; i++) {
      const currentPoint = this.arrayOfPoints[i];
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
      prevPoint = currentPoint;
    }
  }

  drawLine(ctx: CanvasRenderingContext2D, points: Point[]) {
    const [firstPoint, ...remainingPoints] = points;
    ctx.beginPath();
    const { x, y } = firstPoint;
    ctx.moveTo(x, y);
    for (const { x, y } of remainingPoints) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  drag(x: number, y: number) {
    this.arrayOfPoints.push({ x, y });
  }
}

class Emoji {
  x: number;
  y: number;
  emoji: string;
  constructor(x: number, y: number, emoji: string) {
    this.x = x;
    this.y = y;
    this.emoji = emoji;
  }
  display(ctx: CanvasRenderingContext2D) {
    ctx.fillText(this.emoji, this.x, this.y);
  }
}

class Mouse {
  x: number;
  y: number;
  radius: number;
  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  drawLine(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(x, y, this.radius, zero, two * Math.PI);
    ctx.stroke();
  }
}

let currentLine: Command;
let arrayOfLines: Command[] = [];
let arrayOfEmojis: Emoji[] = [];
const undoneLines: Command[] = [];
const undoneEmojis: Emoji[] = [];
//let latestAction = 0;
//let latestUndidAction = 0;
const arrayOfActions: number[] = []; // 1 for line, 2 for emoji
const undoneActions: number[] = [];
let m: Mouse;

function notify(name: string) {
  canvas.dispatchEvent(new Event(name));
}
canvas.addEventListener(
  "drawing-changed",
  () => {
    // clear
    ctx.clearRect(x, y, canvas.width, canvas.height);
    ctx.fillRect(canvasX, canvasY, canvas.width, canvas.height);
    // redraw lines
    for (const line of arrayOfLines) {
      line.display(ctx);
    }
    // redraw emojis
    for (const emoji of arrayOfEmojis) {
      emoji.display(ctx);
    }
  },
  false
);
canvas.addEventListener(
  "tool-moved",
  () => {
    // Fires whenever the user moves mouse over canvas.
    m.drawLine(ctx);
  },
  false
);

// clear canvas button
const button = "clear";
const mainButton = document.createElement("button");
mainButton.innerHTML = button;
app.append(mainButton);
mainButton.addEventListener("click", () => {
  arrayOfLines = [];
  arrayOfEmojis = [];
  notify("drawing-changed");
});
let latestAction: number | undefined;
// undo button
const button2 = "undo";
const undoButton = document.createElement("button");
undoButton.innerHTML = button2;
app.append(undoButton);
undoButton.addEventListener("click", () => {
  latestAction = arrayOfActions.pop();
  if (latestAction == one) {
    if (arrayOfLines.length > zero) {
      const undidLine: Command | undefined = arrayOfLines.pop();
      if (undidLine != undefined) {
        undoneLines.push(undidLine);
      }
      undoneActions.push(latestAction);
      notify("drawing-changed");
    }
  } else if (latestAction == two) {
    if (arrayOfEmojis.length > zero) {
      const undidEmoji: Emoji | undefined = arrayOfEmojis.pop();
      if (undidEmoji != undefined) {
        undoneEmojis.push(undidEmoji);
      }
      undoneActions.push(latestAction);
      notify("drawing-changed");
    }
  } else {
    console.log("No action to undo!");
  }
});

// redo button
const button3 = "redo";
const redoButton = document.createElement("button");
redoButton.innerHTML = button3;
app.append(redoButton);
redoButton.addEventListener("click", () => {
  const latestUndidAction = undoneActions.pop();
  if (latestUndidAction == one) {
    if (undoneLines.length > zero) {
      const redidLine: Command | undefined = undoneLines.pop();
      if (redidLine != undefined) {
        arrayOfLines.push(redidLine);
      }
      arrayOfActions.push(one);
      notify("drawing-changed");
    }
  } else if (latestUndidAction == two) {
    if (undoneEmojis.length > zero) {
      const redidEmoji: Emoji | undefined = undoneEmojis.pop();
      if (redidEmoji != undefined) {
        arrayOfEmojis.push(redidEmoji);
      }
      arrayOfActions.push(two);
      notify("drawing-changed");
    }
  } else {
    console.log("Nothing to redo!");
  }
});

// thin canvas button
const button4 = "thin";

const thinButton = document.createElement("button");
thinButton.innerHTML = button4;
app.append(thinButton);
thinButton.addEventListener("click", () => {
  console.log("thiN!");
  thickChecker = toolRadius = one;
  emojiInidcator = zero;
});

// THICK canvas button
const button5 = "thick";
const thickButton = document.createElement("button");
thickButton.innerHTML = button5;
app.append(thickButton);
thickButton.addEventListener("click", () => {
  console.log("THICK!!");
  thickChecker = toolRadius = five;
  emojiInidcator = zero;
});

let emojiInidcator = 0;
const button6 = "😂";
const sticker1 = document.createElement("button");
sticker1.innerHTML = button6;
app.append(sticker1);
sticker1.addEventListener("click", () => {
  emojiInidcator = one;
});

const button7 = "🎃";
const sticker2 = document.createElement("button");
sticker2.innerHTML = button7;
app.append(sticker2);
sticker2.addEventListener("click", () => {
  emojiInidcator = two;
});

const button8 = "💀";
const sticker3 = document.createElement("button");
sticker3.innerHTML = button8;
app.append(sticker3);
sticker3.addEventListener("click", () => {
  emojiInidcator = three;
});

let customStickerText: string;
const button9 = "Custom";
const sticker4 = document.createElement("button");
sticker4.innerHTML = button9;
app.append(sticker4);
sticker4.addEventListener("click", () => {
  //Add custom sticker
  const promptMsg = window.prompt("Enter Custom Sticker:", "")!;
  console.log(promptMsg);
  customStickerText = promptMsg;
  emojiInidcator = four;
});

const buttonX = "Export";
const exportButton = document.createElement("button");
exportButton.innerHTML = buttonX;
app.append(exportButton);
exportButton.addEventListener("click", () => {
  // Create new canvas
  const canvasExport = document.createElement("canvas");
  canvasExport.width = 1024;
  canvasExport.height = 1024;
  const canvasExportX = 0;
  const canvasExportY = 0;

  const ctx = canvasExport.getContext("2d")!;
  ctx.fillStyle = "yellow";
  ctx.fillRect(
    canvasExportX,
    canvasExportY,
    canvasExport.width,
    canvasExport.height
  );
  app.append(canvasExport);

  // Prep CanvasRenderingContext2D object for canvas using scale(x, y)
  // (Should be 4x larger)
  ctx.scale(four, four);

  ctx.fillStyle = "white";
  ctx.fillRect(
    canvasExportX,
    canvasExportY,
    canvasExport.width,
    canvasExport.height
  );

  // Execute all items on display list
  // redraw lines
  for (const line of arrayOfLines) {
    line.display(ctx);
  }
  // redraw emojis
  for (const emoji of arrayOfEmojis) {
    emoji.display(ctx);
  }

  // Trigger file download w/ contests of canvas as PNG file
  const file = canvasExport.toDataURL("image/png");
  const dataFile = document.createElement("a");
  dataFile.href = file;
  (dataFile.download = "drawing.png"), dataFile.click();
  app.removeChild(canvasExport);
});

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  if (m) {
    m.x = e.offsetX;
    m.y = e.offsetY;
    m.radius = toolRadius;
  } else if (emojiInidcator == zero) {
    m = new Mouse(e.offsetX, e.offsetY, toolRadius);
  }
  isDrawing = true;
  currentLine = new Command();
  if (emojiInidcator == one) {
    const newEmoji = new Emoji(x, y, "😂");
    arrayOfEmojis.push(newEmoji);
    arrayOfActions.push(two);
    newEmoji.display(ctx);
  } else if (emojiInidcator == two) {
    const newEmoji = new Emoji(x, y, "🎃");
    arrayOfEmojis.push(newEmoji);
    arrayOfActions.push(two);
    newEmoji.display(ctx);
  } else if (emojiInidcator == three) {
    const newEmoji = new Emoji(x, y, "💀");
    arrayOfEmojis.push(newEmoji);
    arrayOfActions.push(two);
    newEmoji.display(ctx);
  } else if (emojiInidcator == four) {
    const newEmoji = new Emoji(x, y, customStickerText);
    arrayOfEmojis.push(newEmoji);
    arrayOfActions.push(two);
    newEmoji.display(ctx);
  } else if (thickChecker > one) {
    currentLine.drag(x - one, y - one);
    currentLine.drag(x - one, y);
    currentLine.drag(x - one, y + one);
    currentLine.drag(x, y - one);
    currentLine.drag(x, y + one);
    currentLine.drag(x + one, y - one);
    currentLine.drag(x + one, y);
    currentLine.drag(x + one, y + one);
    arrayOfActions.push(one);
    notify("drawing-changed");
  } else {
    currentLine.drag(x, y);
    arrayOfActions.push(one);
    notify("drawing-changed");
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (m) {
    m.x = e.offsetX;
    m.y = e.offsetY;
    m.radius = toolRadius;
  } else {
    m = new Mouse(e.offsetX, e.offsetY, toolRadius);
  }
  if (isDrawing && emojiInidcator == zero) {
    x = e.offsetX;
    y = e.offsetY;
    if (thickChecker > one) {
      currentLine.drag(x - one, y - one);
      currentLine.drag(x - one, y);
      currentLine.drag(x - one, y + one);
      currentLine.drag(x, y - one);
      currentLine.drag(x, y + one);
      currentLine.drag(x + one, y - one);
      currentLine.drag(x + one, y);
      currentLine.drag(x + one, y + one);
    }
    currentLine.drag(x, y);
    notify("drawing-changed");
  }
  notify("tool-moved");
});

canvas.addEventListener("mouseup", (e) => {
  if (m) {
    m.x = e.offsetX;
    m.y = e.offsetY;
    m.radius = toolRadius;
  } else if (emojiInidcator == zero) {
    m = new Mouse(e.offsetX, e.offsetY, toolRadius);
  }
  if (isDrawing) {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = false;
    arrayOfLines.push(currentLine);
    notify("drawing-changed");
  }
});

//onmousemove = (event) => { };
