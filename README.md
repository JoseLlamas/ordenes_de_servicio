Instalación en modo development

cat env.example > .env

en esta parte, en MYSQL_HOST debe ir con "127.0.0.1" y en MYSQL_PORT en "3311" y se quita ORIGIN y APP_PORT_FORWARD, esto último es para producción

Ejecutar

docker compose -f compose.dev.yaml up -d db

Para bajar el servicio de mysql

docker compose -f compose.dev.yaml down -v db

Si quiere borrar el volumen donde esta la db

docker volume rm nombre_volumen

###################
Para producción

Ejecutar

$ mkdir -p data/firmas data/avatares
$ chown 1000:1000 data -R

Después

$ cat env.example > .env

Algo importante, en el .env, en MYSQL_HOST se debe poner "db" y en MYSQL_PORT se debe poner "3306", esto es para la compilación, además de poner ORIGIN y APP_PORT_FORWARD, con la ip del servidor (con puerto, el especificado en APP_PORT_FORWARD)

$ docker compose -f compose.yaml up -d --build ordenes_servicio

Después de esto, en el .env, para poner correr la migración y el seed, hay que poner en MYSQL_HOST=127.0.0.1 (o la ip del servidor donde está el proyecto) y en MYSQL_PORT=3311, después de correr las migraciones, se regresa a como estaba...osea, con "db" t "3306" en los respectivas variables de ambiente. Esto es por que la migración y el seed se tiene que ejecutar desde afuera del contenedor node.

#####

restringir el acceso a root desde remoto

hacer lo siguiente

docker exec -it ordenes_de_servicio-mysql.local mysql -u root -p

alter user 'root'@'%' account lock;

para activar acceso

alter user 'root'@'%' account unlock;

####

para redireccionar via ssh al mysql, para conectarse desde remoto

ssh -L 3306:127.0.0.1:3311 -p 2234 sistemas@187.203.172.120
