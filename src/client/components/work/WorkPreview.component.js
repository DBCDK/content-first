import React from 'react';
import BookCover from '../general/BookCover.component';
import TaxDescription from './TaxDescription.component';
import Heading from '../base/Heading';
import Button from '../base/Button';
import Paragraph from '../base/Paragraph';
import Icon from '../base/Icon';
import T from '../base/T';
import SkeletonText from '../base/Skeleton/Text';
import SkeletonUser from '../base/Skeleton/User';
import Link from '../general/Link.component';
import SocialShareButton from '../general/SocialShareButton.component';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import OrderButton from '../order/OrderButton.component';
import {HISTORY_NEW_TAB} from '../../redux/middleware';
import {filterCollection, filterReviews} from './workFunctions';
import withScrollToComponent from '../base/scroll/withScrollToComponent.hoc';
import withWork from '../base/Work/withWork.hoc';
import withChildBelt from '../base/Belt/withChildBelt.hoc';

import './WorkPreview.css';

class WorkPreview extends React.Component {
  render() {
    const {work, dataCy} = this.props;
    const {book} = work;
    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.taxonomy_description_subjects;

    // get collections including ereolen
    const collection = filterCollection(work);
    // get reviews from litteratursiden
    const reviews = filterReviews(work);

    return (
      <React.Fragment>
        <div
          className={'row WorkPreview__container ' + this.props.className}
          ref={preview => (this.refs = {...this.refs, preview})}
        >
          <div className="col-12 col-xl-7 workPreview__work">
            <div className="workPreview__image col-4">
              <Link href={'/værk/' + book.pid}>
                <BookCover book={book} dataCy={dataCy} />
              </Link>
            </div>
            <div className="workPreview__info col-8">
              <SocialShareButton
                className={'ssb-fb'}
                styles={{fontWeight: 'bold'}}
                facebook={true}
                href={'https://laesekompas.dk/værk/' + book.pid}
                hex={'#3b5998'}
                size={30}
                shape="round"
                hoverTitle={T({component: 'share', name: 'shareOnFacebook'})}
              />
              <Heading Tag="h1" type="lead" className="mt0">
                <Link href={'/værk/' + book.pid}>{book.title}</Link>
              </Heading>
              <Link
                href="/find"
                params={{creator: book.creator}}
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
                {work.collectionHasLoaded && (
                  <OrderButton
                    book={book}
                    size="medium"
                    type="quaternary"
                    label={T({component: 'general', name: 'book'})}
                    icon="local_library"
                    className="mr1 mt1"
                  />
                )}
                {work.collectionHasLoaded &&
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
              <div className="row">
                <div className="col-12">
                  <BookmarkButton
                    className="mr1 mt1"
                    origin={T({
                      component: 'work',
                      name: 'bookmarkButtonOrigin'
                    })}
                    work={work}
                  />
                  <AddToListButton className="mr1 mt1" work={work} />
                </div>
              </div>
              <div className="row">
                <div className="col-12 pt2">
                  <Button
                    type="tertiary"
                    size="medium"
                    className="underline"
                    onClick={() => this.props.openSimilarBelt(work)}
                  >
                    <T component="work" name="moreLikeThis" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-0 col-lg-5 workPreview__reviews pt1 pb1">
            <div className="row">
              <div className="col-md-12">
                <Heading Tag="h3" type="title" className="mt0 mb2">
                  <T component="work" name={'reviewsTitle'} />
                </Heading>
              </div>
            </div>
            {work.reviewsHasLoaded &&
              reviews.map(rev => {
                return (
                  <a
                    href={rev.url}
                    target="_blank"
                    className="workPreview__review mb1"
                    key={rev.url}
                  >
                    <Icon name="face" />
                    <span className="workPreview__review__details ml2">
                      <Heading Tag="h5" type="subtitle">
                        <strong>{rev.creator}</strong>
                        <br />
                        {rev.date}
                      </Heading>
                    </span>
                  </a>
                );
              })}
            {!work.reviewsHasLoaded && (
              <React.Fragment>
                <a className="workPreview__review mb1">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
                <a className="workPreview__review mb1">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
                <a className="workPreview__review">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
              </React.Fragment>
            )}
          </div>
        </div>
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
