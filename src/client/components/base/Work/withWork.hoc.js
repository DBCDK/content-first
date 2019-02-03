import React from 'react';
import {connect} from 'react-redux';
import {BOOKS_REQUEST} from '../../../redux/books.reducer';

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
