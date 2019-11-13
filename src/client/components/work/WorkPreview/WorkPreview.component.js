import React from 'react';
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
import Appeals from '../Appeals/Appeals.component';
import {withChildBelt} from '../../hoc/Belt';

import {trackEvent} from '../../../matomo';

import './WorkPreview.css';

const PrioTag = ({id, title}) => {
  return (
    <Link href="/find" params={{tags: id}}>
      <Button
        key={title}
        type="tertiary"
        size="small"
        className="prio-tag"
        dataCy={'tag-' + title}
      >
        {title}
      </Button>
    </Link>
  );
};

const RenderPrioTags = ({tags, onClick}) => {
  return (
    <div className="work-preview__prio-tags">
      {tags.map(group => (
        <React.Fragment key={group.title}>
          <Text type="body" className="prio-tags-title">
            {group.title}
          </Text>
          {group.data.map(t => (
            <PrioTag key={t.title} id={t.id} title={t.title} />
          ))}
        </React.Fragment>
      ))}
      <Button
        size="medium"
        type="tertiary"
        className="work-preview__show-full-exp underline"
        dataCy="tags-collaps-toggle"
        onClick={onClick}
      >
        <T component="work" name={'tagsCollapsibleShow'} />
      </Button>
    </div>
  );
};

const CollectionButton = ({pid, url, type, icon}) => {
  return (
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
  );
};

const RenderCollectionButtons = ({
  isLoading,
  collection,
  collectionIsValid,
  ...props
}) => {
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
      col.count === 1 &&
      collectionIsValid && (
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
    this.swiper.slideTo(0, 0);
  }

  componentDidMount() {
    this.init();
    this.swiper.slideTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pid !== prevProps.pid) {
      this.init();
    }
  }

  render() {
    const {
      work,
      hideAppels = false,
      className = '',
      dataCy,
      newRelease,
      openSimilarBelt,
      remindsOfClick = openSimilarBelt,
      hasValidCollection,
      filterCollection,
      filterReviews,
      sortTags,
      sortTagsByAppeal,
      enableLightbox = false
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

    const tags = sortTags();

    const appeals = sortTagsByAppeal();

    const priorityTagsArr = book.tags.filter(e => e.score > 1);

    const collectionIsValid = hasValidCollection();

    const lectorReviews =
      work.reviewsHasLoaded && book.reviews.data && book.reviews.data.length > 0
        ? book.reviews.data
        : false;

    const stemningTags = tags.filter(e => e.title === 'stemning')[0];

    const prioTags = [];
    if (priorityTagsArr.length > 0) {
      prioTags.unshift({
        title: T({component: 'work', name: 'readerExpTitle'}),
        data: priorityTagsArr
      });
    } else if (stemningTags) {
      prioTags.unshift({
        title: T({component: 'work', name: 'readerExpTitle'}),
        data: stemningTags.data.slice(0, 6)
      });
    }

    return (
      <React.Fragment>
        <div
          className={`work-preview ${className}`}
          ref={preview => (this.refs = {...this.refs, preview})}
        >
          <div className="work-preview__work">
            <Link
              className="work-preview__cover-link"
              href={'/værk/' + book.pid}
            >
              <BookCover
                pid={book.pid}
                className="work-preview__cover"
                enableLightbox={enableLightbox}
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
              <Title Tag="h1" type="title3" className="work-preview__title">
                <Link href={'/værk/' + book.pid}>{book.title}</Link>
              </Title>
              <Link href={'/find?tags=' + encodeURI(book.creator)}>
                <Title Tag="h2" type="title5" className="work-preview__creator">
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
                  <Text
                    type="micro"
                    data-cy={'pages-count'}
                    variant="color-petroleum"
                  >
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
                  <Text type="body" variant="weight-semibold">
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
                <div className="work-preview__add-to-list--wrap">
                  <AddToListButton
                    className="work-preview__add-to-list"
                    work={work}
                  />
                </div>
                <RemindsOf onClick={() => remindsOfClick(work)} />
                {!hideAppels && appeals.length > 0 && (
                  <RenderPrioTags
                    tags={prioTags}
                    onClick={() => {
                      trackEvent('tags', 'seeAllTags', book.title);
                      this.swiper.slideTo(1, 400);
                      this.setState({
                        tabsCollapsed: false
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            className={`work-preview__tabs-wrap ${collapsedClass}`}
            style={{height: tabsCollapsed ? infoHeight : 'auto'}}
            data-cy="work-preview-tabs"
          >
            {this.state.currentTabHeight + 100 > infoHeight && (
              <Expand
                title={T({component: 'general', name: 'showMore'})}
                onClick={() =>
                  this.setState({
                    tabsCollapsed: false
                  })
                }
              />
            )}
            <Tabs
              pages={['Anmeldelser', 'Læseoplevelse']}
              swiper={swiper => (this.swiper = swiper)}
              onUpdate={({height}) => this.setState({currentTabHeight: height})}
            >
              <div className="tabs tabs-page-1" data-cy="tabs-page-Anmeldelser">
                <ReviewList
                  book={book}
                  reviews={reviews}
                  lectorReviews={lectorReviews}
                  work={work}
                />
              </div>
              <div
                className="tabs tabs-page-2"
                data-cy="tabs-page-Læseoplevelse"
              >
                <Appeals book={book} appeals={appeals} />
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
