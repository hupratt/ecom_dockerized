# Ecom web application

![Banner](https://github.com/hupratt/ecom/blob/master/shop.jpg?raw=true)


## Database UML
<p align="center" width="100%">
    <img width="90%" src="https://github.com/hupratt/ecom/blob/master/db.png?raw=true">
</p>


## Architecture

- Ecom is a django single page (SPA) web app running on apache as a web server.
- Apache proxies requests to the WSGI application which invokes the python application itself.
- The latest multiprocessing apache module is used to create parallel replicas of our app. Each apache "event_worker" is 1 process and 1 python app. 1 process launches multiple threads so that each app is concurrently accessed by multiple users. The big performance advantage of the "event_worker" over the regular worker is that once the connection is idle, the thread gives back the control of the socket to Apache.
- There is a full decoupling of the front end with React written in JSX which is then tranpiled to vanilla javascript through the dev and build scripts specified in the package.json file.
- React components live in the "ecom/frontend" django app. Redux is extensively used to manage state in order to guarantee a single source of truth and avoid having the multiple components managing state. Each component gets the state as props from the store.
- The continuous delivery pipeline is triggered by a git push to origin by any member that has write access to this repo.
- The git push triggers a webhook where both github and jenkins are listening on in order to build the jenkins pipeline.
- Specifications of the Jenkinsfile can be found above.
- Any push to origin will trigger both webhooks however jenkins will only build the source code located in the "master" branch.

<p align="center" width="100%">
    <img width="90%" src="https://github.com/hupratt/ecom/blob/master/arch.drawio.png?raw=true">
</p>


## Features

- [x] Secure emailing with analytics: sending emails with sendgrid's service using a Recaptcha secured form
- [x] Feature 2
- [x] Feature 3

## Backend development workflow

```json
virtualenv -p python3.8 .
source bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Frontend development workflow

```json
npm i
npm run dev
```

## Ignore mypy stuff

```
echo '*' > .mypy_cache/.gitignore
```

pip freeze > requirements.txt

## Set the right encoding to avoid non ASCI chars displaying with weird characters

export LANG=en_US.UTF-8
unset PYTHONIOENCODING

## Deployment checklist

- Any changes to the requirements file?
- Any changes to the .env file?

## useful git commands

git rm -r --cached .

## Preview
![ui-demo](https://github.com/hupratt/ecom/blob/master/shop-2_Lossless.gif?raw=true)