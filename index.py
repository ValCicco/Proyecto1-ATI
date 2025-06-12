import os
import json
from http import cookies
from urllib.parse import parse_qs
import mimetypes

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def application(environ, start_response):
    path = environ.get("PATH_INFO", "/")

    static_extensions = (".json", ".js", ".css", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".ico",".JPEG",".JPG", ".PNG")

    if any(path.endswith(ext) for ext in static_extensions):
        file_path = os.path.join(BASE_DIR, path.lstrip("/"))
        try:
            with open(file_path, "rb") as f:
                content = f.read()
            content_type, _ = mimetypes.guess_type(file_path)
            if not content_type:
                content_type = "application/octet-stream"
            start_response("200 OK", [("Content-Type", content_type)])
            return [content]
        except FileNotFoundError:
            start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"Archivo no encontrado"]

    cookie_header = environ.get("HTTP_COOKIE", "")
    c = cookies.SimpleCookie()
    c.load(cookie_header)

    params = parse_qs(environ.get("QUERY_STRING", ""))
    student_id = params.get("ci", [None])[0]
    lang = params.get("lang", ["es"])[0].lower()
    lang_upper = lang.upper()

    try:
        with open(os.path.join(BASE_DIR, "datos/index.json"), "r", encoding="utf-8") as f:
            perfiles = json.load(f)
    except Exception as e:
        start_response("500 Internal Server Error", [("Content-Type", "text/plain; charset=utf-8")])
        return [f"Error leyendo datos/index.json: {str(e)}".encode("utf-8")]

    try:
        with open(os.path.join(BASE_DIR, f"conf/config{lang_upper}.json"), "r", encoding="utf-8") as f:
            config = json.load(f)
    except FileNotFoundError:
        start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
        return [f"Archivo de configuración para el idioma '{lang}' no encontrado.".encode("utf-8")]
    except Exception as e:
        start_response("500 Internal Server Error", [("Content-Type", "text/plain; charset=utf-8")])
        return [f"Error leyendo config: {str(e)}".encode("utf-8")]

    if student_id:
        perfil = next((p for p in perfiles if p["ci"] == student_id), None)
        if perfil is None:
            start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
            return [b"Perfil no encontrado"]

        nombre = perfil.get("nombre", "No Disponible")
        bio = perfil.get("bio", "")
        foto_url = perfil.get("foto", "No especificado")  
        color_favorito = perfil.get("color_favorito", "No especificado")
        libro_favorito = perfil.get("libro_favorito", "No especificado")
        musica_preferida = perfil.get("musica_preferida", "No especificado")
        videojuegos_favoritos = perfil.get("videojuegos_favoritos", "No especificado")
        lenguajes_aprendidos = perfil.get("lenguajes_aprendidos", "No especificado")
        email = perfil.get("email", "noemail@example.com")

        html = f"""
        <!DOCTYPE html>
        <html lang="{lang}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="http://www.ciens.ucv.ve/portalasig2/favicon.ico">
            <title>{nombre}</title>
            <link rel="stylesheet" href="/ATI/css/style.css">
        </head>
        <body>
            <div class="perfil">
                <img alt="Foto de perfil" class="imagen-perfil" id="imagen-perfil" src="{foto_url}">
                <div class="info-perfil">
                    <h1 id="nombre">{nombre}</h1>
                    <p class="descripcion-info" id="descripcion">{bio}</p>
                    <table>
                        <tr><td id="color-query">Mi color favorito es:</td><td id="color">{color_favorito}</td></tr>
                        <tr><td id="libro-query">Mi libro favorito es:</td><td id="libro">{libro_favorito}</td></tr>
                        <tr><td id="musica-query">Estilo de música preferida es:</td><td id="musica">{musica_preferida}</td></tr>
                        <tr><td id="videojuego-query">Mis Video juegos favoritos son:</td><td id="videojuego">{videojuegos_favoritos}</td></tr>
                        <tr><td id="lenguaje-query"><strong>Lenguajes aprendidos:</strong></td><td id="lenguaje">{lenguajes_aprendidos}</td></tr>
                    </table>
                    <div class="contacto">
                        <p id="contacto-query">
                            Si necesitan comunicarse conmigo me pueden escribir a:
                            <a href="mailto:{email}" id="link-email">{email}</a>
                        </p>
                    </div>
                </div>
            </div>
            <script src="/js/perfil.js"></script>
        </body>
        </html>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [html.encode("utf-8")]

    elif path == "/" or path == "/index.py":
        html = f"""
        <!DOCTYPE html>
        <html lang="{lang}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="http://www.ciens.ucv.ve/portalasig2/favicon.ico">
            <title>{config['sitio'][0]} {config['sitio'][1]} {config['sitio'][2]}</title>
            <link rel="stylesheet" href="/ATI/css/style.css">
        </head>
        <body class="index">
            <header>
                <nav>
                    <ul class="menu">
                        <li><h1 id="titulo"></h1></li>
                        <li class="saludo" id="saludo">Hola, <span>Valeria Ciccolella</span></li>
                        <li class="buscar">
                            <form action="" method="get">
                                <input type="text" name="query" id="buscar-input" placeholder="Nombre...">
                                <button type="submit" id="buscar-boton">Buscar</button>
                            </form>
                        </li>
                    </ul>
                </nav>
            </header>
            <section>
                <ul class="menu-dummies"></ul>
                <p id="no-results-message" class="no-results-mensaje" style="display:none;"></p>
            </section>
            <footer>
                <p id="copyright"></p>
            </footer>
            <script src="/js/index.js"></script>
        </body>
        </html>
        """
        start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
        return [html.encode("utf-8")]

    else:
        start_response("404 Not Found", [("Content-Type", "text/plain; charset=utf-8")])
        return [b"Pagina no encontrada"]

