# Server

## Database migration

When the server starts, it automatically [migrates the database to the most recent version](index.js).

## Naming conventions

Functions returning [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) are named with an initial verb in present participle, like `validatingInput` to signify that the operation is taken place immediately but will possibly span some time.
