import React from 'react';
import {connect} from 'react-redux';
import BooksBelt from './BooksBelt.container';
import {BOOKS_REQUEST} from '../../../redux/books.reducer';
import _ from 'lodash';

const maxNumberOfTags = 10;

export class InteractionsRecoBelt extends React.Component {
  constructor() {
    super();
    this.state = {loadTags: true};
  }

  componentDidUpdate() {
    const recoPids = this.getRecoPids();

    if (recoPids.length > 0 && this.state.loadTags) {
      this.props.fetchWorks(recoPids);
      this.setState({loadTags: false});
    }
  }

  getRecoPids() {
    return this.props.interactions.map(o => {
      return o.pid;
    });
  }

  getWeightedTags() {
    const recoPids = this.getRecoPids();

    const books = recoPids
      .map(pid => this.props.books[pid])
      .filter(work => work && work.book && work.book.tags);

    const tags = [];
    books.forEach(work => {
      work.book.tags.forEach(tag => tags.push(tag.id));
    });

    return weightedAndSorted(tags);
  }

  render() {
    const weightedTags = this.getWeightedTags();
    if (weightedTags.length > 0 && this.props.username) {
      return (
        <BooksBelt
          {...this.props}
          name={'Bedste forslag til ' + this.props.username}
          tags={weightedTags}
        />
      );
    }
    return null;
  }
}

const weightedAndSorted = arr => {
  let arrayOfObjects = arr.map(item => {
    return {
      id: item,
      weight: 1
    };
  });

  return _(arrayOfObjects)
    .groupBy('id')
    .map((objs, key) => ({
      id: key,
      weight: _.sumBy(objs, 'weight')
    }))
    .orderBy(['weight'], ['desc'])
    .value()
    .slice(0, maxNumberOfTags);
};

const mapStateToProps = state => {
  return {
    books: state.booksReducer.books,
    interactions: state.interactionReducer.interactions,
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
  InteractionsRecoBelt
);
