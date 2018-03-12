import textParser from '../textParser';

describe('timeToString util', () => {
  test('escapes html', () => {
    expect(textParser('<h1>Some title</h1>')).toEqual(
      '&lt;h1&gt;Some title&lt;/h1&gt;'
    );
    expect(textParser('<script>alert("alert");</script>')).toEqual(
      '&lt;script&gt;alert("alert");&lt;/script&gt;'
    );
  });
  test('convert emoji', () => {
    expect(textParser('❤️')).toEqual(
      '<img class="twemoji" draggable="false" alt="❤" src="https://twemoji.maxcdn.com/2/72x72/2764.png"/>️'
    );
  });
  test('convert link', () => {
    expect(textParser('content-first.dbc.dk️')).toEqual(
      '<a href="http://content-first.dbc.dk" target="_blank" rel="noopener noreferrer">content-first.dbc.dk</a>️'
    );
  });
});
