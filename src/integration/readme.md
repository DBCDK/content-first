# Integration test

Each part of the integration test is in a `_test.js` file.  Each such file creates a connection to the webapp, which is supposed to be up and running together with a test database.  You can start a local, ephemeral database by

    $ docker-compose up -d

and run the server and integration test against it by

    $ npm run full-test

See [`package.json`](../../package.json) and [`docker-compose.yml`](../../docker-compose.yml).
