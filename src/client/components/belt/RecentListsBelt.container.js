import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import ListCard from '../list/card/ListCard.component';
import Heading from '../base/Heading';
import Slider from './Slider.component';
import {fetchRecent} from '../../utils/requestLists';

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
      this.setState({fetched: true, listIds});
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
        <div className="belt text-left mt3 row">
          <div className="p-0 col-12">
            <div className="row header">
              <Heading
                className="inline pr2 pb0 pt0 pb-sm-1 pt-sm-1 ml1 mr1 mb0"
                Tag="h1"
                type="section"
              >
                <strong>Ugens</strong> Lister
              </Heading>
            </div>
            {isSkeletonBelt && (
              <div className=" mb4 mt2">
                <Slider>{skeletonCards}</Slider>
              </div>
            )}
            {!isSkeletonBelt && (
              <div className="row mb4 mt2">
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
                      <ListCard key={_id} skeleton={isSkeletonCard} _id={_id} />
                    );
                  })}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </VisibilitySensor>
    );
  }
}
