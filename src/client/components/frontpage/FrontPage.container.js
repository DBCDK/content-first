import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import Hero from '../hero/Hero.component';
import RecentListsBelt from '../base/Belt/RecentListsBelt.container';
import BookcaseItem from '../bookcase/BookcaseItem.component';
import InteractionsBelt from '../base/Belt/InteractionsBelt.component';
import TagsBelt from '../base/Belt/TagsBelt.component';
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
      <div>
        {/* <div className="belts col-12"> */}
        {belts.filter(belt => belt.onFrontPage).map(belt => (
          <TagsBelt
            mount={'frontpage' + JSON.stringify(belt.tags)}
            id={belt.key}
            {...belt}
          />
        ))}
        {/* </div> */}
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
        <InteractionsBelt
          mount={'frontpage-interactions-belt'}
          key={'frontpage-interactions-belt'}
        />
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
