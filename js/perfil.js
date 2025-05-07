window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get("ci");

    if (!ci) {
        document.body.innerHTML = "<h2>CI no especificada en la URL.</h2>";
        return;
    }

    const script = document.createElement('script');
    script.src = `${ci}/perfil.json`;
    script.onload = function () {
        if (typeof perfil !== "object") {
            document.body.innerHTML = "<h2>El perfil no se cargó correctamente.</h2>";
            return;
        }

        document.title = perfil.nombre;
        document.getElementById("imagen-perfil").src = `${ci}/${perfil.imagen}`;
        document.getElementById("nombre").textContent = perfil.nombre;
        document.getElementById("descripcion").textContent = perfil.descripcion;
        document.getElementById("color").textContent = perfil.color;
        document.getElementById("libro").textContent = perfil.libro;
        document.getElementById("musica").textContent = perfil.musica;
        document.getElementById("videojuego").textContent = perfil.video_juego;
        document.getElementById("lenguaje").innerHTML = perfil.lenguajes.map(l => `<strong>${l}</strong>`).join(', ');
        
        const emailLink = document.getElementById("link-email");
        emailLink.href = `mailto:${perfil.email}`;
        emailLink.textContent = perfil.email;

        // Llamamos a aplicarIdioma y le pasamos tanto config como perfil
        aplicarIdioma(config, perfil);
    };

    script.onerror = function () {
        document.body.innerHTML = `<h2>No se encontró el perfil para la cédula: ${ci}</h2>`;
    };

    document.body.appendChild(script);
};

function aplicarIdioma(config) {
    document.getElementById("color-query").textContent = config.color;
    document.getElementById("libro-query").textContent = config.libro;
    document.getElementById("musica-query").textContent = config.musica;
    document.getElementById("videojuego-query").textContent = config.video_juego;
    document.getElementById("lenguaje-query").innerHTML = `<strong>${config.lenguajes}</strong>`;
    const emailText = config.email.replace("[email]", `<a href="mailto:${perfil.email}">${perfil.email}</a>`);
    document.getElementById("contacto-query").innerHTML = emailText;
}


