const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

// Instancia cuando se levanta el server
const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {
    // Pruebas
    // console.log('Cliente conectado', socket.id );
    // console.log( socket.handshake.headers['x-token'] );

    // Comprobar JWT in helpers
    const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT( token );
    // Yes user no exist 
    if( !usuario ) {
        return socket.disconnect();
    }
    
    // //Display tests
    // console.log( 'se conecto: ' + usuario.nombre ); 

    // Add user connect
    chatMensajes.conectarUsuario( usuario );
    // for emit to all 
    io.emit( 'usuarios-activos', chatMensajes.usuariosArr);
    // save message for user latest connect the chat
    socket.emit( 'recibir-mensajes', chatMensajes.ultimos10 );

    // connect to a special room
    socket.join( usuario.id );

    // Clean when they to disconnect
    socket.on( 'disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit( 'usuarios-activos', chatMensajes.usuariosArr);

    });

    // Send message
    socket.on( 'enviar-mensaje', ({ uid, mensaje}) => {

        if( uid ){
            // Message private
            socket.to( uid ).emit('mensaje-privado', {de: usuario.nombre, mensaje });
            
        }else {

            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );

            io.emit( 'recibir-mensajes', chatMensajes.ultimos10 );
        }

    
    });
    


};

module.exports = {
    socketController
};