/**
 * Split a line into lines, each at least minLineLength long, and at most maxLineLength long
 *
 * @param line
 * @param maxLineLength
 * @param maxLines
 * @returns {Array}
 */
export default function splitLine(line, maxLineLength, maxLines = 6) {
  const minLineLength = maxLineLength / 2;
  const words = line.split(' ');
  let w = '';
  const lines = [];
  for (let i = 0; i < words.length; i++) {
    if (w.length + words[i].length < maxLineLength) {
      w = (w + ' ' + words[i]).trim();
    } else {
      /* eslint-disable no-lonely-if */
      if (w.length >= minLineLength) {
        lines.push(w + ' ');
        w = words[i];
      } else {
        w = (w + ' ' + words[i]).trim();
        while (w.length > maxLineLength) {
          w = breakLine(w, maxLineLength, lines);
        }
      }
    }
    if (lines.length === maxLines) {
      const lastLine = lines[maxLines - 1];
      const end =
        lastLine.length > maxLineLength - 3
          ? maxLineLength - 3
          : lastLine.length;
      lines[maxLines - 1] = lastLine.substr(0, end) + '...';
      break;
    }
  }
  while (w.length > maxLineLength && lines.length < maxLines) {
    w = breakLine(w, maxLineLength, lines);
  }
  if (w.length && lines.length < maxLines) {
    lines.push(w);
  }
  return lines;
}

const breakLine = (line, maxLineLength, lines) => {
  const spl = line.length > maxLineLength + 3 ? maxLineLength : line.length - 3;
  lines.push(line.substr(0, spl) + '-');
  return line.substr(spl);
};
