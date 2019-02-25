const over13 = require('../over13');

describe('over13', function() {
  test('age is NOT over 13', () => {
    const result = over13('2412181212');
    expect(result).toBe(false);
  });

  test('age is over 13', () => {
    // year is converted to 2002
    const result = over13('2412021212');

    expect(result).toBe(true);
  });

  test('age is way over 13', () => {
    // year is converted to 1988
    const result = over13('2412881212');
    expect(result).toBe(true);
  });

  test('cpr is misformed', () => {
    // year is converted to 1988
    const result = over13('24128812');
    expect(result).toBe('misformed cpr');
  });
});
