import React from 'react';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {BOOKS_REQUEST} from '../../../redux/books.reducer';
import {ORDER} from '../../../redux/order.reducer';
import {getYear} from '../../../utils/dateTimeFormat';
import sortByAppeal from '../../../utils/sortByAppeal';
import intersectTags from '../../../utils/intersectTags';
import {
  collectionHasValidContent,
  collectionContainsBook,
  collectionContainsEBook,
  collectionContainsAudioBook,
  filterCollection,
  filterReviews,
  sortTags,
  isPhysical,
  getVolumeFromType
} from '../../work/workFunctions';

/**
 * A HOC that makes the enhanced component take a pid as input prop, download
 * the corresponding work, and then mapping the work as prop.
 *
 * @param {React.Component} WrappedComponent The component to be enhanced
 * @param {object} params Specifies what work metadata to download
 * @returns {React.Component} The enhanced component
 *
 * @example
 * // create a pure component and enhance it
 * const GreatBook = ({work}) => <div>{work.book.title} is a great book</div>;
 * export default withWork(GreatBook, {includeTags: true})
 *
 * // use the enhanced component like this
 * <GreatBook pid={'870970-basis:123456'}/>
 *
 * // the work may be lazy-loaded using the isVisible prop.
 * // if isVisible=false, the work is not downloaded until isVisible=true
 * <GreatBook pid={'870970-basis:123456'} isVisible={false}/>
 */

const withWork = (
  WrappedComponent,
  {
    includeTags = false,
    includeReviews = false,
    includeCollection = false,
    includeSeries = false
  } = {}
) => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      this.fetch();
    }

    /**
     * Returns info about the physical book that
     * represents this work. Useful when an ebook-pid is used
     * to look up the work.
     * @returns {Object}
     */
    getPhysical = () => {
      const collection = get(this.props, 'work.book.collection');
      const series = get(this.props, 'work.book.series');
      let extent = 0;
      let volumeId = 0;
      if (!collection || !series) {
        return false;
      }

      // find the highest volumeId
      collection.data.forEach(entry => {
        extent = Math.max(extent, getVolumeFromType(entry.type) || 0);
      });
      let physical;
      if (isPhysical(this.props.work.book.type)) {
        volumeId = getVolumeFromType(this.props.work.book.type);
        physical = {volumeId, extent, pid: this.props.work.book.pid};
      } else {
        // find physical book with smallest volumeId
        collection.data.forEach(entry => {
          const currentVolumeId = getVolumeFromType(entry.type);
          if (
            currentVolumeId &&
            (!physical || physical.volumeId > currentVolumeId)
          ) {
            volumeId = currentVolumeId;
            physical = {volumeId: currentVolumeId, extent, pid: entry.pid[0]};
          }
        });
      }

      if (series.isMultiVolumeSeries && physical) {
        // this work is a multi volume, yes...
        // But it's converted to a series,
        // hence we delete volumeId and extent
        delete physical.extent;
        delete physical.volumeId;
      }

      return physical;
    };

    /**
     * Check if a work is a newly release
     * @param {string} first_edition_year First release year of the book
     * @returns {bool} Newly release value (true/false)
     */
    newRelease = () => {
      if (!get(this.props, 'work.book.first_edition_year')) {
        return false;
      }

      return getYear() === Number(this.props.work.book.first_edition_year);
    };

    /**
     * Check if collection has any valid work associated
     * @param {object} work work which collection to check.
     * @returns {bool} work has one ore more valid collection items (true/false)
     */
    collectionHasValidContent = () => {
      if (!this.props.work) {
        return false;
      }
      return collectionHasValidContent(this.props.work);
    };

    /**
     * Check if a collection contains a type "Bog" || "Bog (bind x)"
     * @returns {bool} work has a type book associated (true/false)
     */
    collectionContainsBook = () => {
      if (!this.props.work) {
        return false;
      }
      return collectionContainsBook(this.props.work);
    };

    /**
     * Check if a collection contains a type "Ebog"
     * @returns {bool} work has a type book associated (true/false)
     */
    collectionContainsEBook = () => {
      if (!this.props.work) {
        return false;
      }
      return collectionContainsEBook(this.props.work);
    };

    /**
     * Check if a collection contains a type "Lydbog"
     * @returns {bool} work has a type book associated (true/false)
     */
    collectionContainsAudioBook = () => {
      if (!this.props.work) {
        return false;
      }
      return collectionContainsAudioBook(this.props.work);
    };

    /**
     * Filter accessible collection (eBooks/audiobooks)
     * @param {object} work work which collection to filter.
     * @returns {Array} Filtered collection
     */
    filterCollection = () => {
      if (!this.props.work) {
        return false;
      }
      return filterCollection(this.props.work);
    };

    /**
     * Filter accessible reviews
     * @param {object} work work with reviews to filter.
     * @returns {Array} Filtered reviews
     */
    filterReviews = () => {
      if (!this.props.work) {
        return false;
      }
      return filterReviews(this.props.work);
    };

    /**
     * Filter accessible reviews
     * @param {object} work work with reviews to filter.
     * @returns {Array} Filtered reviews
     */
    sortTags = () => {
      if (!this.props.work) {
        return false;
      }
      return sortTags(this.props.work);
    };

    /**
     * Check if current book is ordered (!OBS: resets on page refresh)
     * @param {object} work work which order state to check.
     * @returns {String} State of the order
     * Order states: 'not ordered' || 'ordering' || 'ordered' || 'error'
     */
    order = () => {
      if (!this.props.work) {
        return false;
      }
      return this.props.dispatchOrder(this.props.work);
    };

    /**
     * Sort function which sort the common tag list into appeal categories.
     * @param {object} work work with tags to sort.
     * @returns {Array} Filtered reviews
     */

    sortTagsByAppeal = (work = this.props.work) => {
      if (!work || !work.book || !work.book.tags) {
        return false;
      }

      return sortByAppeal(work.book.tags);
    };

    intersectTags = () => {
      if (!this.props.works) {
        return false;
      }
      return intersectTags(this.props.works);
    };

    fetch() {
      const {isVisible, fetchWork, pid, pids} = this.props;
      if (
        (isVisible || typeof isVisible === 'undefined') &&
        (this.fetched !== pid || this.fetchedPids !== pids)
      ) {
        const pidsToSelect = pids ? pids : [pid];
        this.fetched = pid;
        this.fetchedPids = pids;
        fetchWork(pidsToSelect);
      }
    }

    render() {
      return (
        <WrappedComponent
          order={this.order}
          newRelease={this.newRelease}
          hasValidCollection={this.collectionHasValidContent}
          collectionContainsBook={this.collectionContainsBook}
          collectionContainsEBook={this.collectionContainsEBook}
          collectionContainsAudioBook={this.collectionContainsAudioBook}
          filterCollection={this.filterCollection}
          filterReviews={this.filterReviews}
          sortTags={this.sortTags}
          sortTagsByAppeal={this.sortTagsByAppeal}
          intersectTags={this.intersectTags}
          getPhysical={this.getPhysical}
          {...this.props}
        />
      );
    }
  };

  const mapStateToProps = (state, ownProps) => {
    // Single
    let work = null;
    if (ownProps.pid) {
      work = state.booksReducer.books[ownProps.pid];
    }

    // Multiple
    let works = null;
    if (ownProps.pids) {
      works = ownProps.pids.map(pid => state.booksReducer.books[pid]);
    }

    return {
      work,
      works,
      orderState:
        (state.orderReducer.orders[ownProps.pid] &&
          state.orderReducer.orders[ownProps.pid].orderState) ||
        'not ordered'
    };
  };
  const mapDispatchToProps = dispatch => {
    return {
      fetchWork: pids =>
        dispatch({
          type: BOOKS_REQUEST,
          pids,
          includeTags,
          includeReviews,
          includeCollection,
          includeSeries
        }),
      dispatchOrder: work => {
        dispatch({type: ORDER, book: work.book});
      }
    };
  };
  return connect(mapStateToProps, mapDispatchToProps)(Wrapped);
};

export default withWork;
