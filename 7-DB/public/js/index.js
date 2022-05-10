const socket = io.connect();

socket.on('messages', (data) => {
    console.log('Conexion establecida con el chat');
    renderData(data);
})

function renderData(array) {
    for (const data of array) {
        const div = document.createElement('div');
        div.classList.add('user');
        div.innerHTML =`<span class="name">${data.name}</span>: <span class="message">${data.message}</span>`;
        document.getElementById('usermessages').append(div);
    }
}

function addMessage(e) {
    const message = {
        name: document.getElementById('username').value,
        message: document.getElementById('message').value
    }

    socket.emit('new-message', message);

    return false;
}