FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y apache2 python3 python3-pip libapache2-mod-wsgi-py3 curl && \
    apt-get clean

RUN pip3 install flask flask-session

RUN a2enmod wsgi headers rewrite

RUN mkdir -p /var/www/html/ATI

COPY . /var/www/html/ATI/

RUN chmod +x /var/www/html/ATI/*.py || true

COPY dockerfile-conf/ati-site.conf /etc/apache2/sites-available/ati-site.conf

RUN a2ensite ati-site.conf && \
    a2dissite 000-default.conf

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

EXPOSE 80

CMD ["apachectl", "-D", "FOREGROUND"]


#docker build -t contedorestudiante29640095 .
#docker run -d -p 8080:80 contedorestudiante29640095
#http://localhost:8080/ATI/index.py