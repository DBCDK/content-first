# Content First

The system currently runs on [`content-first.demo.dbc.dk`](http://content-first.demo.dbc.dk), and you can get an overview of how it is composed in the [architecture description](doc/content-first-achitecture.pdf).

For development of the system, see [`src`](src/readme.md).

## Deployment

The service's test database requires at least PostgreSQL 9.6, but the schemas only require support for JSONB.

To run the database tests against the server (requires postgresql):

    $ . /nvm.sh
    $ nvm install
    $ npm install
    $ cp env/integration.env current.env
    $ npm run test-integration --silent

To start the server in staging or production mode:

    $ . /nvm.sh
    $ nvm install
    $ npm install --production
    $ cp env/production.env current.env
    $ npm run start-backend

## Build server

Use the [exclude list](./archive-excludes.txt) when the build server makes an archive file of the result of the build.  Use like this: 

     tar -X archive-excludes.txt -cz -f $JOB_BASE_NAME-$BUILD_NUMBER.tar.gz .


## Environments

The backend service controlled by environment variables.  Most scripts assume that such variables are set in your local file `current.env`.  If you are just running the system on your own machine during development, you can most likely just use an empty `current.env`, but it has to exist.  The [`env`](env/) directory holds templates for other used configurations.  If you need to tweak settings, the application obeys the following environment variables.

| Environment variable    | Default      | Effect                           |
| ----------------------- | ------------ | -------------------------------- |
| AUTH_CLIENT_ID          | content-first | Id known to authentication service |
| AUTH_CLIENT_SECRET      | secret        | Secret known to authentication service |
| AUTH_URL                | https://auth.dbc.dk | Where to contact authentication service |
| DB_CONNECTIONS_POOL_MAX | 10           | Maximum connections in DB pool   |
| DB_CONNECTIONS_POOL_MIN | 2            | Minimum connections in DB pool   |
| DB_HOST                 | 127.0.0.1    | Database host                    |
| DB_NAME                 | contentfirst | Name of the database             |
| DB_USER                 | contentfirst | Database user                    |
| DB_USER_PASSWORD        |              | Database password                |
| INTERNAL_PORT           | 3002         | TCP port for the internal service |
| LOG_LEVEL               | INFO         | Verbosity of service log (OFF, ERROR, WARN, WARNING, INFO, DEBUG, TRACE) |
| LOG_SERVICE_ERRORS      | 1            | Record all 5xx errors (1), or ignore 5xx errors (0) |
| NODE_ENV                | development  | Controls other service settings (development, ci, production) |
| LOGIN_URL               | https://login.bib.dk | Where to contact Adgangsplatform |
| PORT                    | 3001         | TCP port for the public service  |
| PRETTY_LOG              | 1            | Pretty printed log statements (1), or one-line log statements (0) |


## Endpoints

The backend service has the following admistrative endpoints:

| Endpoint  | Function |
| --------- | -------- |
| `/howru`  | Returns the service status as JSON. |
| `/pid`    | Returns the process id of the service.   |

See also [service endpoints](doc/endpoints.md).

----

[![Build Status](https://travis-ci.org/DBCDK/content-first.svg?branch=master)](https://travis-ci.org/DBCDK/content-first)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/content-first/badges/score.svg)](https://www.bithound.io/github/DBCDK/content-first)
[![Coverage Status](https://coveralls.io/repos/github/DBCDK/content-first/badge.svg?branch=master)](https://coveralls.io/github/DBCDK/content-first?branch=master)

