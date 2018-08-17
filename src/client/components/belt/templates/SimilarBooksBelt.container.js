import React from 'react';
import {connect} from 'react-redux';
import BooksBelt from './BooksBelt.container';
import {BOOKS_REQUEST} from '../../../redux/books.reducer';
import {get} from 'lodash';

export class SimilarBooksBelt extends React.Component {
  componentDidMount() {
    this.props.fetchWork(this.props.pid);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pid !== this.props.pid) {
      this.props.fetchWork(this.props.pid);
    }
  }

  render() {
    return (
      <BooksBelt {...this.props} excluded={[this.props.pid]} showTags={false} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tags: (get(state.booksReducer.books[ownProps.pid], 'book.tags') || []).map(
      tagObject => ({id: tagObject.id, weight: tagObject.sort})
    )
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchWork: pid =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: [pid],
      includeTags: true
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimilarBooksBelt);
