# Remote services

All generic remote services live in this directory.  Each should be a class that gets configured via its constructor at creation time, like

    const config = require('server/config');
    const Mailer = require('__/services/exim');
    const mailer = new Mailer(config.mail);

The main server holds an instance of each remote service, and verifies that the remote services are alive.  Therefore each connector need to implement the following interface:

    isOk : () -> Bool
    getCurrentError : () -> String
    getErrorLog : () -> Array of String
    testingConnection : () -> Promise of Bool
    getName : () -> String

The `testingConnection` promise must ensure that `getCurrentError`, `getErrorLog` and `isOk` reflect the state of the connection test.
