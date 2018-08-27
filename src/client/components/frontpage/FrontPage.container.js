import React from 'react';
import {connect} from 'react-redux';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import Bookcase from '../bookcase/Bookcase.component';
import BooksBelt from '../belt/BooksBelt.component';
import SpotsContainer from '../spots/Spots.container';
class FrontPage extends React.Component {
  renderBelts() {
    const beltsMap = this.props.beltsMap;

    return (
      <React.Fragment>
        <SpotsContainer />
        <div className="belts col-12">
          {Object.values(beltsMap)
            .filter(belt => belt.onFrontPage)
            .map(belt => (
              <BooksBelt key={belt.name} belt={belt} />
            ))}
          <RecentListsBelt />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="frontpage">
        <Bookcase />
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
