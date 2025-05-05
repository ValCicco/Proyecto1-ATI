document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".menu-dummies");

    const mostrarPerfiles = (perfiles) => {
        contenedor.innerHTML = ""; 
        perfiles.forEach(perfil => {
            const li = document.createElement("li");
            li.className = "dummies";

            const link = document.createElement("a");
            link.href = `perfil.html?ci=${perfil.ci}&lang=es`;

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

    fetch('datos/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el JSON: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            mostrarPerfiles(data);
        })
        .catch(error => {
            console.error("No se pudo cargar la lista de estudiantes:", error);
            contenedor.innerHTML = "<li>Error al cargar los datos.</li>";
        });
});
