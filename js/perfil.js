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
        document.querySelector('.imagen-perfil').src = `${ci}/${perfil.imagen}`;
        document.querySelector('h1').textContent = perfil.nombre;
        document.querySelector('.descripcion-info').textContent = perfil.descripcion;
        
        const filas = document.querySelectorAll("table tr td:nth-child(2)");
        filas[0].textContent = perfil.color;
        filas[1].textContent = perfil.libro;
        filas[2].textContent = perfil.musica;
        filas[3].textContent = perfil.video_juego;
        filas[4].innerHTML = perfil.lenguajes.join(", ");

        const emailLink = document.querySelector('.contacto a');
        emailLink.href = `mailto:${perfil.email}`;
        emailLink.textContent = perfil.email;
    };

    script.onerror = function () {
        document.body.innerHTML = `<h2>No se encontró el perfil para la cédula: ${ci}</h2>`;
    };

    document.body.appendChild(script);
};
