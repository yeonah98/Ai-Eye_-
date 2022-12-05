const express = require('express'); 
const app = express();
const path = require('path'); 
const http = require('http');
const server = http.createServer(app);
const fs = require('fs');
require('dotenv').config();

//카카오 인증

const request = require('request');
const accessToken = process.env.accessToken;

let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Bearer " + accessToken,
};

let faint_dataString = `template_object={
        "object_type": "text",
        "text": "쓰러짐 위험상황이 발생했습니다!",
        "link": {
            "web_url": "http://naver.com",
            "mobile_web_url": "http://m.naver.com"
        },
        "button": {
            "link" : {
                "web_url": "http://naver.com",
                "mobile_web_url": "http://naver.com"
            }
        }
    }`;

let climb_dataString = `template_object={
    "object_type": "text",
    "text": "추락 위험상황이 발생했습니다!",
    "link": {
        "web_url": "http://naver.com",
        "mobile_web_url": "http://m.naver.com"
    },
    "button": {
        "link" : {
            "web_url": "http://naver.com",
            "mobile_web_url": "http://naver.com"
        }
    }
}`;   

let faint_options = {
    url: "https://kapi.kakao.com/v2/api/talk/memo/default/send",
    method: "POST",
    headers: headers,
    body: faint_dataString,
};

let climb_options = {
    url: "https://kapi.kakao.com/v2/api/talk/memo/default/send",
    method: "POST",
    headers: headers,
    body: climb_dataString,
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("메시지 전송 완료.");
    } else {
        console.log(" 에러 ");
        console.log(error);
    }
}

//오디오 사용
const player = require('play-sound')(opts = {})

//웹소켓
const socketIO = require('socket.io');
const { off } = require('process');
console.log(socketIO);
const io = socketIO(server);
console.log(io)
const directoryPath = path.join(__dirname, '/yoloData')

io.on('connection', (socket) => {
        let fileNum = 0;
        let NewFileNum = 0;
        setInterval(function () {
            //현재 파일의 개수
            fs.readdir(directoryPath, (err, files) => {
                NewFileNum = files.length;

            })

            //기존 개수 != 현재 개수 이벤트 발생 후, 기존개수 현재개수로 업데이트
            if(NewFileNum != fileNum) {
                fileNum = NewFileNum;
                // NewFileNum = 3;

                //어떤 위험상황 파일인지 확인 후 알림 보내기
                fs.readdir(directoryPath, function(err, files){
                    if(err){
                        return console.log('Unable to scan directory' + err)
                    }
                    //위험상황 이름으로 표시
                    const list = files.map(filename => {
                        let parsedfilename = filename.split('_')
                        parsedfilename = parsedfilename[0]
                        return {
                            filename: parsedfilename,
                            mtime: fs.statSync(directoryPath + '/' + filename).mtime,
                        }
                    })
                    //시간 순으로 정렬
                    list.sort((a,b) => b.mtime - a.mtime)
                    console.log(list)
                    // console.log(list);
                    
                    // 위험상황 확인 후 알림
                    if(list[0].filename == 'faint'){
                        io.emit('chatting', `아이에게 쓰러짐 행동이 감지되었습니다.`);
                        //알림음 재생
                        player.play('emergency.mp3', function(err){
                            if(err) throw err
                        });
                        //카톡 나에게 전송
                        request(faint_options, callback);
                        console.log('faint 발생');
                    } else if(list[0].filename == 'climbing'){
                        io.emit('chatting', `아이에게 추락 행동이 감지되었습니다.`);
                        //알림음 재생
                        player.play('emergency.mp3', function(err){
                            if(err) throw err
                        });
                        //카톡 나에게 전송
                        request(climb_options, callback);
                        console.log('climb 발생');
                    } else {
                        console.log('안전함')
                    }                               
                })

            }
        
        }, 1000);

        
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
