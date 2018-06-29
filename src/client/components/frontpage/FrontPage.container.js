import React from 'react';
import {connect} from 'react-redux';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import BooksBelt from '../belt/BooksBelt.container';
import SimilarBooksBelt from '../belt/SimilarBooksBelt.container';
import Bookcase from '../bookcase/Bookcase.component';
import InteractionsRecoBelt from '../belt/InteractionsRecoBelt.container';

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
  renderBelts() {
    const beltsMap = this.props.beltsMap;

    const flatten = [];
    Object.values(beltsMap).forEach(belt => {
      let path = '';
      let currentParent = belt;
      while (currentParent) {
        path += belt.name;
        flatten.push({belt: currentParent, path});
        currentParent = currentParent.child;
      }
    });

    return (
      <div className="belts col-xs-12 col-sm-12 col-centered">
        <InteractionsRecoBelt />

        {flatten.filter(entry => entry.belt.onFrontPage).map(entry => {
          const {belt, path} = entry;
          if (belt.pid) {
            return (
              <SimilarBooksBelt
                key={path}
                title={belt.name}
                subtext={belt.subtext}
                pid={belt.pid}
                belt={belt}
              />
            );
          }
          return <BooksBelt key={path} belt={belt} tags={belt.tags} />;
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
    beltsMap: state.beltsReducer.belts
  };
};

export default connect(mapStateToProps)(FrontPage);
