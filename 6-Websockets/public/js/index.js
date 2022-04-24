const socket = io.connect();

// Llamar al contenedor html de la lista de productos.
const listaProductos = document.getElementById('productos');

socket.on('productos', (data) => {
    console.log('Conexión establecida con los productos');

    renderProductos(data);
});

const renderProductos = (productos) => {
    // Por cada producto, crear un elemento lista html.
    const html = productos.map(producto => {
        return `
            <tr>
                <th scope="row">${producto.id}</th>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
            </tr>
        `;
    }).join('');

    listaProductos.innerHTML = html;
}



socket.on('messages', (data) => {
    console.log('Conexión establecida con el chat');
    
    render(data);
});

function render (data) {
    // Por cada mensaje, crear un elemento mensaje html.
    const html = data.map(elem=> {
        return (
            `<div>
                <strong class="author">${elem.author}: </strong>
                <span>${elem.text}</span>
            </div>`
        )
    }).join(' ');

    document.getElementById('messages').innerHTML = html;
}

function addMessage (e) {
    const mensaje = {
        // Obtener el valor del input
        author: document.getElementById('username').value,
        text: document.getElementById('text').value
    };

    // Enviar el mensaje al servidor
    socket.emit('new-message', mensaje);

    return false;
}