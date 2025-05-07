window.onload = function() {
    const listado = document.querySelector('.menu-dummies');  

    perfiles.forEach((perfil) => {
        const li = document.createElement('li');
        li.classList.add('dummies');

        const link = document.createElement("a");
        link.href = `perfil.html?ci=${perfil.ci}&lang=es`;

        const img = document.createElement('img');
        img.setAttribute('srcset', `${perfil.ci}/CEDULAPequena.jpeg 200w, ${perfil.imagen} 720w`);
        img.setAttribute('sizes', '(min-width: 769px) 720px, (max-width: 769px) 200px');
        img.setAttribute('alt', `Imagen de ${perfil.nombre}`);

        const h4 = document.createElement('h4');
        h4.textContent = perfil.nombre; 

        link.appendChild(img);
        link.appendChild(h4);
        li.appendChild(link);
        listado.appendChild(li);
    });
};

function aplicarIdioma(config) {
    document.title = config.sitio.join(" ");
    document.getElementById("copyright").textContent = config.copyRight;
    document.getElementById("buscar-input").placeholder = config.nombre + "...";
    document.getElementById("titulo").innerHTML = `${config.sitio[0]} <span>${config.sitio[1]}</span> ${config.sitio[2]}`;
    document.getElementById("buscar-boton").textContent = config.buscar;
    let saludoElement = document.getElementById("saludo");
    let textoAntesDelSpan = saludoElement.firstChild.textContent;
    saludoElement.firstChild.textContent = config.saludo + ", "; 
}