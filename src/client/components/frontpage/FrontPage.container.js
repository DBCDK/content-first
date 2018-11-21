import React from 'react';
import {connect} from 'react-redux';
import Hero from '../hero/Hero.component';
import Spot from '../hero/Spot.component';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import BookcaseItem from '../bookcase/BookcaseItem.component';
import BooksBelt from '../belt/BooksBelt.component';
import SpotsContainer from '../spots/Spots.container';

class FrontPage extends React.Component {
  renderBelts(belts) {
    return (
      <div className="container">
        <div className="belts col-12 ">
          {belts.filter(belt => belt.onFrontPage).map(belt => (
            <BooksBelt key={belt.name} belt={belt} />
          ))}
        </div>
      </div>
    );
  }

  render() {
    const beltsMap = this.props.beltsMap;
    const aBeltsMap = Object.values(beltsMap);

    return (
      <div className="frontpage">
        <Hero />
        <Spot />
        <SpotsContainer />
        {this.renderBelts(aBeltsMap.slice(0, 8))}
        <BookcaseItem id={'a2d7b450-c7ba-11e8-a4c7-c500cfdf0018'} />
        {this.renderBelts(aBeltsMap.slice(8, aBeltsMap.length))}
        <div className="container">
          <div className="belts col-12 ">
            <RecentListsBelt />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    beltsMap: state.beltsReducer.belts
  };
};

export default connect(mapStateToProps)(FrontPage);
