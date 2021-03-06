# Development

To setup the system locally, in the root directory:

    $ touch current.env     // Use default configuration.
    $ npm install           // Install dependencies.

To run the system locally:

    $ docker-compose up -d  // Start local PostgreSQL database & community service.
    $ npm start             // Run both backend and frontend services in parallel.

TO fetch and inject data from the metakompas:

    $ npm run fetch-inject-metakompas  // 

If you want to manually start up a PostgreSQL server, it needs to run on port 5432 and have a database called `contentfirst` owned by `contentfirst`; see the following section about environments.

To run fast tests on local machine:

    $ npm run lint-js       // Run ESLint on Javascript.
    $ npm run test-units    // Run unit tests.
    $ npm test              // Run both lint & unit tests.

To run full acceptance test:

    $ docker-compose up -d  // Start local PostgreSQL database.
    $ npm run db-migrate
    $ npm run test-full     // Run all test, including database acceptance.

Read [more about acceptance testing](acceptance/readme.md).

See also [service endpoints](../doc/endpoints.md).

## Database

To start up a local database:

    $ docker-compose up -d  // Start local PostgreSQL database.

To connect to the database:

    $ docker exec -it -u postgres contentfirst_database_1 psql

To add a new table in the database, add a new table name to [`constants.js`](server/constants.js), add file to [`migrations/`](migrations/) where the new table is created/destroyed, and incorporate the new table table in [`cleanup-db.js`](acceptance/cleanup-db.js) so that the test will know how to clear the database.

To manually migrate the database:

    $ npm run db-migrate

If upgrade fails during development, then you can start from scratch by

    $ docker kill contentfirst_database_1
    $ docker system prune
    $ docker-compose up -d
    $ npm run db-migrate

## Symbolic links

The [module-alias](https://www.npmjs.com/package/module-alias) package is used to create symbolic links such that [custom libraries](lib/) and [test fixtures](fixtures/) can used anywhere in the code likes this:

    const tcp = require('__/tcp-utils');
    const config = require('server/config');
    const database = require('__/database')(config.db);
    const input = require('fixtures/book.json')

## Coverage

Use `npm run coverage --silent` (after starting the database and community service) to produce a code-coverage report, which will end up in `coverage/lcov-report/index.html`.

## Caveats

- In development mode, the `PORT` of the backend service needs to agree with the `proxy` setting in [`package.json`](package.json).
- It seems you need to install *babel-eslint* globally: `npm install -g babel-eslint`.  And while you're at it, install the nifty *nsrun* globally, and use it like `nsrun test-frontend`.
