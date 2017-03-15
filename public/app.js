const mouse = {
  click: false,
  move: false,
  pos: {x:0, y:0},
  pos_prev: false
};

const canvas  = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width   = window.innerWidth;
const height  = window.innerHeight;
const socket  = io.connect();
let currentWidth = 5;
let currentColor = '#00FA9A'

const colorClickHandler = e => {
  currentColor = e.target.dataset.color;
  e.stopPropagation();
}
const buttonContainer = document.querySelector("#buttonContainer");
buttonContainer.addEventListener("click", colorClickHandler);

document.getElementById('clear').addEventListener('click', e => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
})

document.getElementById('selector').addEventListener('change', e => {
  currentWidth = e.target.selectedIndex * 5
  ctx.lineWidth = currentWidth
})

canvas.width = width;
canvas.height = height;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

canvas.onmousedown = e => mouse.click = true;
canvas.onmouseup = e => mouse.click = false;

canvas.onmousemove = e => {
  mouse.pos.x = e.clientX / width;
  mouse.pos.y = e.clientY / height;
  mouse.move = true;
};

socket.on('draw_line', data => {
  const line = data.line;
  ctx.beginPath();
  ctx.strokeStyle = line[3];
  ctx.lineWidth = line[2];
  ctx.moveTo(line[0].x * width, line[0].y * height);
  ctx.lineTo(line[1].x * width, line[1].y * height);
  ctx.stroke();
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentWidth;
});

const mainLoop = () => {
  if (mouse.click && mouse.move && mouse.pos_prev) {
    socket.emit('draw_line', { line: [mouse.pos, mouse.pos_prev, currentWidth, currentColor] });
    mouse.move = false;
  }
  mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
  setTimeout(mainLoop, 40);
}
mainLoop();
