const socket = io('http://localhost:8000')//io('http://192.168.0.122:8000')//io('http://localhost:8000');

//get DOM element in respctive js Variable
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//Audio  that will play on receiving message..
// var audio = new Audio('MessageTone.mp3')

// function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // if (position == 'left') { audio.play(); };
}


//Ask new user for her/his name and let the server know
const name = prompt("Enter your Name..");
socket.emit('new-user-joined', name);

//if the new user joins, receive his/her name from the server
socket.on('user-joined', name => {
    console.log(name, "name 11");
    if (name !== null) {
        append(`${name} joined the chat`, 'right')
    }
    else {
        append(`No one online now`, 'right')
    }
});

//if server send a message, receive it.
socket.on('receive', data => {
    console.log(data, "datadata")
    append(`${data.name}: ${data.message}`, 'left')
});

//if the user leaves the chat, append the info to the container
socket.on('left', name => {
    console.log(name, "name 22");

    if (name !== null) {
        append(`${name} left the chat`, 'right  ')
    }
    else {
        append(`No one online now`, 'right')
    }
});

//if the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message)
    messageInput.value = ''
})

