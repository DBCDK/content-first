import {getItem, setItem} from '../localstorage';

describe('localstorage', () => {

  test('retrieves stored entry, when version matches', () => {
    setItem('somekey', {
      foo: 'bar'
    }, 1);

    expect(getItem('somekey', 1, {some: 'fallback object'})).toMatchSnapshot();
  });

  test('retrieve fallback object, when version does not match stored entry', () => {
    setItem('somekey', {
      foo: 'bar'
    }, 1);

    expect(getItem('somekey', 2, {some: 'fallback object'})).toMatchSnapshot();
  });

  test('retrieve fallback object, when there is no entry with given key', () => {
    expect(getItem('somekey', 2, {some: 'fallback object'})).toMatchSnapshot();
  });
});
