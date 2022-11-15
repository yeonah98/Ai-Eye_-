const socket = io(); 
console.log(socket);
socket.emit('chatting', 'from front'); 
socket.on('chatting', (data) => {
    console.log(data);
})