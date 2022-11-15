const express = require('express'); 
const app = express();
const path = require('path'); 
const http = require('http');
const server = http.createServer(app);
const fs = require('fs');

//웹소켓
const socketIO = require('socket.io');
const { off } = require('process');
console.log(socketIO);
const io = socketIO(server);
console.log(io)
const directoryPath = path.join(__dirname, '/testdata')

// function readdetailfile(filename) {
//     let res;
//     fs.readFileSync(directoryPath + '/' + filename, 'utf-8', (err, data) =>{
//         if (err) throw err
//         res= data[0]
//     })
//     return res;
// }

io.on('connection', (socket) => {
        
        
        setInterval(function () {
            
            fs.readdir(directoryPath, function(err, files){
                if(err){
                    return console.log('Unable to scan directory' + err)
                }
                const list = files.map(filename => {
                    let parsedfilename = filename.split('_')
                    parsedfilename = parsedfilename[parsedfilename.length-1]
                    parsedfilename = parsedfilename.split('.txt')[0]
                    return {
                        filename: parsedfilename,
                        mtime: fs.statSync(directoryPath + '/' + filename).mtime,
                        data: fs.readFileSync(directoryPath + '/' + filename,{encoding:'utf8',flag:'r'})[0]
                    }
                })
                list.sort((a,b) => b.mtime - a.mtime)
                // console.log(list);
                if(list.length >= 5){
                    let cnt_1 = 0;
                    let cnt_2 = 0;
                    let constly = 0;
                    for(let i =0; i <5 ; i++){

                        if(list[i].data == 1) cnt_1 += 1;
                        if(list[i].data == 2) cnt_2 += 1;
                        // console.log(list[i].filename)
                        // console.log(+list[i+1].filename+1)
                        if(i == 4) continue;
                        if(list[i].filename == +list[i+1].filename+1){ 
                            constly += 1;
                        } else {
                            constly = 0;
                        }
                    }
                    if(constly == 4 && cnt_1 == 5){
                        io.emit('chatting', `아이에게 쓰러짐 행동이 감지되었습니다.`);
                        console.log('돔황챠');
                    } else if(constly == 4 && cnt_2 == 5){
                        io.emit('chatting', `아이에게 추락 행동이 감지되었습니다.`);
                        console.log('돔황챠');
                    } else {
                        console.log('안전함')
                        console.log(constly)
                        console.log(cnt_1)
                        console.log(cnt_2)
                    }

                }                                
            })
        }, 3000);

        
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



