import React from 'react';
import TaxDescription from './TaxDescription.component';
import Title from '../base/Title';
import Text from '../base/Text';
import Button from '../base/Button';
import Icon from '../base/Icon';
import T from '../base/T';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import Share from '../base/Share';
import RemindsOf from '../base/RemindsOf';
import SimilarBelt from '../base/Belt/SimilarBelt.component';
import BookCover from '../general/BookCover.component';
import OrderButton from '../order/OrderButton.component';
import Link from '../general/Link.component';
import scroll from '../../utils/scroll';
import {HISTORY_NEW_TAB} from '../../redux/middleware';
import {get} from 'lodash';
import {filterCollection, filterReviews, sortTags} from './workFunctions';
import withWork from '../base/Work/withWork.hoc';
import './WorkPage.css';
import ReviewList from './Review/ReviewList.component';

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
      <div>
        <div className="WorkPage__container">
          <div className="container">
            <div className="row mt-0 mt-sm-5">
              <div className="col-12 col-xl-8 WorkPage__work">
                <div className="WorkPage__image">
                  <BookCover book={book} enableLightbox>
                    <BookmarkButton
                      className="icon-large"
                      origin={T({
                        component: 'work',
                        name: 'bookmarkButtonOrigin'
                      })}
                      work={work}
                      rid={this.props.rid}
                      layout="teardrop"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '40px',
                        height: '40px'
                      }}
                      dataCy="bookmarkBtn"
                    />
                  </BookCover>
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
                    href={'/find?tags=' + encodeURI(book.creator)}
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
                        return null;
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
                  <div className="row mt-3">
                    <div className="col-12">
                      <AddToListButton work={work} />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-12">
                      <RemindsOf
                        onClick={() => {
                          const pos = this.booksBeltPosition
                            ? this.booksBeltPosition.offsetTop - 50
                            : 0;
                          scroll(pos);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row WorkPage__tagHeading__Mobile pt2">
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
                        <React.Fragment key={group.title}>
                          <Text
                            type="body"
                            className="WorkPage__tagHeading mb0 mt0"
                          >
                            {group.title + ':'}
                          </Text>
                          {group.data.map(t => {
                            return (
                              <Link
                                key={t.id}
                                href="/find"
                                params={{tags: t.id}}
                              >
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

              <ReviewList
                book={book}
                reviews={reviews}
                lectorReviews={lectorReviews}
                maxHeight={500}
                work={work}
                className="col-12 col-xl-4 WorkPage__reviews mt-xl-0 mb-xl-0 pt-4"
                showMoreColor="white"
              />
            </div>
          </div>

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
                          <Text type="micro" className="mr1" key={col.url}>
                            <Icon name={col.icon} className="md-xsmall" />
                            {' ' + col.type}
                          </Text>
                        );
                      }
                      return null;
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

          {work.detailsHasLoaded &&
            work.tagsHasLoaded && (
              <SimilarBelt
                beltRef={e => (this.booksBeltPosition = e)}
                key={'workpage' + book.pid}
                mount={'workpage' + book.pid}
                likes={[book.pid]}
                style={{background: 'white'}}
                className="mt-xl-5"
              />
            )}
        </div>
      </div>
    );
  }
}

export default withWork(WorkPage, {
  includeTags: true,
  includeReviews: true,
  includeCollection: true
});
