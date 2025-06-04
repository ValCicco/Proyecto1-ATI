
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y apache2 && \
    apt-get clean

COPY . /var/www/html/

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]

#http://localhost:8081
#docker build -t mi-proyecto-apache .
#docker run -d -p 8081:80 --name contenedor-apache mi-proyecto-apache
