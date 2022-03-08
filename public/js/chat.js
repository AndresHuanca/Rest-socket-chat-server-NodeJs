// Podría hacerlo global
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');


// Validar el Token del localStorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    // Validación si viene token
    if( token <= 9 ) {
        // Enviar al index.html
        window.location = 'index.html';
        throw new Error('Token no valido');
    }
    // Url of production or  developer
    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDb, token: tokenDb  } = await resp.json();
        // Generar new JWT in localStorage
        localStorage.setItem( 'token', tokenDb);
        // Save information of user
        usuario = userDb;
        // Title in page
        document.title = usuario.nombre;

    // Luego de las atenriores validaciones se conecta
    await conectarSocket();

};

const conectarSocket = async() => {

    // Extraer token y enviar al controller in backend
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on( 'connect', () => {
        console.log('Sockets Online');
    });

    socket.on( 'disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on( 'recibir-mensajes', dibujarMensajes);
    
    socket.on( 'usuarios-activos', dibujarUsuarios );

    socket.on( 'mensaje-privado', ( payload ) => {
        console.log( payload );
    });

};

// Method of display users connects
const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success"> ${ nombre } </h5>
                <span class="fs-6 text-muted">${ uid }</span>
            </p>
        </li>
        `;
    });
    // Return
    ulUsuarios.innerHTML = usersHtml;
} ;

// Method of display message to all connects
const dibujarMensajes = ( mensajes = [] ) => {

    let messageHtml = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
        messageHtml += `
        <li>
            <p>
            <span class="text-primary">${ nombre }: </span>
            <span>${ mensaje }</span>
            </p>
        </li>
        `;
    });
    // Return
    ulMensajes.innerHTML = messageHtml;
} ;

// Add listener to txtmensaje
txtMensaje.addEventListener( 'keyup', ( { keyCode } ) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) { return; }
    if( mensaje.length === 0 ) { return; }

    // send object
    socket.emit( 'enviar-mensaje', { mensaje, uid } );
    // Clean diaplay form frontend
    txtMensaje.value = '';

});

const main =  async() => {
    
    // Validar JWT
    await validarJWT();
    
};

main();

// const socket = io();




