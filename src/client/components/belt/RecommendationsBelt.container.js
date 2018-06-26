import React from 'react';
import {connect} from 'react-redux';
import BooksBelt from './BooksBelt.container';
import {BOOKS_REQUEST} from '../../redux/books.reducer';
import _ from 'lodash';

export class RecommendationsBelt extends React.Component {
  constructor() {
    super();
    this.state = {loadTags: true};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.recoPids.length > 0 && this.state.loadTags) {
      this.props.fetchWorks(nextProps.recoPids);
      this.setState({loadTags: false});
    }
  }

  render() {
    if (this.props.tagIds.length > 0 && this.props.username) {
      return (
        <div>
          <BooksBelt
            title={'Bedste forslag til ' + this.props.username}
            tags={this.props.tagIds}
          />
        </div>
      );
    }
    return null;
  }
}

const weightedAndSorted = arr => {
  let arrayOfObjects= arr.map(item => {
    return {
      'id': item,
      'weight': 1
    }
  })

  return _(arrayOfObjects)
    .groupBy('id')
    .map((objs, key) => ({
      'id': key,
      'weight': _.sumBy(objs, 'weight') }))
    .orderBy(['weight'],['desc'])
    .value()
    .slice(0,9)
};


const mapStateToProps = state => {
  const recoPids = state.interactionReducer.interactions.map(o => {
    return o.pid;
  });
  const books = recoPids
    .map(pid => state.booksReducer.books[pid])
    .filter(work => work && work.book && work.book.tags);
  const tags = [];
  books.forEach(work => {
    work.book.tags.forEach(tag => tags.push(tag.id));
  });

  const weightedTags = weightedAndSorted(tags);

  return {
    recoPids,
    tagIds: weightedTags,
    username: state.userReducer.name
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchWorks: pids =>
    dispatch({
      type: BOOKS_REQUEST,
      pids: pids,
      includeTags: true
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(
  RecommendationsBelt
);
