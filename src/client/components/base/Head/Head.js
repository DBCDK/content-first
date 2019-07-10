import React from 'react';
import {Helmet} from 'react-helmet';

function buildOGMeta(obj) {
  return Object.keys(obj).map((k, i) => {
    if (obj[k] && typeof obj[k] !== 'object') {
      return (
        <meta key={`${k}-meta-${i}`} property={k} content={obj[k] || null} />
      );
    }
  });
}

/**

  Example template

  <Head
    title='...'
    description='...'
    canonical='/subpage'
    robots = 'all',
    og={{
      'og:url': 'https://laesekompas.dk/værk/...',
      'og:type': 'book',
      image: {
        'og:image': '...',
        'og:image:width': 'x..',
        'og:image:height': 'y..'
      },
      book: {
        'book:author': '...',
        'book:isbn': '...',
        'book:release_date': '...',
        'book:tag:': '..., ..., ...'
      }
    }}
  />

*/

const Head = ({
  title = 'Læsekompas',
  canonical = '',
  description = 'På Læsekompasset kan du gå på opdagelse i skønlitteraturen, få personlige anbefalinger og dele dine oplevelser med andre.',
  robots = 'all',
  og = {
    'og:url': `https://laesekompas.dk/`,
    'og:site_name': 'Læsekompas',
    'og:type': 'website',
    image: {
      'og:image': 'http://laesekompas.dk/img/open-graph/hero-01.jpg',
      'og:image:width': '1200',
      'og:image:height': '675'
    },
    book: {}
  }
}) => {
  return (
    <Helmet>
      <title>{title === 'Læsekompas' ? title : `${title} | Læsekompas`}</title>
      <link rel="canonical" href={`https://laesekompas.dk${canonical}`} />
      <meta name="robots" content={robots} />
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      {(og && buildOGMeta(og)) || null}
      {(og && og.image && buildOGMeta(og.image)) || null}
      {(og && og.book && buildOGMeta(og.book)) || null}
    </Helmet>
  );
};

export default Head;
