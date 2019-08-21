import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import Head from '../base/Head';
import T from '../base/T';
import Hero from '../hero/Hero.component';
import ListsBelt from '../base/Belt/ListsBelt.container';
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
        {belts
          .filter(belt => belt.onFrontPage)
          .map(belt => (
            <TagsBelt
              mount={'frontpage' + JSON.stringify(belt.tags)}
              id={belt.key}
              {...belt}
            />
          ))}
      </div>
    );
  }

  render() {
    const beltsMap = this.props.beltsMap;
    const aBeltsMap = Object.values(beltsMap);

    aBeltsMap.sort((a, b) => (b._created || 0) - (a._created || 0));
    return (
      <div className="frontpage">
        <Head />
        <Hero />
        <InteractionsBelt
          mount={'frontpage-interactions-belt'}
          key={'frontpage-interactions-belt'}
        />
        {this.renderBelts(aBeltsMap.slice(0, 2))}
        <SpotsContainer />
        {this.renderBelts(aBeltsMap.slice(2, aBeltsMap.length))}
        <ListsBelt
          title={T({
            component: 'list',
            name: 'recentListsTitle',
            renderAsHtml: true
          })}
          mount={'frontpage-lists'}
          sort="created"
          limit={50}
        />
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
