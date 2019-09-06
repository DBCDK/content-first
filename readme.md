# Content First

The system currently runs on [`http://laesekompas.dk`](http://content-first.demo.dbc.dk), and you can get an overview of how it is composed in the [architecture description](doc/content-first-architecture.pdf).

For development of the system, see [`src`](src/readme.md).

## Development

    $ . /nvm.sh
    $ nvm install
    $ npm install
    $ cp env/integration.env current.env
    $ docker-compose -f docker-compose-dev.yml up
    $ npm run start
    $ npm run fetch-inject-metakompas (cf must be started)
    $ npm run init-storage (cf must be started)
    
### Users for development and Cypress testing
Create normal user
`http://localhost:3000/v1/test/create/otto`

Create user and assign the editor role
`http://localhost:3000/v1/test/create/didrik?editor=true`

When multiple users are created, switch between them with
`http://localhost:3000/v1/test/login/otto`

## Deployment

The service's test database requires at least PostgreSQL 9.6, but the schemas only require support for JSONB.

To run the database tests against the server (requires postgresql):

    $ . /nvm.sh
    $ nvm install
    $ npm install
    $ cp env/integration.env current.env
    $ npm run test-acceptance --silent

To start the server in staging or production mode:

    $ . /nvm.sh
    $ nvm install
    $ npm install --production
    $ cp env/production.env current.env
    $ npm run start-backend

### required data files

Some json files need to be copied to [`src/data`](src/data) in order to build the application. Also check out which files are required for building and how to populate the app with data [`here`](src/data).

## Build server

Use the [exclude list](./tools/archive-excludes.txt) when the build server makes an archive file of the result of the build. Use like this:

    tar -X tools/archive-excludes.txt -cz -f $JOB_BASE_NAME-$BUILD_NUMBER.tar.gz .
    
## Role management in content-first
Roles are managed through the ServiceProvider-Storage API

- Fetch token for the content-first admin client
- Fetch list of all roles:
```curl -X POST "https://openplatform.dbc.dk/v3/storage" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"access_token\": \"ACCESS_TOKEN\", \"scan\": {\"_type\": \"bf130fb7-8bd4-44fd-ad1d-43b6020ad102\", \"index\": [\"_owner\",\"name\"], \"startsWith\": [\"cf-admin\", \"role\"], \"expand\": true}}"```

- Find the uniqueId (culr-id) for the user you want to assign a role
- assign role, use the "_id" from the previously fetched role-object:
```curl -X POST "https://openplatform.dbc.dk/v3/storage" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"access_token\": \"ADMIN_ACCESS_TOKEN\", \"assign_role\": {\"userId\": \"USER_ID\", \"roleId\": \"ROLE_ID\"}}"```

## Environments

The backend service controlled by environment variables. Most scripts assume that such variables are set in your local file `current.env`. If you are just running the system on your own machine during development, you can most likely just use an empty `current.env`, but it has to exist. The [`env`](env/) directory holds templates for other used configurations. If you need to tweak settings, the application obeys the following environment variables.

| Environment variable          | Default               | Effect                                                                   |
| ----------------------------- | --------------------- | ------------------------------------------------------------------------ |
| AUTH_CLIENT_ID                | content-first         | Id known to authentication service                                       |
| AUTH_CLIENT_SECRET            | something             | Secret known to authentication service & salt for hashing                |
| AUTH_URL                      | https://auth.dbc.dk   | Where to contact authentication service                                  |
| COMMUNITY_NAME                | Læsekompasset         | Id in community service                                                  |
| COMMUNITY_URL                 | http://localhost:3003 | Where to contact community service                                       |
| DB_CONNECTIONS_POOL_MAX       | 10                    | Maximum connections in DB pool                                           |
| DB_CONNECTIONS_POOL_MIN       | 2                     | Minimum connections in DB pool                                           |
| DB_HOST                       | 127.0.0.1             | Database host                                                            |
| DB_PORT                       | 5432                  | Database port                                                            |
| DB_NAME                       | contentfirst          | Name of the database                                                     |
| DB_USER                       | contentfirst          | Database user                                                            |
| DB_USER_PASSWORD              |                       | Database password                                                        |
| DMZ_HOST                      |                       |                                                                          | Is used to create redirect url for oauth2 |
| INTERNAL_PORT                 | 3002                  | TCP port for the internal service                                        |
| LOG_LEVEL                     | INFO                  | Verbosity of service log (OFF, ERROR, WARN, WARNING, INFO, DEBUG, TRACE) |
| LOG_SERVICE_ERRORS            | 1                     | Record all 5xx errors (1), or ignore 5xx errors (0)                      |
| LOGIN_URL                     | https://login.bib.dk  | Where to contact Adgangsplatform                                         |
| NODE_ENV                      | development           | Controls other service settings (development, ci, production)            |
| PORT                          | 3001                  | TCP port for the public service                                          |
| PRETTY_LOG                    | 1                     | Pretty printed log statements (1), or one-line log statements (0)        |
| MATOMO_URL                    |                       | The Matomo HTTP server address. Matomo is only enabled if this is set    |
| MATOMO_SITE_ID                |                       | The Matomo siteId                                                        |
| MATOMO_DATA_SITE_ID           |                       | The Matomo siteId for data events                                        |
| MATOMO_AID                    |                       | The Application ID connecting events to specific application instance    |
| STORAGE_URL                   |                       | URL to the openplatform storage endpoint                                 |
| STORAGE_TYPE_ID               |                       | The ID of the content-first type which must exist in the storage service | 

## Endpoints

The backend service has the following admistrative endpoints:

| Endpoint    | Function                                                     |
| ----------- | ------------------------------------------------------------ |
| `/howru`    | Returns the service status as JSON.                          |
| `/pid`      | Returns the process id of the service.                       |
| `/v1/stats` | Cleans up database and returns statistics about the service. |

See also [service endpoints](doc/endpoints.md).

## Changelog

A complete changelog for all new features is found at [CHANGELOG.md](https://github.com/DBCDK/content-first/blob/master/CHANGELOG.md) in the project root. The changelog is generated by [auto-changelog](https://github.com/CookPete/auto-changelog).
To update the changelog run the following command:
  
 $ npm version patch | minor | major
This command will update the project version in package.json and generate a new changelog in [CHANGELOG.md](https://github.com/DBCDK/content-first/blob/master/CHANGELOG.md).

#### Example:

    $ npm version patch

[More info on npm-version](https://docs.npmjs.com/cli/version.html)

---

[![Build Status](https://travis-ci.org/DBCDK/content-first.svg?branch=master)](https://travis-ci.org/DBCDK/content-first)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/content-first/badges/score.svg)](https://www.bithound.io/github/DBCDK/content-first)
[![Coverage Status](https://coveralls.io/repos/github/DBCDK/content-first/badge.svg?branch=master)](https://coveralls.io/github/DBCDK/content-first?branch=master)
[![LGTM](https://img.shields.io/badge/lgtm-analysed-blue.svg)](https://lgtm.com/projects/g/DBCDK/content-first)
