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
interface Point {
  x: number;
  y: number;
}
let currentLine: Point[] = [];
let arrayOfLines: Point[][] = [];
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

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
  // initialize array of coordinates
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

// clear canvas
const button = "clear";
const mainButton = document.createElement("button");
mainButton.innerHTML = button;
app.append(mainButton);
mainButton.addEventListener("click", () => {
  arrayOfLines = [];
  notify("drawing-changed");
});

// FUTURE STEPS:
// Store the 2 points
// send an event
// clear everything
// draw everything
// canvas addeventlistener redraw
// be cool
// (0,0) -> (0, 1) -> (0,2)
