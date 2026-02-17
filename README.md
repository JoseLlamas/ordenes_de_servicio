Instalación en modo development

cat env.development.example > .env

en esta parte, en MYSQL_HOST debe ir con "127.0.0.1" y en MYSQL_PORT en "3311" y se quita ORIGIN, esto es para producción

Ejecutar

docker compose -f compose.dev.yaml up -d db

Entrar a mysql

docker exec -it ordenes_de_servicio-mysql-dev.local mysql -u root -p

ejecutar para dar acceso al usuario

drop user if exists 'usuario'@'localhost';
drop user if exists 'usuario'@'%';
create user 'usuario'@'%' identified by 'password';
grant all privileges on db.* to 'usuario'@'%';
flush privileges;

sustituir los datos que están en el env

Para bajar el servicio de mysql

docker compose -f compose.dev.yaml down -v db

###################

$ cat env.production.example > .env

Algo importante, en el .env, en MYSQL_HOST se debe poner "db" y en MYSQL_PORT se debe poner "3306", esto es para la compilación, además de poner ORIGIN, con la ip del servidor

$ docker compose -f compose.yaml up -d --build ordenes_servicio

hacer lo siguiente

docker exec -it ordenes_de_servicio-mysql.local mysql -u root -p

ejecutar para dar acceso al usuario

drop user if exists 'usuario'@'localhost';
drop user if exists 'usuario'@'%';
create user 'usuario'@'%' identified by 'password';
grant all privileges on db.* to 'usuario'@'%';
flush privileges;

después de esto, en el .env, para poner correr la migración y el seed, hay que poner en MYSQL_HOST=127.0.0.1 y en MYSQL_PORT=3311, después de correr las migraciones, se regresa a como estaba...osea, con "db" t "3306" en los respectivas variables de ambiente