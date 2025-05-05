const urlParams = new URLSearchParams(window.location.search);
const cedula = urlParams.get('ci');  

if (cedula) {
    const perfilUrl = `${cedula}/perfil.json`;

    fetch(perfilUrl)
        .then(response => response.json())
        .then(data => {
            // Guardamos el correo real del perfil
            const email = data.email;  

            // Actualizamos el perfil con los datos del archivo JSON
            document.title = data.nombre;
            document.getElementById('perfil-imagen').src = `${cedula}/${data.imagen}`;
            document.getElementById('nombre').textContent = data.nombre;
            document.getElementById('descripcion').textContent = data.descripcion;
            document.getElementById('color').textContent = data.color;
            document.getElementById('libro').textContent = data.libro;
            document.getElementById('musica').textContent = data.musica;
            document.getElementById('video-juego').textContent = data.video_juego;
            document.getElementById('lenguajes').textContent = data.lenguajes.join(', ');
            document.getElementById('lenguajes').innerHTML = data.lenguajes.map(l => `<strong>${l}</strong>`).join(', ');
            document.getElementById('contacto-email').href = `mailto:${email}`;
            document.getElementById('contacto-email').textContent = email;

        })
        .catch(error => {
            console.error('Error cargando el perfil:', error);
            alert("No se pudo cargar el perfil. Verifique la cédula o el archivo.");
        });
} else {
    alert("No se proporcionó una cédula en la URL.");
}