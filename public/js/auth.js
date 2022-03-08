    // variables of form
    const  miFormulario = document.querySelector('form');

    const url = ( window.location.hostname.includes('localhost') )
                ? 'http://localhost:8080/api/auth/'
                : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

    miFormulario.addEventListener( 'submit', event => {
        // evita el refersh del navegador
        event.preventDefault();
        const formData = {};
        // leer formulario
        for( let el of miFormulario.elements ) {
            if( el.name.length > 0) {
                formData[el.name] = el.value;
            }
        }
        
        fetch( url + 'login', { 
            method: 'POST',
            body: JSON.stringify( formData ),
            headers: { 'Content-type': 'application/json' }
        
        })
        .then( resp => resp.json())
        .then( ({ msg, token }) => {
            if( msg ) {
                return console.error( msg )
            }
            localStorage.setItem( 'token', token );
            // A vez autenticado - redireccionar
            window.location = 'chat.html';

        })
        .catch( err => {
            console.log( err )
        });


    });


    function onSignIn(googleUser) {

        // var profile = googleUser.getBasicProfile();
        // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

        var id_token = googleUser.getAuthResponse().id_token;
        const data = { id_token };

        fetch( url + 'google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( data )
        })
        .then( resp => resp.json() )
        .then( ({ token }) => {
            // Grabar en el localstorage
            localStorage.setItem('token', token);
             // A vez autenticado - redireccionar
            window.location = 'chat.html';
        })
        .catch( console.log );
        
    }

    function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        console.log('User signed out.');
        });
    }
