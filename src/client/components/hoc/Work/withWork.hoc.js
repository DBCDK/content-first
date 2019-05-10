import React from 'react';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {BOOKS_REQUEST} from '../../../redux/books.reducer';
import {ORDER} from '../../../redux/order.reducer';
import {getYear} from '../../../utils/dateTimeFormat';
import {
  collectionHasValidContent,
  collectionContainsBook,
  filterCollection,
  filterReviews,
  sortTags
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
  {includeTags = false, includeReviews = false, includeCollection = false} = {}
) => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      this.fetch();
    }

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
     * @param {object} work work which collection to check.
     * @returns {bool} work has a type book associated (true/false)
     */
    collectionContainsBook = () => {
      if (!this.props.work) {
        return false;
      }
      return collectionContainsBook(this.props.work);
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

    fetch() {
      if (
        (this.props.isVisible || typeof this.props.isVisible === 'undefined') &&
        this.fetched !== this.props.pid
      ) {
        this.fetched = this.props.pid;
        this.props.fetchWork(this.props.pid);
      }
    }

    render() {
      return (
        <WrappedComponent
          newRelease={this.newRelease}
          hasValidCollection={this.collectionHasValidContent}
          collectionContainsBook={this.collectionContainsBook}
          filterCollection={this.filterCollection}
          filterReviews={this.filterReviews}
          sortTags={this.sortTags}
          order={this.order}
          {...this.props}
        />
      );
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      work: state.booksReducer.books[ownProps.pid],
      orderState:
        (state.orderReducer.orders[ownProps.pid] &&
          state.orderReducer.orders[ownProps.pid].orderState) ||
        'not ordered'
    };
  };
  const mapDispatchToProps = dispatch => {
    return {
      fetchWork: pid =>
        dispatch({
          type: BOOKS_REQUEST,
          pids: [pid],
          includeTags,
          includeReviews,
          includeCollection
        }),
      dispatchOrder: work => {
        dispatch({type: ORDER, book: work.book});
      }
    };
  };
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withWork;