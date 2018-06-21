import React from 'react';
import {connect} from 'react-redux';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import BooksBelt from '../belt/BooksBelt.container';
import Bookcase from '../bookcase/Bookcase.component';
import RecommendationsBelt from '../belt/RecommendationsBelt.container';

class FrontPage extends React.Component {
  componentDidMount() {
    if (window.$) {
      window.$('[data-toggle="tooltip"]').tooltip();
    }
  }

  componentDidUpdate() {
    if (window.$) {
      window.$('[data-toggle="tooltip"]').tooltip();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.belts !== this.props.belts;
  }

  renderBelts() {
    return (
      <div className="belts col-xs-12 col-sm-12 col-centered">
        <RecommendationsBelt />

        {this.props.belts.filter(belt => belt.onFrontPage).map((belt, idx) => {
          return (
            <BooksBelt
              key={idx}
              title={belt.name}
              subtext={belt.subtext}
              tags={this.props.getBeltTagIdList(belt)}
            />
          );
        })}

        <RecentListsBelt />
      </div>
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
    belts: state.beltsReducer.belts,
    getBeltTagIdList: belt => state.filterReducer.beltFilters[belt.name]
  };
};

export default connect(mapStateToProps)(FrontPage);
