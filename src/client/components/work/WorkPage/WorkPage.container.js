import React from 'react';
import {get} from 'lodash';
import Head from '../../base/Head';
import T from '../../base/T';
import SimilarBelt from '../../base/Belt/SimilarBelt.component';
import {withWork} from '../../hoc/Work';
import ListsBelt from '../../base/Belt/ListsBelt.container';
import WorkPreview from '../WorkPreview/WorkPreview.component.js';

import './WorkPage.css';
import Kiosk from '../../base/Kiosk/Kiosk';

/**
 * WorkPage
 */

class WorkPage extends React.Component {
  /* eslint-disable complexity */

  render() {
    const book = get(this.props, 'work.book');

    if (!book) {
      return null;
    }

    let a_tag_weight;
    if (document.location.href.split(/[?|&]a_tag_weight/)[1]) {
      a_tag_weight = parseFloat(
        document.location.href.split(/[?|&]a_tag_weight/)[1].split('=')[1]
      );
    }

    let c_tag_weight;
    if (document.location.href.split(/[?|&]c_tag_weight/)[1]) {
      c_tag_weight = parseFloat(
        document.location.href.split(/[?|&]c_tag_weight/)[1].split('=')[1]
      );
    }

    // Taxonomy description for <Head> component
    const tax_description =
      book.taxonomy_description || book.taxonomy_description_subjects;

    // ISBN number for <Head> component
    const isbn =
      book.identifierISBN || (book.identifierISBN && book.identifierISBN[0]);

    return (
      <React.Fragment>
        <div className="work-page">
          <Head
            title={
              book.title && book.creator
                ? `${book.title} af ${book.creator}`
                : 'Læsekompas'
            }
            description={book.description || tax_description}
            canonical={`/værk/${book.pid}`}
            og={{
              'og:url': `https://laesekompas.dk/værk/${book.pid}`,
              'og:type': 'book',
              image: {
                'og:image': book.coverUrl,
                'og:image:width': '300',
                'og:image:height': '600'
              },
              book: {
                'book:author': book.creator,
                'book:isbn': isbn || null,
                'book:release_date': book.first_edition_year || null,
                'book:tag:': book.taxonomy_description_subjects
              }
            }}
          />

          <Kiosk
            render={({kiosk}) => {
              return (
                <WorkPreview
                  className="white"
                  agencyId={
                    kiosk.enabled && kiosk.configuration
                      ? kiosk.configuration.agencyId
                      : ''
                  }
                  branch={
                    kiosk.enabled && kiosk.configuration
                      ? kiosk.configuration.branch
                      : ''
                  }
                  pid={book.pid}
                  enableLightbox={true}
                  dataCy="workpreviewCard"
                  is_work_page={true}
                />
              );
            }}
          />
        </div>

        <SimilarBelt
          beltRef={e => (this.booksBeltPosition = e)}
          key={'workpage' + book.pid}
          mount={'workpage' + book.pid}
          likes={[book.pid]}
          a_tag_weight={a_tag_weight}
          c_tag_weight={c_tag_weight}
        />

        <ListsBelt
          pid={book.pid}
          mount={'aggregation-lists-' + book.pid}
          title={
            <span>
              <strong>{T({component: 'work', name: 'listBeltTitle'})}</strong>
              {' ' + book.title}
            </span>
          }
          sort="created"
          limit={50}
        />
      </React.Fragment>
    );
  }

  /* eslint-enable complexity */
}

export default withWork(WorkPage, {
  includeTags: true,
  includeReviews: true,
  includeCollection: true
});
