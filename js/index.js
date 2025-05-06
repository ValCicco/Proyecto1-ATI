window.onload = function() {
    const listado = document.querySelector('.menu-dummies');  

    perfiles.forEach((perfil) => {
        const li = document.createElement('li');
        li.classList.add('dummies');

        const link = document.createElement("a");
        link.href = `perfil.html?ci=${perfil.ci}`;

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
