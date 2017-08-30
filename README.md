# Content First

See the initial whiteboard doodles about [database content](doc/content-first.png), [recommender lanes](doc/content-first-belts), and [endpoints](doc/content-first-backend.png).

## Development

To run the system locally:

    $ touch current.env     // Use default configuration.
    $ docker-compose up -d  // Start local PostgreSQL database.
    $ npm install           // Install dependencies.
    $ npm start             // Run both backend and frontend services in parallel.

If you want to manually start up a PostgreSQL server, it needs to run on port 5432 and have a database called `contentfirst` owned by `contentfirst`, see the following section about environments.

To run tests on local machine:

    $ npm test

See [developer instructions](src/readme.md) in the `src` directory for more information.

## Deployment

The service's test database requires at least PostgreSQL 9.6, but the schemas only require support for JSONB.

To run the database tests against the server (requires postgresql):

    $ . /nvm.sh
    $ nvm install
    $ npm install
    $ cp integration.env current.env
    $ npm run test-integration --silent

To start the server in staging or production mode:

    $ . /nvm.sh
    $ nvm install
    $ npm install --production
    $ cp envproduction.env current.env
    $ npm run start-server

## Environments

The backend service controlled by environment variables.  Most scripts assume that such variables are set in your local file `current.env`.  If you are just running the system on your own machine during development, you can most likely just use an empty `current.env`, but it has to exist.  The [`env`](env/) directory holds templates for other used configurations.  If you need to tweak settings, the application obeys the following environment variables.

| Environment variable    | Default      | Effect                           |
| ----------------------- | ------------ | -------------------------------- |
| DB_CONNECTIONS_POOL_MAX | 10           | Maximum connections in DB pool   |
| DB_CONNECTIONS_POOL_MIN | 2            | Minimum connections in DB pool   |
| DB_HOST                 | 127.0.0.1    | Database host                    |
| DB_NAME                 | contentfirst | Name of the database             |
| DB_USER                 | contentfirst | Database user                    |
| DB_USER_PASSWORD        |              | Database password                |
| LOG_LEVEL               | DEBUG        | Verbosity of service log (OFF, ERROR, WARN, WARNING, INFO, DEBUG, TRACE) |
| LOG_SERVICE_ERRORS      | 1            | Record all 5xx errors (1), or ignore 5xx errors (0) |
| NODE_ENV                | development  | Controls other service settings (development, ci, production) |
| PORT                    | 3001         | TCP port for the service         |
| PRETTY_LOG              | 1            | Pretty printed log statements (1), or one-line log statements (0) |


## Endpoints

The backend service has the following admistrative endpoints:

| Endpoint  | Function |
| --------- | -------- |
| `/status` | Returns the service status as JSON. |
| `/pid`    | Returns the process id of the service.   |

## Caveats

- After adding new packages with `npm install --save newpackage`, you have to `npm run postinstall` to re-establish the symbolic links in `node_modules`.
- In development mode, the `PORT` of the backend service needs to agree with the `proxy` setting in [`package.json`](package.json).

----

[![Build Status](https://travis-ci.org/DBCDK/content-first.svg?branch=master)](https://travis-ci.org/DBCDK/content-first)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/content-first/badges/score.svg)](https://www.bithound.io/github/DBCDK/content-first)
