import React from 'react';
import {get, some} from 'lodash';
import BookCover from '../../general/BookCover/BookCover.component';
import TaxDescription from '../TaxDescription.component';
import Title from '../../base/Title';
import Text from '../../base/Text';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import T from '../../base/T';
import Tabs from '../../base/Tabs';
import Expand from '../../base/Expand';
import Share from '../../base/Share';
import RemindsOf from '../../base/RemindsOf';
import SkeletonButton from '../../base/Skeleton/Button';
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

const CollectionButton = ({pid, url, type, icon, collectionIsValid}) => {
  return (
    collectionIsValid && (
      <Link
        key={url}
        href={url}
        type={HISTORY_NEW_TAB}
        meta={{materialType: type, pid}}
      >
        <Button
          className="work-preview__collection-button"
          type="quaternary"
          size="medium"
          iconLeft={icon}
        >
          {type}
        </Button>
      </Link>
    )
  );
};

const RenderCollectionButtons = ({isLoading, collection, ...props}) => {
  if (isLoading) {
    return (
      <React.Fragment>
        <SkeletonButton
          className="work-preview__skeleton-button"
          type="tertiary"
          size="medium"
        >
          <Icon name={'language'} />
          <T component="general" name="ebook" />
        </SkeletonButton>
        <SkeletonButton
          className="work-preview__skeleton-button"
          type="tertiary"
          size="medium"
        >
          <Icon name={'voicemail'} />
          <T component="general" name="audiobook" />
        </SkeletonButton>
      </React.Fragment>
    );
  }

  return collection.map(
    col =>
      col.count === 1 && (
        <CollectionButton
          url={col.url}
          type={col.type}
          icon={col.icon}
          {...props}
        />
      )
  );
};

const LoanButton = ({pid, isLoading, collectionIsValid}) => {
  return !isLoading && collectionIsValid ? (
    <OrderButton
      pid={pid}
      size="medium"
      type="quaternary"
      label={T({component: 'general', name: 'book'})}
      iconLeft="chrome_reader_mode"
    />
  ) : (
    <SkeletonButton
      className="work-preview__skeleton-button"
      type="tertiary"
      size="medium"
    >
      <Icon name={'local_library'} />
      <T component="general" name="book" />
    </SkeletonButton>
  );
};

/**
 * WorkPreview
 */

class WorkPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsCollapsed: true
    };
  }

  init() {
    this.setState({tabsCollapsed: true});
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.pid !== prevProps.pid) {
      this.init();
    }
  }

  render() {
    const {
      work,
      className = '',
      dataCy,
      newRelease,
      openSimilarBelt,
      remindsOfClick = openSimilarBelt,
      hasValidCollection,
      filterCollection,
      filterReviews,
      sortTagsByAppeal
    } = this.props;

    // handle collapsible tag container
    const tabsCollapsed = this.state.tabsCollapsed;
    const collapsedClass = tabsCollapsed ? 'collapsed' : '';
    const infoHeight = this.info ? this.info.offsetHeight : 'auto';

    const {book} = work;
    const tax_description =
      book.taxonomy_description || book.taxonomy_description_subjects;

    // get collections including ereolen
    const collection = filterCollection(work);
    // get reviews from litteratursiden
    const reviews = filterReviews(work);

    const appeals = sortTagsByAppeal();

    const priorityTagsArr = book.tags.filter(e => e.score > 1);

    const collectionIsValid = hasValidCollection();

    const lectorReviews =
      work.reviewsHasLoaded && book.reviews.data && book.reviews.data.length > 0
        ? book.reviews.data
        : false;

    return (
      <React.Fragment>
        <div
          className={`work-preview ${className}`}
          ref={preview => (this.refs = {...this.refs, preview})}
        >
          <div className="work-preview__work">
            <Link href={'/værk/' + book.pid}>
              <BookCover
                className="work-preview__work-cover"
                book={book}
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
                  dataCy="bookmarkBtn"
                  size="large"
                />
              </BookCover>
            </Link>

            <div
              className="work-preview__information"
              ref={e => (this.info = e)}
            >
              <Share
                href={'https://laesekompas.dk/værk/' + book.pid}
                title={T({component: 'share', name: 'shareOnFacebook'})}
              >
                <T component="share" name="share" />
              </Share>
              <Title Tag="h1" type="lead">
                <Link href={'/værk/' + book.pid}>{book.title}</Link>
              </Title>
              <Link
                href={'/find?tags=' + encodeURI(book.creator)}
                className="work-preview-book-creator"
              >
                <Title Tag="h2" type="heading">
                  {book.creator}
                </Title>
              </Link>

              <Text
                type="body"
                variant="weight-semibold"
                className="work-preview__information-taxdescription"
              >
                <TaxDescription text={tax_description} />
              </Text>

              <Text
                type="body"
                className="work-preview__information-description"
              >
                {book.description}
              </Text>

              <div className="work-preview__information-details">
                <span className="detail-element">
                  <Text type="micro" variant="color-petroleum">
                    <T component="work" name="pages" />
                  </Text>
                  <Text type="micro" variant="color-petroleum">
                    {book.pages}
                  </Text>
                </span>
                <span className="detail-element">
                  <Text type="micro" variant="color-petroleum">
                    <T component="work" name="language" />
                  </Text>
                  <Text type="micro" variant="color-petroleum">
                    {book.language}
                  </Text>
                </span>
                <span className="detail-element">
                  <Text type="micro" variant="color-petroleum">
                    <T component="work" name="released" />
                  </Text>
                  <Text type="micro" variant="color-petroleum">
                    {book.first_edition_year}
                  </Text>
                </span>
              </div>

              <div className="work-preview__actions">
                <div className="work-preview__action-loan">
                  <Text Tag="h4" type="body" variant="weight-semibold">
                    <T component="work" name="loanTitle" />
                  </Text>
                </div>

                {work.collectionHasLoaded && !collectionIsValid && (
                  <Text type="body" className="detail-no-valid-collection">
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

                <LoanButton
                  pid={book.pid}
                  isLoading={!work.collectionHasLoaded}
                  collectionIsValid={collectionIsValid}
                />

                <RenderCollectionButtons
                  pid={book.pid}
                  collection={collection}
                  isLoading={!work.collectionHasLoaded}
                  collectionIsValid={collectionIsValid}
                />

                <AddToListButton work={work} />
                <RemindsOf onClick={() => remindsOfClick(work)} />
              </div>
            </div>
          </div>

          <div
            className={`work-preview__tabs-wrap ${collapsedClass}`}
            style={{height: tabsCollapsed ? infoHeight : 'auto'}}
          >
            {work.collectionHasLoaded &&
              get(this.swiper, 'height') > infoHeight && (
                <Expand
                  title={T({component: 'general', name: 'showMore'})}
                  onClick={() => {
                    this.setState({
                      tabsCollapsed: false
                    });
                  }}
                />
              )}
            <Tabs
              pages={['Anmeldelser', 'Læseoplevelse']}
              swiper={swiper => (this.swiper = swiper)}
            >
              <div className="tabs tabs-page-1">
                <ReviewList
                  book={book}
                  reviews={reviews}
                  lectorReviews={lectorReviews}
                  maxHeight={400}
                  work={work}
                  showMoreColor="var(--lys-graa)"
                />
              </div>
              <div className="tabs tabs-page-2">
                {appeals.length > 0 ? (
                  <div className="work-preview__tabs-info">
                    <div className="work-preview__tabs-info-color" />
                    <Text type="small">
                      <T component="general" name="particularlyProminent" />
                    </Text>
                  </div>
                ) : (
                  <Text type="body" className="Compare_noTags">
                    <T component="work" name="noAppeals" />
                  </Text>
                )}
                {appeals.map(group => {
                  return (
                    <React.Fragment key={group.title}>
                      <Text type="body" className="work-preview__tag-title">
                        {group.title}
                      </Text>
                      {group.data.map(t => {
                        const matchClass = some(priorityTagsArr, ['id', t.id])
                          ? 'match'
                          : '';

                        return (
                          <Link key={t.id} href="/find" params={{tags: t.id}}>
                            <Button
                              key={t.title}
                              type="tertiary"
                              size="small"
                              className={`work-preview__tag ${matchClass}`}
                              dataCy={'tag-' + t.title}
                            >
                              {t.title}
                            </Button>
                          </Link>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </Tabs>
          </div>
        </div>
        {this.props.hasChildBelt && (
          <div className="work-preview__arrow-container">
            <div className="work-preview__arrow">
              <Icon name="expand_more" className=" md-large" />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withChildBelt(
  withScrollToComponent(
    withWork(WorkPreview, {
      includeTags: true,
      includeReviews: true,
      includeCollection: true
    })
  )
);
