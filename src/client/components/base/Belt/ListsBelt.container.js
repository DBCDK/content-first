import React from 'react';
import withIsVisible from '../../hoc/Scroll/withIsVisible.hoc';
import {withListAggregation} from '../../hoc/Aggregation';
import ListCard from '../../list/card/ListCard.component';
import Title from '../Title';
import T from '../T';
import Slider from './Slider.component';

const skeletonCards = [];
for (let i = 0; i < 20; i++) {
  skeletonCards.push(
    <ListCard skeleton={true} style={{width: '250px'}} key={i} list={{id: i}} />
  );
}

/**
 *
 * withListAggregationHoc
 *
 * @param {string} sort 'num_items' (default) | 'num_follows' | 'num_comments' | '_created' | '_modified'
 * @param {string} pid
 * @return {Array} - returns array of data aggregated lists.
 **/

export class ListsBelt extends React.Component {
  constructor() {
    super();
    this.state = {didSwipe: false};
  }

  render() {
    const startIndex = 8;
    const {didSwipe} = this.state;
    const {lists, isVisible} = this.props;
    const isSkeletonBelt = !isVisible || lists.length === 0;

    return (
      <div className="belt text-left">
        <Title
          Tag="h1"
          type="title4"
          variant="transform-uppercase"
          className="mb-3 mb-md-0 px-2 px-sm-3 px-lg-5 pb-0 pb-sm-3 pt-5"
        >
          <T component="list" name="recentListsTitle" renderAsHtml={true} />
        </Title>
        {isSkeletonBelt ? (
          <Slider>{skeletonCards}</Slider>
        ) : (
          <Slider
            onSwipe={index => {
              if (index > 0 && !didSwipe) {
                this.setState({didSwipe: true});
              }
            }}
          >
            {lists.map((list, i) => {
              const isSkeletonCard = i > startIndex - 1 && !didSwipe;
              return (
                <ListCard
                  key={list._id}
                  skeleton={isSkeletonCard}
                  id={list._id}
                  list={list}
                />
              );
            })}
          </Slider>
        )}
      </div>
    );
  }
}

export default withListAggregation(withIsVisible(ListsBelt));
