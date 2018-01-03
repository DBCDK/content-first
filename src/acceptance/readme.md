# Acceptance test

Each part of the acceptance test is in a `_test.js` file.  Each such file creates a connection to the webapp, which is supposed to be up and running together with a test database.  You can start a local, ephemeral database by

    $ docker-compose up -d
    $ npm run db-migrate --silent

and run the server and acceptance test against it by

    $ npm run test-full

See [`package.json`](../../package.json) and [`docker-compose.yml`](../../docker-compose.yml).

To only run a single test over and over again during [TDD](http://mherman.org/blog/2016/04/28/test-driven-development-with-node), put an `only` in the specific test you are working with, like

    describe.only('/my/endpoint', () => { ... });

If you want the opposite, to skip a single test, do:

    describe.skip('/my/endpoint', () => { ... });

Of course, such changes should be removed before any commits.

To only run a subset of tests that go together, pass the `--grep` option to mocha, like

    $ npm run test-acceptance --silent -- --grep /v1/user

## Mocking parts of the server

The acceptance tests do not use the web service directly, instead they use a wrapper around the service:

    const mock = require('fixtures/mock-server');

The wrapper mocks out the global logger and provides setup and teardown of the database for tests to use.

It is important that all acceptance tests use the wrapper, because the wrapper makes sure that the service is mocked properly, independently of load order -- Node caches `require()` loads of modules.  As a consequence, all tests share the *same* mocked service, and therefore the *static* configuration of the service cannot be changed from one test to the other.

The no-*service* tests (e.g. `_no-db.js`) are special cases, because what they need to simulate is something that would make all other acceptance tests fail.  So the no-*service* tests cannot be run together with the other tests (or each other), again because of Node caching `require()`, which is why there is both a `test-acceptance` and `test-no-db` script in `package.json`.
