import timeToString, {MINUTE, HOUR, DAY, MONTH, YEAR} from '../timeToString';

describe('timeToString util', () => {
  test('convert years', () => {
    expect(timeToString(Date.now() / 1000 - YEAR)).toEqual('1 år');
    expect(timeToString(Date.now() / 1000 - 2 * YEAR)).toEqual('2 år');
  });
  test('convert months', () => {
    expect(timeToString(Date.now() / 1000 - MONTH)).toEqual('1 måned');
    expect(timeToString(Date.now() / 1000 - 2 * MONTH)).toEqual('2 måneder');
  });
  test('convert days', () => {
    expect(timeToString(Date.now() / 1000 - DAY)).toEqual('1 dag');
    expect(timeToString(Date.now() / 1000 - 2 * DAY)).toEqual('2 dage');
  });
  test('convert hours', () => {
    expect(timeToString(Date.now() / 1000 - 1 * HOUR)).toEqual('1 time');
    expect(timeToString(Date.now() / 1000 - 2 * HOUR)).toEqual('2 timer');
  });
  test('convert minutes', () => {
    expect(timeToString(Date.now() / 1000 - 1 * MINUTE)).toEqual('1 minut');
    expect(timeToString(Date.now() / 1000 - 2 * MINUTE)).toEqual('2 minutter');
  });
  test('convert now', () => {
    expect(timeToString(Date.now() / 1000)).toEqual('Lige nu');
    expect(timeToString(Date.now() / 1000 - 30)).toEqual('Lige nu');
  });
});
