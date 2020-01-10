import React from 'react';
import {useSelector} from 'react-redux';
import {Helmet} from 'react-helmet';
import {get} from 'lodash';

function buildOGMeta(obj) {
  return Object.keys(obj).map((k, i) => {
    if (obj[k] && typeof obj[k] !== 'object') {
      return (
        <meta key={`${k}-meta-${i}`} property={k} content={obj[k] || null} />
      );
    }
    return false;
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
    'og:url': 'https://laesekompas.dk',
    'og:type': 'website',
    image: {
      'og:image': 'https://laesekompas.dk/img/open-graph/hero-01.jpg',
      'og:image:width': '1200',
      'og:image:height': '675'
    },
    book: {}
  }
}) => {
  // isKiosk
  const isKiosk = useSelector(state => get(state, 'kiosk.enabled', false));

  // hotjar tracking code
  const hotjar_id = isKiosk ? 1636409 : 1361823;

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

      <script>
        {`(function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${hotjar_id},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
      </script>
    </Helmet>
  );
};

export default Head;
