import React from 'react';
import {connect} from 'react-redux';
import TaxDescription from './TaxDescription.component';
import Title from '../base/Title';
import Text from '../base/Text';
import Button from '../base/Button';
import Icon from '../base/Icon';
import T from '../base/T';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import SkeletonText from '../base/Skeleton/Text';
import SkeletonUser from '../base/Skeleton/User';
import Share from '../base/Share';
import BeltFacade from '../belt/BeltFacade.component';
import BookCover from '../general/BookCover.component';
import OrderButton from '../order/OrderButton.component';
import Link from '../general/Link.component';
import scroll from '../../utils/scroll';
import {ADD_BELT} from '../../redux/belts.reducer';
import {HISTORY_NEW_TAB} from '../../redux/middleware';
import {get} from 'lodash';
import {filterCollection, filterReviews, sortTags} from './workFunctions';
import withWork from '../base/Work/withWork.hoc';
import './WorkPage.css';
import ReviewList from './ReviewList.component';

/**
 * WorkPage
 */
class WorkPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagsCollapsed: true, transition: true, addToList: null};
  }

  init() {
    this.setState({tagsCollapsed: true, transition: false});
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.pid !== prevProps.pid) {
      this.init();
    }
  }

  /**
   * addNewBelt
   * @param belt
   */
  addNewBelt(belt) {
    this.props.addBelt(belt);
  }

  render() {
    const work = get(this.props, 'work');
    const book = get(this.props, 'work.book');

    if (!book) {
      return null;
    }

    // get collections including ereolen
    const collection = filterCollection(work);
    // get reviews from litteratursiden
    const reviews = filterReviews(work);
    // sort tags by group
    const tags = sortTags(work);

    // build belt for "mere som denne" button
    const belts = this.props.beltsState;
    const belt = belts['Minder om ' + book.title];

    if (book.title && !belts['Minder om ' + book.title]) {
      // TODO this should not be in render
      // probably, this component shouldnt be responsible for dispatching this action
      this.addNewBelt({
        name: T({component: 'belts', name: 'remindsOf', vars: [book.title]}),
        key: 'Minder om ' + book.title,
        pid: book.pid,
        onFrontPage: false,
        type: 'belt',
        child: false
      });
    }

    // tags collapsable variables
    const tagsDomNode = document.getElementById('collapsable-tags');
    const height = tagsDomNode ? tagsDomNode.scrollHeight : 0;

    const tax_description =
      book.taxonomy_description || book.taxonomy_description_subjects || '';
    const lectorReviews =
      work.reviewsHasLoaded &&
      work.book.reviews.data &&
      work.book.reviews.data.length > 0
        ? work.book.reviews.data
        : false;

    return (
      <div className="container">
        <div className="row WorkPage__container">
          <div className="col-12 col-xl-8 WorkPage__work">
            <div className="WorkPage__image">
              <BookCover book={book} enableLightbox />
              <BookmarkButton
                className="d-inline-block d-sm-none mr1"
                origin={T({component: 'work', name: 'bookmarkButtonOrigin'})}
                work={work}
                layout="circle"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: 0,
                  borderRadius: '50%'
                }}
              />
            </div>
            <div className="WorkPage__info">
              <Share
                className="ssb-fb align-self-center"
                href={'https://laesekompas.dk/værk/' + book.pid}
                title={T({component: 'share', name: 'shareOnFacebook'})}
              >
                Del
              </Share>

              <Title Tag="h3" type="title3" className="mt0">
                {book.title}
              </Title>
              <Link
                href="/find"
                params={{creator: book.creator}}
                className="work-page-book-creator"
              >
                <Title Tag="h2" type="title5" className="mt1">
                  {book.creator}
                </Title>
              </Link>

              <Text type="body" variant="weight-semibold" className="mt1">
                {<TaxDescription text={tax_description} />}
              </Text>

              <Text type="body" className="mt1">
                {book.description}
              </Text>

              <div className="WorkPage__details WorkPage__detailsDesktop">
                <Text
                  data-cy={'pages-count'}
                  data-value={book.pages}
                  type="micro"
                >
                  <T component="work" name="pages" /> {book.pages}
                </Text>
                <Text type="micro">
                  <T component="work" name="language" /> {book.language}
                </Text>
                <Text type="micro">
                  <T component="work" name="released" />
                  {book.first_edition_year}
                </Text>
              </div>

              <div className="row">
                <div className="col-12 pt1">
                  <Text
                    type="body"
                    variant="weight-semibold"
                    className="mt1 mb0"
                  >
                    <T component="work" name="loanTitle" />
                  </Text>
                </div>
              </div>

              <div className="WorkPage__media">
                {work.collectionHasLoaded && (
                  <OrderButton
                    book={book}
                    size="medium"
                    type="quaternary"
                    icon="book"
                    label={T({component: 'general', name: 'book'})}
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
                        className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'book'} />
                        <T component="general" name="book" />
                      </Button>
                    </a>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'alternate_email'} />
                        <T component="general" name="ebook" />
                      </Button>
                    </a>
                    <a>
                      <Button
                        type="tertiary"
                        size="medium"
                        className="WorkPage__media__skeleton Skeleton__Pulse mr1 mt1"
                      >
                        <Icon name={'voicemail'} />
                        <T component="general" name="audiobook" />
                      </Button>
                    </a>
                  </React.Fragment>
                )}
              </div>
              <div className="row">
                <div className="col-12 mt1">
                  <BookmarkButton
                    className="mr1"
                    origin={T({
                      component: 'work',
                      name: 'bookmarkButtonOrigin'
                    })}
                    work={work}
                  />
                  <AddToListButton className="mr1 pt1" work={work} />
                </div>
              </div>
              <div className="row">
                <div className="col-12 pt2">
                  <Button
                    type="tertiary"
                    size="medium"
                    className="underline"
                    onClick={() => {
                      const pos = this.booksBeltPosition
                        ? this.booksBeltPosition.offsetTop - 50
                        : 0;
                      scroll(pos);
                    }}
                  >
                    <T component="work" name="moreLikeThis" />
                  </Button>
                </div>
              </div>

              <div className="row WorkPage__tagHeading__Mobile">
                <div className="col-md-12">
                  <Text
                    type="body"
                    variant="weight-semibold"
                    className="mt3 mb0"
                  >
                    <T component="work" name="bookSpecsTitle" />
                  </Text>
                </div>
              </div>

              <div
                id="collapsable-tags"
                style={{
                  transition: this.state.transition ? null : 'none',
                  height: this.state.tagsCollapsed ? '65px' : height + 'px',
                  overflowY: 'hidden'
                }}
                className="row col-12 mt1 WorkPage__tagContainer text-left"
              >
                {tags.map(group => {
                  return (
                    <React.Fragment>
                      <Text
                        key={group.title}
                        type="body"
                        className="WorkPage__tagHeading mb0 mt0"
                      >
                        {group.title + ':'}
                      </Text>
                      {group.data.map(t => {
                        return (
                          <Link key={t.id} href="/find" params={{tags: t.id}}>
                            <Button
                              key={t.title}
                              type="tertiary"
                              size="small"
                              className="WorkPage__tag mr1"
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
              <div className="row">
                <div className="mt1 col-12">
                  <Button
                    size="medium"
                    type="tertiary"
                    className="underline"
                    dataCy="tags-collaps-toggle"
                    onClick={() => {
                      this.setState({
                        tagsCollapsed: !this.state.tagsCollapsed,
                        transition: true
                      });
                    }}
                  >
                    <T
                      component="work"
                      name={
                        this.state.tagsCollapsed
                          ? 'tagsCollapsibleShow'
                          : 'tagsCollapsibleHide'
                      }
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-4 WorkPage__reviews mt-5 mb-5 mt-xl-0 mb-xl-0">
            <div className="row">
              <div className="col-md-12">
                <Title Tag="h5" type="title5" className="mt3 mb2">
                  <T component="work" name={'reviewsTitle'} />
                </Title>
              </div>
            </div>

            {work.reviewsHasLoaded &&
              reviews.map(rev => {
                return (
                  <a
                    href={rev.url}
                    target="_blank"
                    className="WorkPage__review mb1"
                  >
                    <Icon name="face" />
                    <span className="WorkPage__review__details ml2">
                      <Text
                        type="body"
                        variant="weight-semibold"
                        className="mb0"
                      >
                        {rev.creator}
                      </Text>
                      <Text type="body">{rev.date}</Text>
                    </span>
                  </a>
                );
              })}
            {!work.reviewsHasLoaded && (
              <React.Fragment>
                <a className="WorkPage__review mb1">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
                <a className="WorkPage__review mb1">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
                <a className="WorkPage__review">
                  <SkeletonUser pulse={true} className="mr1" />
                  <SkeletonText
                    lines={2}
                    color="#e9eaeb"
                    className="Skeleton__Pulse"
                  />
                </a>
              </React.Fragment>
            )}
            <ReviewList book={book} reviews={lectorReviews} />
          </div>
          {work.detailsHasLoaded &&
            work.tagsHasLoaded && (
              <div
                className="WorkPage__beltContainer col-12 mt4"
                ref={e => (this.booksBeltPosition = e)}
              >
                <BeltFacade belt={belt} />
              </div>
            )}

          <div className="row col-12 mb2 WorkPage__detailsMobile">
            <div className="col-12">
              <Text type="body" variant="weight-semibold" className="mt1">
                <T component="work" name="infoTitle" />
              </Text>
            </div>
            <div className="col-12">
              <div className="WorkPage__details">
                <Text type="micro">
                  <T component="work" name="pages" /> {book.pages}
                </Text>
                <Text type="micro">
                  <T component="work" name="language" /> {book.language}
                </Text>
                <Text type="micro">
                  <T component="work" name="released" />{' '}
                  {book.first_edition_year}
                </Text>
              </div>
            </div>
            <div className="col-12">
              <div className="WorkPage__formats mt1">
                <Text type="body" variant="weight-semibold" className="mt1">
                  <T component="work" name="formatTitle" />
                </Text>
                <div className="row col-12">
                  {work.collectionHasLoaded && (
                    <Text type="micro" className="mr1">
                      <Icon name={'book'} className="md-xsmall" />{' '}
                      <T component="general" name="book" />
                    </Text>
                  )}
                  {work.collectionHasLoaded &&
                    collection.map(col => {
                      if (col.count === 1) {
                        return (
                          <Text type="micro" className="mr1">
                            <Icon name={col.icon} className="md-xsmall" />
                            {' ' + col.type}
                          </Text>
                        );
                      }
                    })}
                  {!work.collectionHasLoaded && (
                    <React.Fragment>
                      <Text
                        type="micro"
                        className="WorkPage__formats__skeleton Skeleton__Pulse mr1"
                      >
                        <Icon name={'book'} /> Bog
                      </Text>
                      <Text
                        type="micro"
                        className="WorkPage__formats__skeleton Skeleton__Pulse mr1"
                      >
                        <Icon name={'alternate_email'} /> EBog
                      </Text>
                      <Text
                        type="micro"
                        className="WorkPage__formats__skeleton Skeleton__Pulse mr1"
                      >
                        <Icon name={'voicemail'} /> Lydbog
                      </Text>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns {{beltsState: *}}
 */
const mapStateToProps = state => {
  return {
    beltsState: state.beltsReducer.belts
  };
};

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns {{addBelt: addBelt}}
 */
export const mapDispatchToProps = dispatch => ({
  addBelt: belt => {
    dispatch({
      type: ADD_BELT,
      belt
    });
  }
});

/**
 * connect
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withWork(WorkPage, {
    includeTags: true,
    includeReviews: true,
    includeCollection: true
  })
);
