// Sorts a list of tags into appeal categories

// Order tags by:
// 1. “Stemning”: Tags fra Stemning
// 2. “Sprog”: Tags fra Ramme->(Univers, Genre), Fortælleteknik->(fortællerstemme, skrivestil og struktur, tempo)
// 3. “Handling”: tags fra Handling->(Hovedpersoner, Handler om)
// 4. “Tid og sted”: tags fra Ramme->(handlingens tid, tid, sted, fiktivt sted, miljø, genre)

// appel-settings
const appeals = {
  stemning: ['stemning'],
  sprog: [
    'univers',
    'genre',
    'fortællerstemme',
    'skrivestil og struktur',
    'tempo'
  ],
  handling: ['hovedpersoner', 'handler om'],
  'tid og sted': ['handlingens tid', 'tid', 'sted', 'fiktivt sted', 'miljø']
};

export default function sortByAppeal(tags) {
  let result = [];

  if (tags) {
    Object.keys(appeals).forEach(appeal => {
      const subjects = appeals[appeal];
      result[appeal] = {title: appeal, data: []};
      // result[appeal] = [];
      tags.forEach(tag => {
        let group = tag.parents[0].toLowerCase();
        let subject = tag.parents[1].toLowerCase();

        if (subjects.includes(group) || subjects.includes(subject)) {
          result[appeal].data.push(tag);
          // result[appeal].push(tag);
        }
      });
    });

    // Remove appeal keys + empty appeal categories.
    result = Object.values(result).filter(appeal => appeal.data.length !== 0);

    return result;
  }
}
