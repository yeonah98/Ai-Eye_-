const socket = io(); 
console.log(socket);

// socket.emit('chatting', 'from front'); 
let $info_is_here = document.getElementById("info_is_here");
socket.on('chatting', (data) => {
    let input = 
    `<div class="whiteBox">
        <div>
            <h3>${data}</h3>
        </div>
        <img class="icon_camera" alt="camera" src="./icons/video-camera.png"></img>
    </div>`
    $info_is_here.innerHTML = input + $info_is_here.innerHTML
})
