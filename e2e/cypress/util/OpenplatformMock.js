export default class OPMock {
  init = ({record, cy}) => {
    cy.on('window:before:load', window => {
      window.__stubbed_openplatform__ = this;
    });
    this.name = `${Cypress.mocha
      .getRunner()
      .suite.ctx.currentTest.title.replace(/ /g, '')
      .toLowerCase()}`;
    this.record = record;
    this.recorded = {};
    this.cy = cy;
    this.load();
  };
  done = () => {
    this.store();
  };
  setName = name => {
    this.name = name;
  };
  libraries = async arg => {
    return await this.invoke('_libraries', arg);
  };
  order = async arg => {
    return await this.invoke('_order', arg);
  };
  work = async arg => {
    return await this.invoke('_work', arg);
  };
  // connect = async arg => {
  //   return await this.invoke('_connect', arg);
  // };
  // connected = async arg => {
  //   return await this.invoke('_connected', arg);
  // };
  availability = async arg => {
    return await this.invoke('_availability', arg);
  };
  infomedia = async arg => {
    return await this.invoke('_infomedia', arg);
  };
  user = async arg => {
    return await this.invoke('_user', arg);
  };
  invoke = async (funcName, arg) => {
    const recorded = this.getRecorded(funcName, arg);

    if (recorded) {
      await this._wait(recorded.timing);
      Cypress.log({
        name: 'Mock.play',
        message: `openplatform.${funcName}`,
        consoleProps: () => {
          return {
            request: arg,
            response: recorded.data,
            throws: recorded.throws,
            timing: recorded.timing
          };
        }
      });
      if (recorded.throws) {
        throw new Error('Mock throws');
      }
      return recorded.data;
    }
    const t0 = performance.now();
    try {
      const res = await this[funcName](arg);
      this.putRecord(funcName, arg, res, Math.floor(performance.now() - t0));
      return res;
    } catch (e) {
      Cypress.log({
        name: 'Mock.err',
        message: `openplatform.${funcName}`,
        consoleProps: () => {
          return {
            request: arg,
            error: e,
            timing: Math.floor(performance.now() - t0)
          };
        }
      });
      throw e;
    }
  };
  getRecorded = (funcName, req) => {
    const copy = {...req};
    delete copy.access_token;
    return this.recorded[funcName + '_' + JSON.stringify(copy)];
  };
  putRecord = (funcName, req, res, timing) => {
    if (this.record) {
      const copy = req ? {...req} : {};
      delete copy.access_token;
      this.recorded[funcName + '_' + JSON.stringify(copy)] = {
        data: res,
        timing
      };
      Cypress.log({
        name: 'Mock.rec',
        message: `openplatform.${funcName}`,
        consoleProps: () => {
          return {
            request: req,
            response: res,
            timing
          };
        }
      });
    } else {
      Cypress.log({
        name: 'Mock.pass',
        message: `openplatform.${funcName}`,
        consoleProps: () => {
          return {
            request: req,
            response: res,
            timing
          };
        }
      });
    }
  };
  store = () => {
    if (this.record) {
      this.cy
        .writeFile(
          `cypress/fixtures/${Cypress.mocha
            .getRunner()
            .suite.title.replace(/ /g, '')
            .toLowerCase()}/${this.name}.mock.json`,
          JSON.stringify(this.recorded, null, 2)
        )
        .then(() => {
          this.cy.wait(5000);
          this.store();
        });
    }
  };
  load = () => {
    this.cy
      .task(
        'readFileMaybe',
        `cypress/fixtures/${Cypress.mocha
          .getRunner()
          .suite.title.replace(/ /g, '')
          .toLowerCase()}/${this.name}.mock.json`
      )
      .then(textOrNull => {
        if (textOrNull) {
          this.recorded = JSON.parse(textOrNull);
        }
      });
  };
}
