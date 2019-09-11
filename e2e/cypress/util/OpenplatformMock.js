export default class OPMock {
  init = ({record, cy}) => {
    cy.on('window:before:load', window => {
      window.__stubbed_openplatform__ = this;
    });
    this.name = `order.${Cypress.mocha
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
    return await this.call('_libraries', arg);
  };
  order = async arg => {
    return await this.call('_order', arg);
  };
  work = async arg => {
    return await this.call('_work', arg);
  };
  // connect = async arg => {
  //   return await this.call('_connect', arg);
  // };
  // connected = async arg => {
  //   return await this.call('_connected', arg);
  // };
  availability = async arg => {
    return await this.call('_availability', arg);
  };
  infomedia = async arg => {
    return await this.call('_infomedia', arg);
  };
  user = async arg => {
    return await this.call('_user', arg);
  };
  call = async (funcName, arg) => {
    const recorded = this.getRecorded(funcName, arg);
    if (recorded) {
      console.log('Use recording', {funcName, arg, recorded});
      await this._wait(recorded.timing);
      return recorded.data;
    }
    const t0 = performance.now();
    const res = await this[funcName](arg);
    console.log('Recording not found', {funcName, arg, res});
    this.putRecord(funcName, arg, res, Math.floor(performance.now() - t0));
    return res;
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
    }
  };
  store = () => {
    if (this.record) {
      this.cy
        .writeFile(
          `cypress/fixtures/${this.name}.mock.json`,
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
      .task('readFileMaybe', `cypress/fixtures/${this.name}.mock.json`)
      .then(textOrNull => {
        if (textOrNull) {
          this.recorded = JSON.parse(textOrNull);
        }
      });
  };
}
