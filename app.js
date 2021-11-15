const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// static 폴더 위치 지정
app.use(express.static(__dirname + '/public'))

// 주소(http://localhost:3000)에 /를 붙여서 get방식으로 요청했을 때 실행할 내용 정의
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// socket.io를 사용해서 소켓에 들어오는 connection 이벤트 대기
io.on('connection', function(socket) {  // connection이 이루어지면 상대방과 연결된 socket을 반환해서 인자로 넘겨 줌
  console.log('A new connection was made.');

  // connection이 이루어진 socket에서 들어올 data이벤트 대기 및 data이벤트 발생시 실행할 내용
  socket.on('image', function(data){
    //console.log('data received');
    //console.log(data);
    io.emit('image', data.toString());  //image 이벤트를 발생
  });

  // coordinate 이벤트 대기 및 실행 내용
  socket.on('coordinates', function(coords) {
    console.log("Sending coordinates to the cpp client.");
    io.emit('coordinates', coords);    // coordinates 이벤트를 발생
	//io.emit('coordinates', "12 34 56 78");
	//io.emit('coordinates', "hello");
  });
  
  // coordinate 이벤트 대기 및 실행 내용
  socket.on('baby_out', function(out) {
    console.log("Baby out event occurred.");
    io.emit('baby_out', out);           // baby_out 이벤트를 발생
  });
  
  // reset 이벤트 대기 및 실행 내용
  socket.on('resetFromHtml', function(reset) {
    console.log("Boundary reset request was made.");
    io.emit('resetFromHtml', reset);
  });
});

server.listen(3000);
