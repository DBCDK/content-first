import React from 'react';
import {get} from 'lodash';
import Head from '../../base/Head';
import TaxDescription from '../TaxDescription.component';
import Title from '../../base/Title';
import Text from '../../base/Text';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import T from '../../base/T';
import BookmarkButton from '../../general/BookmarkButton/BookmarkButton';
import AddToListButton from '../../general/AddToListButton/AddToListButton.component';
import Share from '../../base/Share';
import RemindsOf from '../../base/RemindsOf';
import SimilarBelt from '../../base/Belt/SimilarBelt.component';
import BookCover from '../../general/BookCover/BookCover.component';
import OrderButton from '../../order/OrderButton.component';
import Link from '../../general/Link.component';
import scroll from '../../../utils/scroll';
import {withWork} from '../../hoc/Work';
import ReviewList from '../Review/ReviewList.component';

import {HISTORY_NEW_TAB} from '../../../redux/middleware';

import './WorkPage.css';
import {trackEvent} from '../../../matomo';

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

  /* eslint-disable complexity */

  render() {
    const work = get(this.props, 'work');
    const book = get(this.props, 'work.book');

    if (!book) {
      return null;
    }

    // get collections including ereolen
    const collection = this.props.filterCollection(work);
    // get reviews from litteratursiden
    const reviews = this.props.filterReviews(work);
    // sort tags by group
    const tags = this.props.sortTags(work);

    const priorityTagsArr = book.tags.filter(e => e.score > 1);
    if (priorityTagsArr.length > 0) {
      tags.unshift({
        title: T({component: 'work', name: 'readerExpTitle'}),
        data: priorityTagsArr
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

    const isbn =
      book.identifierISBN || (book.identifierISBN && book.identifierISBN[0]);

    return (
      <div>
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
                    className="book-creator-name"
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
                    {work.collectionHasLoaded &&
                      !this.props.hasValidCollection() && (
                        <Text type="body" className="mr1">
                          <T
                            component="work"
                            name={
                              this.props.newRelease()
                                ? 'noValidCollectionYet'
                                : 'noValidCollection'
                            }
                          />
                        </Text>
                      )}
                    {work.collectionHasLoaded &&
                      this.props.hasValidCollection() && (
                        <OrderButton
                          pid={book.pid}
                          size="medium"
                          type="quaternary"
                          icon="chrome_reader_mode"
                          label={T({component: 'general', name: 'book'})}
                          className="mr1 mt1"
                        />
                      )}
                    {work.collectionHasLoaded &&
                      this.props.hasValidCollection() &&
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
                            <Icon name={'language'} />
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
                  <div className="row mt-3">
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
                            {group.title}
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
                          trackEvent('tags', 'seeAllTags', book.title);
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
                  <T component="work" name="released" />
                  {book.first_edition_year}
                </Text>
              </div>
            </div>
          </div>

          {work.detailsHasLoaded && work.tagsHasLoaded && (
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
  /* eslint-enable complexity */
}

export default withWork(WorkPage, {
  includeTags: true,
  includeReviews: true,
  includeCollection: true
});
