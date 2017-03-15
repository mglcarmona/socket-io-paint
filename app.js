const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'pug');
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('mousemove', mouse => {
    socket.broadcast.emit('mousemove', mouse);
  })
});


http.listen(3000, err => {
  if (err) return console.log('Error: ', err.message);
  console.log('app running at port 3000');
})
