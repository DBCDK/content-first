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

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', (browser = {}, launchOptions = {}) => {
    console.log(browser, launchOptions); // see what all is in here!

    // browser will look something like this
    // {
    //   name: 'chrome',
    //   displayName: 'Chrome',
    //   version: '63.0.3239.108',
    //   path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //   majorVersion: '63'
    // }

    // launchOptions.args are different based on the browser
    // sometimes an array, sometimes an object

    if (browser.name === 'chrome') {
      if (!launchOptions.args.includes()) {
        launchOptions.args.push('--disable-site-isolation-trials');
      }
    }

    return launchOptions;
  });

  on('task', {
    readFileMaybe(filename) {
      const fs = require('fs');
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf8');
      }

      return null;
    },
    writeFile({path, content}) {
      const fs = require('fs');
      fs.writeFileSync(path, content);
      return null;
    }
  });
};
