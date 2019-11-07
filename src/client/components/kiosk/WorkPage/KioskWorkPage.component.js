import React from 'react';
import './KioskWorkPage.css';

import Tabs from '../../base/Tabs';

import Title from '../../base/Title';
import SkeletonText from '../../base/Skeleton/Text';
import Icon from '../../base/Icon';
import T from '../../base/T';

import {withWork} from '../../hoc/Work';
import TaxDescription from '../../work/TaxDescription.component';
import Link from '../../general/Link.component';
import Divider from '../../base/Divider';
import BookCover from '../../general/BookCover/BookCover.component';
import Text from '../../base/Text';

import ReviewList from '../../work/Review/ReviewList.component';
import Appeals from '../../work/Appeals/Appeals.component';
import MultiRowContainer from '../../base/Belt/MultiRowContainer';
import {withPidsToPids} from '../../hoc/Recommender';
const Recommendations = withPidsToPids(MultiRowContainer);

const pages = ['Om bogen', 'Anmeldelser', 'Læseoplevelse', 'Minder om'];

export class KioskWorkPage extends React.Component {
  state = {inputFocused: false};
  render() {
    const work = this.props.work || {};
    const book = (work && work.book) || {};
    const collectionHasLoaded = work.collectionHasLoaded;
    const reviews = this.props.filterReviews(work) || [];
    const appeals = this.props.sortTagsByAppeal();
    const lectorReviews =
      work.reviewsHasLoaded && book.reviews.data && book.reviews.data.length > 0
        ? book.reviews.data
        : false;

    const tax_description =
      book.taxonomy_description || book.taxonomy_description_subjects;
    return (
      <div className={`KioskWorkPage `}>
        <div className="top">
          <BookCover pid={this.props.pid} />
          <Title Tag="h1" type="title3" className="book-title">
            {book.title}
          </Title>
          <Link href={'/find?tags=' + encodeURI(book.creator)}>
            <Title Tag="h2" type="title4" className="book-creator">
              {book.creator}
            </Title>
          </Link>
          <Text
            type="body"
            variant="weight-semibold"
            className="taxdescription"
          >
            <TaxDescription text={tax_description} />
          </Text>
          <Divider type="horizontal" variant="thin" />
        </div>

        <div className="bottom">
          <Tabs
            pages={pages}
            onPageChange={this.handlePageChange}
            customSettings={{noSwiping: false}}
          >
            <div className="tab-page narrow-page">
              <Text className="description" type="body">
                {book.description}
              </Text>
              <Text className="info" type="body" variant="weight-semibold">
                <span>{book.pages} sider</span>
                <span>|</span>
                <span>{book.first_edition_year}</span>
                <span>|</span>
                <span>{book.language}</span>
              </Text>

              {collectionHasLoaded ? (
                <div className="book-types">
                  {this.props.collectionContainsBook() && (
                    <div className="type">
                      <Icon name="chrome_reader_mode" />
                      <Text type="body" variant="weight-semibold">
                        BOG
                      </Text>
                    </div>
                  )}
                  {this.props.collectionContainsEBook() && (
                    <div className="type">
                      <Icon name="language" />
                      <Text type="body" variant="weight-semibold">
                        EBOG
                      </Text>
                    </div>
                  )}
                  {this.props.collectionContainsAudioBook() && (
                    <div className="type">
                      <Icon name="headset" />
                      <Text type="body" variant="weight-semibold">
                        LYDBOG
                      </Text>
                    </div>
                  )}
                </div>
              ) : (
                <SkeletonText
                  className="book-types-skeleton Skeleton__Pulse"
                  lines="1"
                />
              )}
            </div>
            <div className="tab-page narrow-page">
              <ReviewList
                className="reviews"
                book={book}
                reviews={reviews}
                lectorReviews={lectorReviews}
                work={work}
                showPaperLinks={false}
              />
            </div>
            <div className="tab-page narrow-page">
              <Appeals book={book} appeals={appeals} />
            </div>
            <div className="tab-page remindsOf">
              <Title
                className="remindsof-header"
                Tag="h1"
                type="title4"
                variant="transform-uppercase"
              >
                <strong>
                  <T component="work" name="remindsOf" />{' '}
                </strong>
                {book.title}
              </Title>
              <Recommendations likes={[this.props.pid]} />
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withWork(KioskWorkPage, {
  includeTags: true,
  includeReviews: true,
  includeCollection: true
});