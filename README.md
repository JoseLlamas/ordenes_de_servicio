Instalación en modo development

cat env.development.example > .env

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
$ docker compose -f compose.yaml up -d --build ordenes_servicio