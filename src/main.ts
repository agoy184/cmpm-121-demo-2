import "./style.css";
const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Drawing Game!";
document.title = gameName;
const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);


const canvas = document.createElement("canvas");
canvas.width = 150;
canvas.height = 150;
const canvasX = 0;
const canvasY = 0;

const ctx = canvas.getContext("2d");
ctx!.fillStyle = "yellow";
ctx?.fillRect(canvasX, canvasY, canvas.width, canvas.height);
//document.body.appendChild(canvas);
app.append(canvas);


