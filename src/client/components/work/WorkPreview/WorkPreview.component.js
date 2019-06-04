import React from 'react';
import BookCover from '../../general/BookCover/BookCover.component';
import TaxDescription from '../TaxDescription.component';
import Heading from '../../base/Heading';
import Text from '../../base/Text';
import Button from '../../base/Button';
import Paragraph from '../../base/Paragraph';
import Icon from '../../base/Icon';
import T from '../../base/T';
import Share from '../../base/Share';
import RemindsOf from '../../base/RemindsOf';
import Link from '../../general/Link.component';
import BookmarkButton from '../../general/BookmarkButton/BookmarkButton';
import AddToListButton from '../../general/AddToListButton/AddToListButton.component';
import OrderButton from '../../order/OrderButton.component';
import {HISTORY_NEW_TAB} from '../../../redux/middleware';
import {withScrollToComponent} from '../../hoc/Scroll';
import {withWork} from '../../hoc/Work';
import ReviewList from '../Review/ReviewList.component';
import {withChildBelt} from '../../hoc/Belt';

import './WorkPreview.css';

/**
 * WorkPreview
 */

class WorkPreview extends React.Component {
  render() {
    const {
      work,
      dataCy,
      newRelease,
      hasValidCollection,
      filterCollection,
      filterReviews
    } = this.props;

    const {book} = work;
    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.taxonomy_description_subjects;

    // get collections including ereolen
    const collection = filterCollection(work);
    // get reviews from litteratursiden
    const reviews = filterReviews(work);

    const lectorReviews =
      work.reviewsHasLoaded &&
      work.book.reviews.data &&
      work.book.reviews.data.length > 0
        ? work.book.reviews.data
        : false;
    return (
      <React.Fragment>
        <div
          className={'row mb-5 WorkPreview__container ' + this.props.className}
          ref={preview => (this.refs = {...this.refs, preview})}
        >
          <div className="col-12 col-xl-7 workPreview__work">
            <div className="workPreview__image col-4">
              <Link href={'/værk/' + book.pid} className="d-block h-100">
                <BookCover
                  book={book}
                  styles={{
                    background: 'transparent',
                    textAlign: 'center'
                  }}
                  dataCy={dataCy}
                >
                  <BookmarkButton
                    className="icon-large"
                    origin={T({
                      component: 'work',
                      name: 'bookmarkButtonOrigin'
                    })}
                    work={work}
                    rid={this.props.rid}
                    layout="circle"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0
                    }}
                    dataCy="bookmarkBtn"
                    size="large"
                  />
                </BookCover>
              </Link>
            </div>
            <div className="workPreview__info col-8">
              <Share
                className="d-inline ssb-fb"
                href={'https://laesekompas.dk/værk/' + book.pid}
                title={T({component: 'share', name: 'shareOnFacebook'})}
              >
                Del
              </Share>
              <Heading Tag="h1" type="lead" className="mt0">
                <Link href={'/værk/' + book.pid}>{book.title}</Link>
              </Heading>
              <Link
                href={'/find?tags=' + encodeURI(book.creator)}
                className="work-preview-book-creator"
              >
                <Heading Tag="h2" type="heading" className="mt1">
                  {book.creator}
                </Heading>
              </Link>

              <Paragraph className="mt1">
                <strong>
                  <TaxDescription text={tax_description} />
                </strong>
              </Paragraph>

              <Paragraph className="mt1">{book.description}</Paragraph>

              <div className="workPreview__details">
                <span>
                  <T component="work" name="pages" />
                  {book.pages}
                </span>
                <span>
                  <T component="work" name="language" />
                  {book.language}
                </span>
                <span>
                  <T component="work" name="released" />
                  {book.first_edition_year}
                </span>
              </div>

              <div className="row">
                <div className="col-12 pt1">
                  <Heading
                    Tag="h4"
                    type="subtitle"
                    className="mt1 mb0 kobber-txt"
                  >
                    <T component="work" name="loanTitle" />
                  </Heading>
                </div>
              </div>
              <div className="workPreview__media">
                {work.collectionHasLoaded &&
                  !hasValidCollection() && (
                    <Text type="body" className="mr1">
                      <T
                        component="work"
                        name={
                          newRelease()
                            ? 'noValidCollectionYet'
                            : 'noValidCollection'
                        }
                      />
                    </Text>
                  )}
                {work.collectionHasLoaded &&
                  hasValidCollection() && (
                    <OrderButton
                      pid={book.pid}
                      size="medium"
                      type="quaternary"
                      label={T({component: 'general', name: 'book'})}
                      icon="chrome_reader_mode"
                      className="mr1 mt1"
                    />
                  )}
                {work.collectionHasLoaded &&
                  hasValidCollection() &&
                  collection.map(col => {
                    if (col.count === 1) {
                      return (
                        <Link
                          key={col.url}
                          href={col.url}
                          type={HISTORY_NEW_TAB}
                          meta={{materialType: col.type, pid: book.pid}}
                        >
                          <Button
                            type="quaternary"
                            size="medium"
                            className="mr1 mt1"
                          >
                            <Icon name={col.icon} />
                            {col.type}
                          </Button>
                        </Link>
                      );
                    }
                    return '';
                  })}
                {!work.collectionHasLoaded && (
                  <React.Fragment>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="workPreview__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'local_library'} />
                        <T component="general" name="book" />
                      </Button>
                    </a>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="workPreview__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'alternate_email'} />
                        <T component="general" name="ebook" />
                      </Button>
                    </a>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="workPreview__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'voicemail'} />
                        <T component="general" name="audiobook" />
                      </Button>
                    </a>
                  </React.Fragment>
                )}
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <AddToListButton work={work} />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <RemindsOf onClick={() => this.props.openSimilarBelt(work)} />
                </div>
              </div>
            </div>
          </div>

          <ReviewList
            book={book}
            reviews={reviews}
            lectorReviews={lectorReviews}
            maxHeight={400}
            work={work}
            className="col-md-0 col-lg-5 workPreview__reviews pb-1 "
            showMoreColor="var(--lys-graa)"
          />
        </div>
        {this.props.hasChildBelt && (
          <div className="col-12 col-xl-7 workPreview__arrow-container">
            <div className="workPreview__arrow workPreview__image col-4">
              <Icon
                name="expand_more"
                className=" md-large"
                onClick={() => this.props.openSimilarBelt(work)}
              />
            </div>
            <div className=" col-md-0 col-lg-5 workPreview__reviews pb-1 " />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withChildBelt(
  withScrollToComponent(
    withWork(WorkPreview, {
      includeReviews: true,
      includeCollection: true
    })
  )
);
