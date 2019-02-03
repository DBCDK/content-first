import React from 'react';
import {connect} from 'react-redux';
import {BOOKS_REQUEST} from '../../../redux/books.reducer';

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
 * export default withWork(GreatBook, {includeCover: true})
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
    includeCover = false
  }
) => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      this.fetch();
    }
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
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      work: state.booksReducer.books[ownProps.pid]
    };
  };
  const mapDispatchToProps = dispatch => ({
    fetchWork: pid =>
      dispatch({
        type: BOOKS_REQUEST,
        pids: [pid],
        includeTags,
        includeReviews,
        includeCollection,
        includeCover
      })
  });
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withWork;
