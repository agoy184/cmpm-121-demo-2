/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./style.css";
const app: HTMLDivElement = document.querySelector("#app")!;

// Title
const gameName = "Drawing Game!";
document.title = gameName;
const header = document.createElement("h1");
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
interface Point {
  x: number;
  y: number;
}
let currentLine: Point[] = [];
//let undidLine: Point[] = [];
let arrayOfLines: Point[][] = [];
const undoneLines: Point[][] = [];
function notify(name: "drawing-changed") {
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
      drawLine(ctx, line);
    }
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
    const undidLine: Point[] | undefined = arrayOfLines.pop();
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
    const redidLine: Point[] | undefined = undoneLines.pop();
    if (redidLine != undefined) {
      arrayOfLines.push(redidLine);
    }
    notify("drawing-changed");
  }
});

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
  currentLine = [];
  currentLine.push({ x, y });
  notify("drawing-changed");
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    x = e.offsetX;
    y = e.offsetY;
    currentLine.push({ x, y });
    notify("drawing-changed");
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = false;
    arrayOfLines.push(currentLine);
    notify("drawing-changed");
  }
});

// ESlint doesn't like my use of any, but i disabled the warnings
function drawLine(ctx: CanvasRenderingContext2D, points: Point[]) {
  const [firstPoint, ...remainingPoints] = points;
  ctx.beginPath();
  const { x, y } = firstPoint;
  ctx.moveTo(x, y);
  for (const { x, y } of remainingPoints) {
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

//onmousemove = (event) => { };

// FUTURE STEPS:
// Store the 2 points
// send an event
// clear everything
// draw everything
// canvas addeventlistener redraw
// be cool
// (0,0) -> (0, 1) -> (0,2)
