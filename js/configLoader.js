(function () {
    const params = new URLSearchParams(window.location.search);
    const lang = (params.get("lang") || "ES").toUpperCase(); 
    const scriptSrc = `conf/config${lang}.json`;  

    console.log('Cargando el archivo de configuración:', scriptSrc);  

    const script = document.createElement("script");
    script.src = scriptSrc;

    script.onload = () => {
        console.log('Archivo de idioma cargado correctamente.');  
        if (typeof config !== "object") {
            console.error("Archivo de idioma inválido.");
            return;
        }

        aplicarIdioma(config);  
    };

    script.onerror = () => {
        console.error(`No se pudo cargar ${scriptSrc}`);  
    };

    document.head.appendChild(script);  
})();


