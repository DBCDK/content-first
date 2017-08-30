# Recommender Feedback development

The [node setup](../setup-node-env.sh) creates symbolic links

    __ -> ../src/lib
    server -> ../src/server

inside `node_modules` such that [our custom libraries](lib/) can used likes this anywhere in the code:

    const config = require('server/config');
    const logger = require('__/logging')(config.logger);

If the links in `node_modules` are not setup properly, you can `npm run postinstall` to re-establish them.
