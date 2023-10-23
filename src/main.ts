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

const ctx = canvas.getContext("2d");
ctx!.fillStyle = "yellow";
ctx?.fillRect(canvasX, canvasY, canvas.width, canvas.height);
app.append(canvas);

// Drawing creation
let isDrawing = false;
let x = 0;
let y = 0;
//const drawArray = [];

canvas.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
    // Store point #1 (x, y)
 });

 canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      drawLine(ctx, x, y, e.offsetX, e.offsetY);
      x = e.offsetX;
      y = e.offsetY;
    }
  });
  
  canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      drawLine(ctx, x, y, e.offsetX, e.offsetY);
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = false;
      
    // Store point #2 (x, y)
    }
  });
  
  function drawLine(context: any, x1: number, y1: number, x2: number, y2: number) {
    context.beginPath();
    //context.strokeStyle = "black";
    //context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    //context.closePath();
  }

//onmousemove = (event) => { };

// FUTURE STEPS:
// Store the 2 points
// send an event
// clear everything
// draw everything
// canvas addeventlistener redraw
// be cool

// clear canvas
const button = "clear";
const mainButton = document.createElement("button");
mainButton.innerHTML = button;
app.append(mainButton);
mainButton.addEventListener("click", () => {
    //
    ctx?.clearRect(x, y, canvas.width, canvas.height);
    ctx?.fillRect(canvasX, canvasY, canvas.width, canvas.height);
});