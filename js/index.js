document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".menu-dummies");
    const urlParams = new URLSearchParams(window.location.search);
    const idioma = urlParams.get("lang") || "es";

    const mensajeNoResultados = document.getElementById('no-results-message');

    const mostrarPerfiles = (perfiles) => {
        contenedor.innerHTML = ""; 
        if (perfiles.length === 0 && mensajeNoResultados) {
            mensajeNoResultados.style.display = "block";
            return;
        } else if (mensajeNoResultados) {
            mensajeNoResultados.style.display = "none";
        }

        perfiles.forEach(perfil => {
            const link = document.createElement("a");
            link.href = `perfil.html?ci=${perfil.ci}&lang=es`;

            const li = document.createElement("li");
            li.className = "dummies";

            const img = document.createElement("img");
            img.src = perfil.imagen;
            img.alt = perfil.nombre;
            img.className = perfil.claseImg || "";

            const h4 = document.createElement("h4");
            h4.textContent = perfil.nombre;

            li.appendChild(img);
            li.appendChild(h4);
            link.appendChild(li);
            contenedor.appendChild(link);
        });
    };

    fetch("datos/index.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar datos/index.json');
            }
            return response.json();
        })
        .then(perfiles => {
            mostrarPerfiles(perfiles);
        })
        .catch(error => {
            console.error("Error al cargar perfiles:", error);
            if (mensajeNoResultados) {
                mensajeNoResultados.style.display = "block";
                mensajeNoResultados.textContent = "No se pudieron cargar los perfiles.";
            }
        });

    fetch(`conf/config${idioma.toUpperCase()}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la carga del archivo JSON');
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
        })
        .catch(error => {
            console.error('Error cargando el archivo de idioma:', error);
            alert("No se pudo cargar el archivo de idioma.");
        });
});
