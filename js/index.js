window.onload = function() {
    const listado = document.querySelector('.menu-dummies');  

    perfiles.forEach((perfil) => {
        const enlace = document.createElement('a');
        enlace.href = `perfil.html?ci=${perfil.ci}`;

        const li = document.createElement('li');
        li.classList.add('dummies');

        const img = document.createElement('img');
        img.classList.add('img7');
        img.setAttribute('srcset', `${perfil.ci}/CEDULAPequena.jpeg 200w, ${perfil.imagen} 720w`);
        img.setAttribute('sizes', '(min-width: 769px) 720px, (max-width: 769px) 200px');
        img.setAttribute('alt', `Imagen de ${perfil.nombre}`);

        const h4 = document.createElement('h4');
        h4.textContent = perfil.nombre; 

        li.appendChild(img);
        li.appendChild(h4);
        enlace.appendChild(li);
        listado.appendChild(enlace);
    });
};
