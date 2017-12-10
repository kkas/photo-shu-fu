# Photo-Shu-Fu

Photo-Shu-Fu is a photo slide show application that enables the users to communicate with people, even in distance.

## How to Run this app
Requirements:
- [heroku CLI]
- web pack
- Python 3.6.1
- Python Packages
```
astroid==1.5.3
isort==4.2.15
lazy-object-proxy==1.3.1
mccabe==0.6.1
psycopg2==2.7.3
pylint==1.7.2
redis==2.10.5
six==1.10.0
SQLAlchemy==1.1.13
tornado==4.5.1
wrapt==1.10.11
```

### How to Run the App Localy
#### Run Redis Server
TBD
#### Run PostgreSQL Server
TBD
#### set up your env file

Example
```sh
REDISCLOUD_URL='redis://localhost:6379'
DATABASE_URL='postgresql+psycopg2://username@localhost:5432/localdb'
```
See more details here for running app locally. (https://devcenter.heroku.com/articles/heroku-local)

### How to Run the App on Heroku

#### Add the Following Buildpacks

```sh
heroku buildpacks:add --index 1 heroku/nodejs
heroku buildpacks:add --index 2 https://github.com/kreativgebiet/heroku-buildpack-webpack
heroku buildpacks:add --index 3 heroku/python
```

Make sure you have added the following buildpacks.
```sh
heroku buildpacks
=== photo-shu-fu Buildpack URLs
1. heroku/nodejs
2. https://github.com/kreativgebiet/heroku-buildpack-webpack
3. heroku/python
```

### Start the app
```sh
heroku local
```

### TODO
- Add more details in README

   [heroku CLI]: <https://devcenter.heroku.com/articles/heroku-cli>

