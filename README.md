Instalación en modo development

cat env.example > .env

en esta parte, en MYSQL_HOST debe ir con "127.0.0.1" y en MYSQL_PORT en "3311" y se quita ORIGIN, esto último es para producción

Ejecutar

docker compose -f compose.dev.yaml up -d db

Para bajar el servicio de mysql

docker compose -f compose.dev.yaml down db

Si quiere borrar el volumen donde esta la db

docker volume rm nombre_volumen

###################

$ cat env.example > .env

Algo importante, en el .env, en MYSQL_HOST se debe poner "db" y en MYSQL_PORT se debe poner "3306", esto es para la compilación, además de poner ORIGIN, con la ip del servidor

$ docker compose -f compose.yaml up -d --build ordenes_servicio

Después de esto, en el .env, para poner correr la migración y el seed, hay que poner en MYSQL_HOST=127.0.0.1 (o la ip del servidor donde está el proyecto) y en MYSQL_PORT=3311, después de correr las migraciones, se regresa a como estaba...osea, con "db" t "3306" en los respectivas variables de ambiente. Esto es por que la migración y el seed se tiene que ejecutar desde afuera del contenedor node.

#####

en caso de que tenga problemas con permisos de usuario mysql

hacer lo siguiente

docker exec -it ordenes_de_servicio-mysql.local mysql -u root -p

ejecutar para dar acceso al usuario

drop user if exists 'usuario'@'localhost';
drop user if exists 'usuario'@'%';
create user 'usuario'@'%' identified by 'password';
grant all privileges on db.* to 'usuario'@'%';
flush privileges;