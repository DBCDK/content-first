import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import ListCard from '../../list/card/ListCard.component';
import Title from '../Title';
import T from '../T';
import Slider from './Slider.component';
import {fetchRecent} from '../../../utils/requestLists';
import {difference} from 'lodash';

const skeletonCards = [];
for (let i = 0; i < 20; i++) {
  skeletonCards.push(
    <ListCard skeleton={true} style={{width: '250px'}} key={i} list={{id: i}} />
  );
}

export default class RecentListsBelt extends React.Component {
  constructor() {
    super();
    this.state = {didSwipe: false, visible: false, fetched: false, listIds: []};
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
      nextState.visible !== this.state.visible ||
      nextState.listIds !== this.state.listIds
    );
  }
  onVisibilityChange = visible => {
    if (visible) {
      this.setState({visible});
    }
  };

  fetch = async () => {
    if (this.state.visible && !this.state.fetched) {
      const listIds = await fetchRecent();

      // Temporary solution for hiding specific lists
      // For instance some "book cases"
      const filtered = difference(listIds, [
        'a2d7b450-c7ba-11e8-a4c7-c500cfdf0018',
        'd5205150-a5ec-11e8-bc7e-f12e3c5c9eaa'
      ]);

      this.setState({fetched: true, listIds: filtered});
    }
  };

  render() {
    const startIndex = 8;
    const {listIds, didSwipe} = this.state;
    const isSkeletonBelt = listIds.length === 0;
    return (
      <VisibilitySensor
        onChange={this.onVisibilityChange}
        partialVisibility={true}
      >
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
              {listIds.map((_id, i) => {
                const isSkeletonCard = i > startIndex - 1 && !didSwipe;
                return (
                  <ListCard key={_id} skeleton={isSkeletonCard} id={_id} />
                );
              })}
            </Slider>
          )}
        </div>
      </VisibilitySensor>
    );
  }
}
