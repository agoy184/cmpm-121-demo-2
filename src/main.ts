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

const ctx = canvas.getContext("2d");
ctx!.fillStyle = "yellow";
ctx?.fillRect(canvasX, canvasY, canvas.width, canvas.height);
app.append(canvas);

// Drawing creation
let isDrawing = false;
let x = 0;
let y = 0;
const drawArray1: number[][] = [];
const drawArray2: number[][] = [];

const event = new CustomEvent("drawing-changed");
/*canvas.addEventListener(
    "drawing-changed",
    (e) => {
        // clear and redraw lines

    },
    false,
  );*/
  
// Dispatch the event.
canvas.dispatchEvent(event);


/*function showLinePoints(x: number[], y: number[], z: number) {
    console.log(x[z]);
    console.log(y[z]);
}*/

  canvas.addEventListener("mousedown", (e) => {
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
      // Store point #1 (x, y)
      console.log(x + "," + y);
      drawArray1.push([x, y]);
      console.log(drawArray1.pop());
 });

 canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      drawLine(ctx, x, y, e.offsetX, e.offsetY);
      x = e.offsetX;
      y = e.offsetY;
      // canvas.dispatchEvent(drawingChanged);
    }
  });
  
  canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = false;
        // Store point #2 (x, y)
        console.log(x + "," + y);
        drawArray2.push([x, y]);
        console.log(drawArray2.pop());
    }
  });
/*    
  canvas.addEventListener("drawing-changed", (e) => {
      // observer will clear
      ctx?.clearRect(x, y, canvas.width, canvas.height);
      // and redraw the user's lines
      for (let i = 0; i < drawArray1.length; i++) {
          console.log(drawArray1[i]);
          console.log(drawArray2[i]);
        //drawLine(ctx, drawArray1[i], drawArray2[i])
      }
  });*/

  // ESlint doesn't like my use of any, but i disabled the warnings
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

// clear canvas
const button = "clear";
const mainButton = document.createElement("button");
mainButton.innerHTML = button;
app.append(mainButton);
mainButton.addEventListener("click", () => {
    ctx?.clearRect(x, y, canvas.width, canvas.height);
    ctx?.fillRect(canvasX, canvasY, canvas.width, canvas.height);
});


// FUTURE STEPS:
// Store the 2 points
// send an event
// clear everything
// draw everything
// canvas addeventlistener redraw
// be cool
