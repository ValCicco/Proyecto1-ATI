const urlParams = new URLSearchParams(window.location.search);
const cedula = urlParams.get('ci');  
const idioma = urlParams.get('lang') || 'es'; 

if (cedula) {
    const perfilUrl = `${cedula}/perfil.json`;

    fetch(perfilUrl)
        .then(response => response.json())
        .then(data => {
            const email = data.email;  

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

            fetch(`conf/config${idioma.toUpperCase()}.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la carga del archivo JSON');
                    }
                    return response.json();
                })
                .then(config => {
                    const elementosTraducibles = document.querySelectorAll('[data-i18n]');
                    elementosTraducibles.forEach(element => {
                        const i18nKey = element.getAttribute('data-i18n');
                        if (config[i18nKey]) {
                            if (i18nKey === 'email') {
                                const emailTextParts = config[i18nKey].split('[email]');
                                const emailLink = element.querySelector('#contacto-email');
                                
                                if (emailLink && emailTextParts.length === 2) {
                                    element.childNodes[0].textContent = emailTextParts[0]; 
                                    emailLink.href = `mailto:${email}`;
                                    emailLink.textContent = email;
                                    if (element.childNodes.length > 2) {
                                        element.childNodes[2].textContent = emailTextParts[1]; 
                                    } else {
                                        element.appendChild(document.createTextNode(emailTextParts[1]));
                                    }
                                }
                            }
                            else {
                                element.textContent = config[i18nKey];
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error cargando el archivo de idioma:', error);
                    alert("No se pudo cargar el archivo de idioma.");
                });

        })
        .catch(error => {
            console.error('Error cargando el perfil:', error);
            alert("No se pudo cargar el perfil. Verifique la cédula o el archivo.");
        });
} else {
    alert("No se proporcionó una cédula en la URL.");
}