# Development

To setup the system locally:

    $ touch current.env     // Use default configuration.
    $ npm install           // Install dependencies.

To run the system locally:

    $ docker-compose up -d  // Start local PostgreSQL database.
    $ npm start             // Run both backend and frontend services in parallel.

If you want to manually start up a PostgreSQL server, it needs to run on port 5432 and have a database called `contentfirst` owned by `contentfirst`, see the following section about environments.

To run fast tests on local machine:

    $ npm run lint-js       // Run ESLint on Javascript.
    $ npm run test-units    // Run unit tests.
    $ npm test              // Run both lint & unit tests.

To run full integration test:

    $ docker-compose up -d  // Start local PostgreSQL database.
    $ npm run test-full     // Run all test, including database integration.

See also [service endpoints](../doc/endpoints.md).

## Database

To start up a local database:

    $ docker-compose up -d  // Start local PostgreSQL database.

To connect to the database:

    $ docker exec -it -u postgres contentfirst_database_1 psql

## Node setup

The [node setup](../setup-node-env.sh) creates symbolic links

    __ -> ../src/lib
    server -> ../src/server
    client -> ../src/client

inside `node_modules` such that [our custom libraries](lib/) can used likes this anywhere in the code:

    const config = require('server/config');
    const logger = require('__/logging')(config.logger);

The node setup runs automatically after every `npm install`

## Caveats

- After adding new packages with `npm install --save newpackage`, you have to `npm run postinstall` to re-establish the symbolic links in `node_modules`.
- In development mode, the `PORT` of the backend service needs to agree with the `proxy` setting in [`package.json`](package.json).
