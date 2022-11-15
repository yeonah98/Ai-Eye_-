const express = require('express'); 
const app = express();
const path = require('path'); 
const http = require('http');
const server = http.createServer(app);

//웹소켓
const socketIO = require('socket.io');
console.log(socketIO);
const io = socketIO(server);
console.log(io)

io.on('connection', (socket) => {
    socket.on('chatting', (data) => {
        io.emit('chatting', `안녕 ${data}`);
      }); // 채팅아이디, 실행할 함수
});

//html 디렉토리 경로 고정
app.use(express.static(__dirname + '/views'));

//포트번호
const PORT = process.env.PORT || 5000;

app.engine('html', require('ejs').renderFile);  
app.set('view engine', 'html');

app.get("/main", (req, res) => {
    res.render("main.html");
})
app.get("/history", (req, res) => {
    res.render("history.html");
})
app.get("/setting", (req, res) => {
    res.render("setting.html");
})

server.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
  });



