# Development

To setup the system locally, in the root directory:

    $ touch current.env     // Use default configuration.
    $ npm install           // Install dependencies.

To run the system locally:

    $ docker-compose up -d  // Start local PostgreSQL database.
    $ npm start             // Run both backend and frontend services in parallel.

If you want to manually start up a PostgreSQL server, it needs to run on port 5432 and have a database called `contentfirst` owned by `contentfirst`; see the following section about environments.

To run fast tests on local machine:

    $ npm run lint-js       // Run ESLint on Javascript.
    $ npm run test-units    // Run unit tests.
    $ npm test              // Run both lint & unit tests.

To run full integration test:

    $ docker-compose up -d  // Start local PostgreSQL database.
    $ npm run test-full     // Run all test, including database integration.

Read [more about integration testing](integration/readme.md).

See also [service endpoints](../doc/endpoints.md).

## Database

To start up a local database:

    $ docker-compose up -d  // Start local PostgreSQL database.

To connect to the database:

    $ docker exec -it -u postgres contentfirst_database_1 psql

To add a new table in the database, add a new table name to [`constants.js`](server/constants.js), add file to [`migrations/`](migrations/) where the new table is created/destroyed, and incorporate the new table table in [`cleanup-db.js`](integration/cleanup-db.js) so that the test will know how to clear the database.

To manually migrate the database:

    $ npm run db-migrate

## Node setup

The [node setup](../setup-node-env.sh) creates symbolic links

    __ -> ../src/lib
    server -> ../src/server
    client -> ../src/client
    fixtures -> ../src/fixtures

inside `node_modules` such that [custom libraries](lib/) and [test fixtures](fixtures/) can used anywhere in the code likes this:

    const tcp = require('__/tcp-utils');
    const config = require('server/config');
    const database = require('__/database')(config.db);
    const input = require('fixtures/book.json')

The node setup runs automatically after every `npm install`

## Coverage

Use `npm run coverage --silent` (after starting the database) to produce a code-coverage report, which will end up in `coverage/lcov-report/index.html`.

On the build server, the [config file](../.travis.yml) uses the `after_script` to instruct Travis to send coverage data to Coveralls, which has been configured (through its UI) to look in the root directory for the code.

## Caveats

- After adding new packages with `npm install --save newpackage`, you have to `npm run postinstall` to re-establish the symbolic links in `node_modules`.
- In development mode, the `PORT` of the backend service needs to agree with the `proxy` setting in [`package.json`](package.json).
