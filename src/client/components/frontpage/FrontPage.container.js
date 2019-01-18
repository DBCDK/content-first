import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import Hero from '../hero/Hero.component';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import BookcaseItem from '../bookcase/BookcaseItem.component';
import BooksBelt from '../belt/BooksBelt.component';
import SpotsContainer from '../spots/Spots.container';
import {HISTORY_REPLACE} from '../../redux/middleware';

class FrontPage extends React.Component {
  componentDidMount() {
    const hash = this.props.hash.replace('#', '');

    if (hash) {
      setTimeout(() => {
        scrollToComponent(document.getElementById(hash), {
          offset: 100,
          duration: 1500
        });
        if (hash.includes('temp_')) {
          this.props.history(HISTORY_REPLACE, '/');
        }
      }, 500);
    }
  }

  renderBelts(belts) {
    return (
      <div className="container">
        <div className="belts col-12">
          {belts.filter(belt => belt.onFrontPage).map(belt => (
            <BooksBelt id={belt.key} key={belt.key} belt={belt} />
          ))}
        </div>
      </div>
    );
  }

  render() {
    const beltsMap = this.props.beltsMap;
    const aBeltsMap = Object.values(beltsMap);
    const bookcase = 'a2d7b450-c7ba-11e8-a4c7-c500cfdf0018';

    aBeltsMap.sort((a, b) => (b._created || 0) - (a._created || 0));

    return (
      <div className="frontpage">
        <Hero />
        {this.renderBelts(aBeltsMap.slice(0, 7))}
        <SpotsContainer />
        {this.renderBelts(aBeltsMap.slice(7, 9))}
        <BookcaseItem id={bookcase} />
        {this.renderBelts(aBeltsMap.slice(9, aBeltsMap.length))}
        <div className="container">
          <div className="belts col-12">
            <RecentListsBelt />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    beltsMap: state.beltsReducer.belts,
    hash: state.routerReducer.hash
  };
};

export const mapDispatchToProps = dispatch => ({
  history: (type, path, params = {}) => {
    dispatch({type, path, params});
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage);
