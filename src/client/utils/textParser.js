import AutoLinker from 'autolinker';
import twemoji from 'twemoji';

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function sanitizeHtml(str) {
  return str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag);
}

const autolinker = new AutoLinker({
  phone: false,
  twitter: false,
  hashtag: false
});

/**
 * Parse a text to include links and emojis.
 * @param text {String}
 * @param links {Bool}
 * @returns {String}
 */
export default function textParser(text, links = true, newLines = 'break') {
  console.log('tt', text);

  // Make sure the text is clean when it comes in
  text = sanitizeHtml(text);

  switch (newLines) {
    case 'paragraphs': {
      text = text
        .split(/\r?\n/)
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
      break;
    }
    case 'break': {
      text = text.split(/\r?\n/).join('<br />');
      break;
    }
    default: {
      break;
    }
  }

  // Add links to the text
  if (links) {
    text = autolinker.link(text);
  }

  // Add emojis to the text
  text = twemoji.parse(text, {
    className: 'twemoji'
  });

  return text;
}
