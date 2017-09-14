# Integration test

Each part of the integration test is in a `_test.js` file.  Each such file creates a connection to the webapp, which is supposed to be up and running together with a test database.  You can start a local, ephemeral database by

    $ docker-compose up -d

and run the server and integration test against it by

    $ npm run full-test

See [`package.json`](../../package.json) and [`docker-compose.yml`](../../docker-compose.yml).

To only run a single test over and over again during [TDD](http://mherman.org/blog/2016/04/28/test-driven-development-with-node), put an `only` in the specific test you are working with, like

    describe.only('/my/endpoint', () => { ... });

If you want the opposite, to skip a single test, do:

    describe.skip('/my/endpoint', () => { ... });

Of course, such changes should be removed before any commits.

To only run a subset of tests that go together, you have to manually start the backend and then use `--grep` option with mocha:

    $ docker-compose up -d
    $ npm run start-backend
    $ npm run test-integration --silent -- --grep /v1/books

