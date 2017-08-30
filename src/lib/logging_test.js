'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');

// The first subject under test is a logger that pretty-prints everything.
const sut1 = require('__/logging')({
  environment: 'developement',
  level: 'TRACE',
  pretty: 1,
  hostname: 'localhost'
});

// The second subject under test is a logger that do not pretty-print and only
// lets errors through.
const sut2 = require('__/logging')({
  environment: 'developement',
  level: 'ERROR',
  pretty: 1,
  hostname: 'localhost'
});

describe('logging', () => {
  it('should throw Error when setInfo is called without any args', () => {
    assert.throws(sut1.setInfo, Error);
  });

  it('should throw Error when setInfo is called with array args', () => {
    const func = () => {
      sut1.setInfo([]);
    };
    assert.throws(func, Error);
  });

  it('should throw Error when setInfo is called with non-object args', () => {
    const func = () => {
      sut1.setInfo('string');
    };
    assert.throws(func, Error);
  });

  it('should not throw when given an object as argument', () => {
    const func = () => {
      sut1.setInfo({test: 'hest'});
    };
    assert.doesNotThrow(func, Error);
  });

  it('should set info field when argument is accepted', () => {
    sut1.setInfo({test: 'hest'});
    const stub = sinon.stub(console, 'log');
    sut1.log.log('info', 'test message');

    stub.restore();
    assert.isTrue(stub.args.toString().includes('"test":"hest"'), 'Values set in setInfo method is present in log output');
  });

  it('should log a message on the INFO level', () => {
    const stub = sinon.stub(console, 'log');
    const logMsg = 'this is a log message ';
    const level = 'INFO';
    sut1.log.log('info', logMsg);

    stub.restore();
    const args = JSON.parse(stub.args);
    assert.equal(args.msg, logMsg);
    assert.equal(args.level, level);
  });

  it('should log without a message', () => {
    const stub = sinon.stub(console, 'log');
    const level = 'INFO';
    sut1.log.log('info');

    stub.restore();
    const args = JSON.parse(stub.args);
    assert.equal(args.level, level);
  });

  it('should log a message on each of the levels specified', () => {
    const levels = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
    levels.forEach((level) => {
      const stub = sinon.stub(console, 'log');
      const logMsg = `this is an ${level} message`;
      const method = level.toLowerCase();
      sut1.log[method](logMsg);

      stub.restore();
      const args = JSON.parse(stub.args);
      assert.equal(args.msg, logMsg);
      assert.equal(args.level, level, `Log statement with ${level} was found`);
    });
  });

  it('should ignore lower level messages', () => {
    const stub = sinon.stub(console, 'log');
    sut2.log.warn('this is a warning');

    stub.restore();
    sinon.assert.notCalled(stub);
  });

  it('should be able to not prettify', () => {
    const stub = sinon.stub(console, 'log');
    sut2.log.error({one: 'two', three: 4});

    const args = stub.args;
    stub.restore();
    assert.equal(args.length, 1);
    assert.equal(args[0].indexOf('\n'), -1);
  });

});
