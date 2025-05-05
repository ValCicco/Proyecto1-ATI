document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".menu-dummies");
    const urlParams = new URLSearchParams(window.location.search);
    const idioma = urlParams.get("lang") || "es";
    const mensajeNoResultados = document.getElementById('no-results-message');

    let perfiles = []; 

    const mostrarPerfiles = (perfilesMostrar) => {
        contenedor.innerHTML = "";
        perfilesMostrar.forEach(perfil => {
            const li = document.createElement("li");
            li.className = "dummies";

            const link = document.createElement("a");
            link.href = `perfil.html?ci=${perfil.ci}&lang=${idioma}`;

            const img = document.createElement("img");
            img.src = perfil.imagen;
            img.alt = perfil.nombre;

            const h4 = document.createElement("h4");
            h4.textContent = perfil.nombre;

            link.appendChild(img);
            link.appendChild(h4);
            li.appendChild(link);
            contenedor.appendChild(li);
        });
    };

    fetch("datos/index.json")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el archivo de perfiles.");
            return response.json();
        })
        .then(data => {
            perfiles = data;
            mostrarPerfiles(perfiles); 
        })
        .catch(error => {
            console.error("Error cargando los perfiles:", error);
            mensajeNoResultados.textContent = "No se pudieron cargar los perfiles.";
            mensajeNoResultados.style.display = 'block';
        });

    fetch(`conf/config${idioma.toUpperCase()}.json`)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el archivo de idioma.");
            return response.json();
        })
        .then(config => {
            const elementosTraducibles = document.querySelectorAll('[data-i18n], [data-i18n-placeholder]');
            
            elementosTraducibles.forEach(element => {
                const i18nKey = element.getAttribute('data-i18n') || element.getAttribute('data-i18n-placeholder');
                if (i18nKey && config[i18nKey]) {
                    if (element.hasAttribute('data-i18n-placeholder')) {
                        element.setAttribute('placeholder', `${config[i18nKey]}...`);
                    } else if (element.tagName === 'BUTTON' && i18nKey === 'buscar') {
                        element.textContent = config[i18nKey];
                    } else if (Array.isArray(config[i18nKey])) {
                        if (i18nKey === "sitio") {
                            const [parte1, parte2, parte3] = config[i18nKey];
                            document.title = `${parte1} ${parte2} ${parte3}`;
                            element.innerHTML = `${parte1}<span>${parte2}</span> ${parte3}`;
                        } else {
                            element.textContent = config[i18nKey].join(' ');
                        }
                    } else if (i18nKey === 'saludo') {
                        const span = element.querySelector('#nombre-usuario');
                        const nombre = span ? span.textContent : '';
                        element.textContent = `${config[i18nKey]}, ${nombre}`;
                    } else {
                        element.textContent = config[i18nKey];
                    }
                }
            });

            const form = document.querySelector('form');
            const inputBuscar = document.querySelector('input[name="query"]');

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = inputBuscar.value.trim().toLowerCase();
                buscarEstudiantes(query, config);
            });

            const buscarEstudiantes = (query, config) => {
                const perfilesFiltrados = perfiles.filter(perfil =>
                    perfil.nombre.toLowerCase().includes(query)
                );

                if (perfilesFiltrados.length === 0) {
                    mensajeNoResultados.textContent = config.no_results.replace('[query]', query);
                    mensajeNoResultados.style.display = 'block';
                } else {
                    mensajeNoResultados.style.display = 'none';
                }

                mostrarPerfiles(perfilesFiltrados);
            };
        })
        .catch(error => {
            console.error("Error cargando el archivo de idioma:", error);
            alert("No se pudo cargar el archivo de idioma.");
        });
});