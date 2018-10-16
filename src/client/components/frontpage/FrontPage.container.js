import React from 'react';
import {connect} from 'react-redux';
import Hero from '../hero/hero.component';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import BookcaseItem from '../bookcase/BookcaseItem.component';
import BooksBelt from '../belt/BooksBelt.component';
import SpotsContainer from '../spots/Spots.container';
class FrontPage extends React.Component {
  renderBelts() {
    const beltsMap = this.props.beltsMap;

    return (
      <div className="container">
        <div className="belts col-12 ">
          {Object.values(beltsMap)
            .filter(belt => belt.onFrontPage)
            .map(belt => (
              <BooksBelt key={belt.name} belt={belt} />
            ))}
          <RecentListsBelt />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="frontpage">
        <Hero />
        <SpotsContainer />
        <BookcaseItem id={'a2d7b450-c7ba-11e8-a4c7-c500cfdf0018'} />
        {this.renderBelts()}
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
