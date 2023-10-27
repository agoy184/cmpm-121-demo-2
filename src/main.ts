/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./style.css";
const app: HTMLDivElement = document.querySelector("#app")!;

// Title
const gameName = "Drawing Game!";
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
//let undidLine: Point[] = [];
let arrayOfLines: Command[] = [];
const undoneLines: Command[] = [];
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
  },
  false
);
canvas.addEventListener(
  "tool-moved",
  () => {
    // Fires whenever the user moves mouse over canvas.
    console.log(`${toolRadius}`);
    m.drawLine(ctx);
  },
  false
);

// Mkae a class, store info of x/y pairs
// have point interface inside the class
// make a function inside this class called display (one parameter ctx)

// clear canvas button
const button = "clear";
const mainButton = document.createElement("button");
mainButton.innerHTML = button;
app.append(mainButton);
mainButton.addEventListener("click", () => {
  arrayOfLines = [];
  notify("drawing-changed");
});

// undo button
const button2 = "undo";
const undoButton = document.createElement("button");
undoButton.innerHTML = button2;
app.append(undoButton);
undoButton.addEventListener("click", () => {
  if (arrayOfLines.length > zero) {
    const undidLine: Command | undefined = arrayOfLines.pop();
    if (undidLine != undefined) {
      undoneLines.push(undidLine);
    }
    notify("drawing-changed");
  }
});

// redo button
const button3 = "redo";
const redoButton = document.createElement("button");
redoButton.innerHTML = button3;
app.append(redoButton);
redoButton.addEventListener("click", () => {
  if (undoneLines.length > zero) {
    const redidLine: Command | undefined = undoneLines.pop();
    if (redidLine != undefined) {
      arrayOfLines.push(redidLine);
    }
    notify("drawing-changed");
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
});

// THICK canvas button
const button5 = "thick";
const thickButton = document.createElement("button");
thickButton.innerHTML = button5;
app.append(thickButton);
thickButton.addEventListener("click", () => {
  console.log("THICK!!");
  thickChecker = toolRadius = five;
});

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  if (m) {
    m.x = e.offsetX;
    m.y = e.offsetY;
    m.radius = toolRadius;
  } else {
    m = new Mouse(e.offsetX, e.offsetY, toolRadius);
  }
  isDrawing = true;
  currentLine = new Command();
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
});

canvas.addEventListener("mousemove", (e) => {
  if (m) {
    m.x = e.offsetX;
    m.y = e.offsetY;
    m.radius = toolRadius;
  } else {
    m = new Mouse(e.offsetX, e.offsetY, toolRadius);
  }
  if (isDrawing) {
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
  } else {
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
