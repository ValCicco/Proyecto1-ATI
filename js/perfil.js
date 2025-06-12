function aplicarIdioma(config, perfil) {
    if (!config) return;

    const colorQuery = document.getElementById("color-query");
    if(colorQuery) colorQuery.textContent = config.color || "Mi color favorito es:";

    const libroQuery = document.getElementById("libro-query");
    if(libroQuery) libroQuery.textContent = config.libro || "Mi libro favorito es:";

    const musicaQuery = document.getElementById("musica-query");
    if(musicaQuery) musicaQuery.textContent = config.musica || "Estilo de música preferida es:";

    const videojuegoQuery = document.getElementById("videojuego-query");
    if(videojuegoQuery) videojuegoQuery.textContent = config.video_juego || "Mis Video juegos favoritos son:";

    const lenguajeQuery = document.getElementById("lenguaje-query");
    if(lenguajeQuery) lenguajeQuery.innerHTML = `<strong>${config.lenguajes || "Lenguajes aprendidos:"}</strong>`;

    const contactoQuery = document.getElementById("contacto-query");
    if(contactoQuery && perfil) {
        const emailHTML = config.email ? config.email.replace("[email]", `<a href="mailto:${perfil.email}">${perfil.email}</a>`) : `Si necesitan comunicarse conmigo me pueden escribir a: <a href="mailto:${perfil.email}">${perfil.email}</a>`;
        contactoQuery.innerHTML = emailHTML;
    }
}
window.onload = async function () {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get("ci");
    const lang = params.get("lang") || "es";

    if (!ci) {
        document.body.innerHTML = "<h2>CI no especificada en la URL.</h2>";
        return;
    }

    try {
        const responsePerfil = await fetch(`/${ci}/perfil.json`);
        if (!responsePerfil.ok) throw new Error(`Error perfil: ${responsePerfil.status}`);
        const perfil = await responsePerfil.json();

        const responseConfig = await fetch(`/conf/config${lang.toUpperCase()}.json`);
        if (!responseConfig.ok) throw new Error(`Error config: ${responseConfig.status}`);
        const config = await responseConfig.json();

        document.title = perfil.nombre;
        document.getElementById("imagen-perfil").src = `/${ci}/${perfil.imagen}`;
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

        aplicarIdioma(config, perfil);

    } catch (error) {
        document.body.innerHTML = `<h2>Error cargando perfil: ${error.message}</h2>`;
    }
}
