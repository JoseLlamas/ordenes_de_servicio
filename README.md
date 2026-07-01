Instalación en modo development

cat env.example > .env

Ejecutar

docker compose  up db -d

Para bajar el servicio de mysql

docker compose -f compose.dev.yaml down -v db


###################
Para producción

Ejecutar

$ mkdir -p data/firmas data/avatares
$ chown 1000:1000 data -R

Después

$ cat env.example > .env

Algo importante, en el .env, en MYSQL_HOST se debe poner "db" y en MYSQL_PORT se debe poner "3306"

ejecutar los siguientes comandos

# 1. Levantar la base de datos primero (sola, sin la app)
docker compose up db -d

# 2. Correr migraciones
docker compose --profile migrate run --rm migrate <--necesario si queremos migrar de nuevo

# 3. Correr seeds (solo la primera vez)
docker compose --profile seed run --rm seed

# 4. Levantar la app
docker compose up app -d

Sí queremos reconstruir la app debido a un nuevo cambio en el código de la aplicación, tendriamos que ejecutar

docker compose up app -d --build

restringir el acceso a root desde remoto

hacer lo siguiente

docker exec -it ordenes_de_servicio-mysql.local mysql -u root -p

alter user 'root'@'%' account lock;

para activar acceso

alter user 'root'@'%' account unlock;

####

para redireccionar via ssh al mysql, para conectarse desde remoto

ssh -L 3306:127.0.0.1:3311 -p 2234 sistemas@187.203.172.120
