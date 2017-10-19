# Remote services

This system depends on a number of remote services.  All handling of these remote-service connectors live in this directory.

The [main server](../external-server.js) holds an instance of each remote service, and verifies that the remote services are alive.  Therefore each connector need to implement the following interface:

    isOk : () -> Bool
    getCurrentError : () -> String
    getErrorLog : () -> Array of String
    testingConnection : () -> Promise of Bool

The `testingConnection` promise must ensure that `getCurrentError`, `getErrorLog` and `isOk` reflects the of the connection test.
