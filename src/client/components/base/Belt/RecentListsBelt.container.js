import React from 'react';
import withIsVisible from '../../hoc/Scroll/withIsVisible.hoc';
import ListCard from '../../list/card/ListCard.component';
import Title from '../Title';
import T from '../T';
import Slider from './Slider.component';
import {fetchRecent} from '../../../utils/requestLists';

const skeletonCards = [];
for (let i = 0; i < 20; i++) {
  skeletonCards.push(
    <ListCard skeleton={true} style={{width: '250px'}} key={i} list={{id: i}} />
  );
}

export class RecentListsBelt extends React.Component {
  constructor() {
    super();
    this.state = {didSwipe: false, fetched: false, lists: []};
  }
  componentDidMount() {
    this.fetch();
  }
  componentDidUpdate() {
    this.fetch();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.didSwipe !== this.state.didSwipe ||
      nextProps.profiles !== this.props.profiles ||
      nextProps.isVisible !== this.props.isVisible ||
      nextState.lists !== this.state.lists
    );
  }

  fetch = async () => {
    if (this.props.isVisible && !this.state.fetched) {
      let lists = await fetchRecent();

      // Temporary solution for hiding specific lists
      // For instance some "book cases"
      lists = lists.filter(
        list =>
          list._id !== 'a2d7b450-c7ba-11e8-a4c7-c500cfdf0018' &&
          list._id !== 'd5205150-a5ec-11e8-bc7e-f12e3c5c9eaa'
      );

      this.setState({fetched: true, lists});
    }
  };

  render() {
    const startIndex = 8;
    const {lists, didSwipe} = this.state;
    const isSkeletonBelt = lists.length === 0;

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

export default withIsVisible(RecentListsBelt);
