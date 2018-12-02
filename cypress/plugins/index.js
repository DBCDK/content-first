// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
//const npmRun = require('npm-run')
const {execSync} = require('child_process');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', (browser = {}, args) => {
    //   console.log(browser, args); // see what all is in here!

    // browser will look something like this
    // {
    //   name: 'chrome',
    //   displayName: 'Chrome',
    //   version: '63.0.3239.108',
    //   path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //   majorVersion: '63'
    // }

    // args are different based on the browser
    // sometimes an array, sometimes an object

    if (browser.name === 'chrome') {
      args.push('--disable-site-isolation-trials');

      // whatever you return here becomes the new args
      return args;
    }
  });

  on('task', {
    resetDB: async () => {
      try {
        await execSync('docker kill content-first_database_1');
      } catch (error) {}
      try {
        await execSync('docker system prune --force ');
        await execSync('docker-compose up -d');
        await execSync('npm run db-migrate');
        await execSync('npm run inject-metakompas');
        return true;
      } catch (error) {
        console.log('errr', error);
        return error;
      }
    }
  });
};
