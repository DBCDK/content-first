export function filterCollection(work) {
  if (work.collectionHasLoaded) {
    if (work.book.collection.data.length > 0) {
      // remove all refs not containing ereolen
      let collection = work.book.collection.data.filter(col => {
        if (col.identifierURI && col.identifierURI[0].includes('ereolen.dk')) {
          return col;
        }
      });
      // if collection contains references
      if (collection.length > 0) {
        let count1 = 0;
        let count2 = 0;
        collection = collection.map(col => {
          // default obj for Lydbog
          if (col.type[0].includes('Lydbog (net)')) {
            count1++;
            return {
              type: 'Lydbog',
              icon: 'voicemail',
              url: col.identifierURI[0],
              count: count1
            };
          }
          // default obj for Ebog
          if (col.type[0].includes('Ebog')) {
            count2++;
            return {
              type: 'Ebog',
              icon: 'alternate_email',
              url: col.identifierURI[0],
              count: count2
            };
          }
        });
      }
      return collection;
    }
  }
  return [];
}

export function filterReviews(work) {
  if (work.reviewsHasLoaded) {
    if (work.book.reviews.data.length > 0) {
      // remove all refs not containing litteratursiden
      let reviews = work.book.reviews.data.filter(rev => {
        if (
          rev.identifierURI &&
          rev.identifierURI[0].includes('litteratursiden.dk')
        ) {
          return rev;
        }
      });
      // if reviews contains references
      if (reviews.length > 0) {
        reviews = reviews.map(rev => {
          // default obj for a review
          return {
            creator:
              (rev.creator0th && rev.creator0th[0]) ||
              (rev.isPartOf && rev.isPartOf[0]) ||
              'Anmelder, Literatursiden.dk',
            media: (rev.isPartOf && rev.isPartOf[0]) || 'anmeldelse',
            date: (rev.date && rev.date[0]) || '',
            url: rev.identifierURI[0]
          };
        });
      }
      return reviews;
    }
  }
  return [];
}

export function sortTags(work) {
  const book = work.book;
  let tags = {};

  if (book.tags) {
    book.tags.forEach(t => {
      let groupName = t.parents[0] === 'stemning' ? t.parents[0] : t.parents[1];
      if (!tags[groupName]) {
        tags[groupName] = [];
      }
      tags[groupName].push(t);
    });
  }
  tags = Object.keys(tags).map(key => {
    return {title: key, data: tags[key]};
  });
  tags.sort((group1, group2) => (group1.title < group2.title ? -1 : 1));

  return tags;
}

export function buildSimilarBooksBelt(work) {
  const book = work.book;
  return {
    name: 'Minder om ' + book.title,
    pid: book.pid,
    onFrontPage: false
  };
}
