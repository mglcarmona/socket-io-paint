const socket = io();

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = document.documentElement.clientWidth;
ctx.canvas.height = document.documentElement.clientHeight;

document.getElementById('tomato').addEventListener('click', () => {
  ctx.strokeStyle = '#FF6347';
})
document.getElementById('green').addEventListener('click', () => {
  ctx.strokeStyle = '#00CC99';
})
document.getElementById('blue').addEventListener('click', () => {
  ctx.strokeStyle = '#0069ff';
})
document.getElementById('grey').addEventListener('click', () => {
  ctx.strokeStyle = '#696969';
})
document.getElementById('black').addEventListener('click', () => {
  ctx.strokeStyle = '#000000';
})
document.getElementById('orange').addEventListener('click', () => {
  ctx.strokeStyle = '#FFA712';
})

document.getElementById('selector').addEventListener('change', e => {
  ctx.lineWidth = e.target.selectedIndex * 5
})

const mouse = {x: 0, y: 0, prevX: 0, prevY: 0};

const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', e => {
  const pos = getMousePos(canvas, e)
  mouse.prevX = pos.x;
  mouse.prevY = pos.y
  mouse.x = pos.x;
  mouse.y = pos.y;
});

ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#00CC99';

canvas.addEventListener('mousedown', e => {
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);
  canvas.addEventListener('mousemove', onPaint);
});

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', onPaint);
});

socket.on('mousemove', mouse => {
  ctx.beginPath();
  ctx.moveTo(mouse.prevX, mouse.prevY);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
})

const onPaint = () => {
  socket.emit('mousemove', mouse);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
};
