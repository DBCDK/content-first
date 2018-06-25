import React from 'react';
import {connect} from 'react-redux';
import BooksBelt from './BooksBelt.container';
import {BOOKS_REQUEST} from "../../redux/books.reducer";

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

const weightedResults = arr => {
  let weightedArray = [];
  let array_elements = arr;

  array_elements.sort();

  let current = null;
  let cnt = 0;
  for (let i = 0; i < array_elements.length; i++) {
    if (array_elements[i] !== current) {
      if (cnt > 0 && current > 0) {
        weightedArray.push({id: current, weight: cnt});
      }
      current = array_elements[i];
      cnt = 1;
    } else {
      cnt++;
    }
  }
  if (cnt > 0 && current > 0) {
    weightedArray.push({id: current, weight: cnt});
  }

  // sorting the array by heaviest weight
  let sortedArray = sortByKey(weightedArray, 'weight').reverse();

  // keeping only the top 10 tags
  while (sortedArray.length > 10) {
    sortedArray.pop();
  }

  return sortedArray;
};

const sortByKey = (array, key) => {
  return array.sort(function(a, b) {
    let x = a[key];
    let y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

const mapStateToProps = state => {
  const recoPids= state.interactionReducer.interactions.map(o => {
    return o.pid;
  });
  const books=recoPids.map(pid=>(state.booksReducer.books[pid])).filter(work=>(work && work.book && work.book.tags))
  const tags=[]
  books.forEach(work=>{
    work.book.tags.forEach(tag=>(tags.push(tag.id)))
  })

  const weightedTags=weightedResults(tags)

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
    }),
});


export default connect(mapStateToProps, mapDispatchToProps)(
  RecommendationsBelt
);
