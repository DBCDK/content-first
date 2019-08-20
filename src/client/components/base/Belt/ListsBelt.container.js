import React from 'react';
import {connect} from 'react-redux';
import withIsVisible from '../../hoc/Scroll/withIsVisible.hoc';
import {withListAggregation} from '../../hoc/Aggregation';
import ListCard from '../../list/card/ListCard.component';
import Title from '../Title';
import Slider from './Slider.component';

/**
 *
 * ListsBelt
 *
 * @param {string} sort 'num_items' (default) | 'num_follows' | 'num_comments' | '_created' | '_modified'
 * @param {string} title - belt title
 * @param {int} limit - limit results
 * @param {string} pid - lists containing specific pid
 * @return {Component}
 **/

export class ListsBelt extends React.Component {
  constructor() {
    super();
    this.state = {didSwipe: false};
  }

  render() {
    const startIndex = 8;
    const {didSwipe} = this.state;
    const {
      pid,
      lists,
      title = 'Title....',
      isFetching,
      hasFetched,
      isVisible
    } = this.props;

    if (lists.length === 0) {
      return null;
    }

    return (
      <div className="belt text-left">
        <Title
          Tag="h1"
          type="title4"
          variant="transform-uppercase"
          className="mb-3 mb-md-0 px-2 px-sm-3 px-lg-5 pb-0 pb-sm-3 pt-5"
        >
          {title}
        </Title>
        <Slider
          onSwipe={index => {
            if (index > 0 && !didSwipe) {
              this.setState({didSwipe: true});
            }
          }}
        >
          {lists.map((list, i) => {
            const isSkeletonCard = i > startIndex - 1 && !didSwipe;
            return <ListCard key={list._id} id={list._id} list={list} />;
          })}
        </Slider>
      </div>
    );
  }
}

export const mapStateToProps = (state, ownProps) => ({
  lists: state.listReducer.lists
});

export default connect(mapStateToProps)(
  withIsVisible(withListAggregation(ListsBelt))
);
