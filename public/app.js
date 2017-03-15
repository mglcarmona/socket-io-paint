const mouse = {
  click: false,
  move: false,
  pos: {x:0, y:0},
  pos_prev: false
};

const canvas  = document.getElementById('canvas');
const context = canvas.getContext('2d');
const width   = window.innerWidth;
const height  = window.innerHeight;
const socket  = io.connect();

canvas.width = width;
canvas.height = height;

canvas.onmousedown = e => mouse.click = true;
canvas.onmouseup = e => mouse.click = false;

canvas.onmousemove = e => {
  mouse.pos.x = e.clientX / width;
  mouse.pos.y = e.clientY / height;
  mouse.move = true;
};

socket.on('draw_line', data => {
  const line = data.line;
  context.beginPath();
  context.moveTo(line[0].x * width, line[0].y * height);
  context.lineTo(line[1].x * width, line[1].y * height);
  context.stroke();
});

const mainLoop = () => {
  if (mouse.click && mouse.move && mouse.pos_prev) {
    socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
    mouse.move = false;
  }
  mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
  setTimeout(mainLoop, 1);
}
mainLoop();
