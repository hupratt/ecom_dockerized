virtualenv -p python3.8 .

source bin/activate

docker build -t ecom-react-webapp:v1 .

docker network create ecom-network

docker compose run web python manage.py migrate

docker volume create 

docker compose exec web python manage.py migrate