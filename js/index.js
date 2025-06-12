function obtenerParametro(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

window.onload = async function () {
    const listado = document.querySelector('.menu-dummies');
    const buscarInput = document.getElementById('buscar-input');
    const buscarBoton = document.getElementById('buscar-boton');
    const noResultsMessage = document.getElementById('no-results-message'); 
    const lang = (obtenerParametro('lang') || 'es').toLowerCase();
    const ci = obtenerParametro('ci');

    try {
        const langUpper = lang.toUpperCase();
        const configResp = await fetch(`conf/config${langUpper}.json`);
        const config = await configResp.json();
        aplicarIdioma(config);

        const resp = await fetch('datos/index.json');
        const perfiles = await resp.json();

        function mostrarPerfiles(perfilesAMostrar) {
            listado.innerHTML = ''; 
            perfilesAMostrar.forEach((perfil) => {
                const li = document.createElement('li');
                li.classList.add('dummies');

                const link = document.createElement("a");
                link.href = `index.py?ci=${perfil.ci}&lang=${lang}`;

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

                li.addEventListener('click', function () {
                    li.classList.toggle('visited');
                });
            });
        }

        if (ci) {
            const perfil = perfiles.find(p => p.ci === ci);
            if (perfil) {
                mostrarPerfiles([perfil]);
                noResultsMessage.textContent = '';
            } else {
                mostrarPerfiles([]);
                noResultsMessage.textContent = config.no_results.replace('[query]', ci);
                noResultsMessage.style.display = 'block';
            }
        } else {
            mostrarPerfiles(perfiles);
        }

        buscarBoton.addEventListener('click', function (event) {
            event.preventDefault();
            const query = buscarInput.value.toLowerCase();
            const resultados = perfiles.filter(perfil =>
                perfil.nombre.toLowerCase().includes(query)
            );

            if (resultados.length > 0) {
                mostrarPerfiles(resultados);
                noResultsMessage.textContent = '';
            } else {
                mostrarPerfiles([]);
                noResultsMessage.textContent = config.no_results.replace('[query]', query);
                noResultsMessage.style.display = 'block';
            }
        });

    } catch (error) {
        console.error('Error cargando datos:', error);
    }
};

function aplicarIdioma(config) {
    document.title = config.sitio.join(" ");
    document.getElementById("copyright").textContent = config.copyRight;
    document.getElementById("buscar-input").placeholder = config.nombre + "...";
    document.getElementById("titulo").innerHTML = `${config.sitio[0]} <span>${config.sitio[1]}</span> ${config.sitio[2]}`;
    document.getElementById("buscar-boton").textContent = config.buscar;

    const saludoElement = document.getElementById("saludo");
    if (saludoElement && saludoElement.firstChild) {
        saludoElement.firstChild.textContent = config.saludo + ", ";
    }
}
