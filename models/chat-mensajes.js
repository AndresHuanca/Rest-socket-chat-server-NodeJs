
class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    // Get
    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }
    
    get usuariosArr() {
        return Object.values( this.usuarios ); //[{}, {}]
    }
    
    //Methods
    enviarMensaje( uid, nombre, mensaje ) {
        // Agrega al inicio del array
        this.mensajes.unshift( 
            new Mensaje(uid, nombre, mensaje) 
        );
    }

    conectarUsuario( usuario ) {
        this.usuarios[usuario.id] = usuario;
    }

    desconectarUsuario( id ) {
        delete this.usuarios[id];
    }
}

class Mensaje {
    constructor( uid, nombre, mensaje ) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}

module.exports = ChatMensajes;


