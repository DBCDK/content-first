import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import Head from '../base/Head';
import T from '../base/T';
import Hero from '../hero/Hero.component';
import KioskHero from '../kiosk/Hero/KioskHero.component';
import ListsBelt from '../base/Belt/ListsBelt.container';
import TagsBelt from '../base/Belt/TagsBelt.component';
import SpotsContainer from '../spots/Spots.container';
import {HISTORY_REPLACE} from '../../redux/middleware';
import PersonalBelt from '../base/Belt/PersonalBelt.component';
import Kiosk from '../base/Kiosk/Kiosk';

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
          .map(belt => {
            return (
              <TagsBelt
                mount={'frontpage' + JSON.stringify(belt.tags)}
                id={belt.key}
                {...belt}
              />
            );
          })}
      </div>
    );
  }

  convertToSortedArray = beltsMap => {
    const ownedBelts = [];
    const editorialBelts = [];
    Object.values(beltsMap).forEach(belt => {
      if (belt._owner !== this.props.user.openplatformId) {
        editorialBelts.push(belt);
      } else {
        ownedBelts.push(belt);
      }
    });
    ownedBelts.sort((a, b) => (b._created || 0) - (a._created || 0));
    editorialBelts.sort((a, b) => (a.index || 0) - (b.index || 0));
    return ownedBelts.concat(editorialBelts).filter(a => a.onFrontPage);
  };

  render() {
    const belts = this.convertToSortedArray(this.props.beltsMap || {});

    return (
      <div className="frontpage">
        <Head />
        <Kiosk
          render={({kiosk}) => {
            if (kiosk.enabled) {
              return <KioskHero />;
            }
            return <Hero />;
          }}
        />

        <PersonalBelt mount={'frontpage-because-you-read-belt-1'} />
        {this.renderBelts(belts.slice(0, 2))}
        <ListsBelt
          title={T({
            component: 'list',
            name: 'recentListsTitle',
            renderAsHtml: true
          })}
          matomoTitle={'Nyeste brugerlister'}
          mount={'frontpage-lists'}
          sort="created"
          limit={50}
        />
        <PersonalBelt mount={'frontpage-because-you-read-belt-2'} />
        <SpotsContainer />
        {this.renderBelts(belts.slice(2, belts.length))}
        <PersonalBelt mount={'frontpage-because-you-read-belt-3'} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    beltsMap: state.beltsReducer.belts,
    hash: state.routerReducer.hash,
    user: state.userReducer
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
