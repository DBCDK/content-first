import React from 'react';
import {connect} from 'react-redux';
import Belt from './Belt.component';
import CreateProfile from '../profile/CreateProfile.component';
import {ON_BELT_SCROLL, ON_TAG_TOGGLE, ON_BELT_REQUEST} from '../../redux/belts.reducer';
import {ON_RESET_FILTERS} from '../../redux/filter.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';
import {getLeaves} from '../../utils/filters';


const SCROLL_INTERVAL = 5;

class FrontPage extends React.Component {

  componentDidMount() {
    // Fetch works for each belt
    this.props.beltsState.belts.forEach(belt => {
      if (belt.onFrontPage) {
        this.props.dispatch({type: ON_RESET_FILTERS, beltName: belt.name});
        this.props.dispatch({type: ON_BELT_REQUEST, beltName: belt.name});
      }
    });
  }

  renderBelts() {
    return (
      <div className='belts col-xs-11 col-centered'>
        {this.props.beltsState.belts.map((belt, idx) => {
          if (!belt.onFrontPage) {
            return null;
          }

          const allFilters = getLeaves(this.props.filterState.filters);
          const selectedFilters = this.props.filterState.beltFilters[belt.name].map(id => allFilters.find(filter => filter.id === id));

          // We might insert a 'create profile'-component to the belt
          const custom = idx === 2 ? <CreateProfile/> : null;
          return <Belt
            key={idx}
            belt={belt}
            filters={selectedFilters}
            onScrollRight={() => {
              this.props.dispatch({type: ON_BELT_SCROLL, id: idx, scrollOffset: belt.scrollOffset + SCROLL_INTERVAL});
            }}
            onScrollLeft={() => {
              this.props.dispatch({type: ON_BELT_SCROLL, id: idx, scrollOffset: belt.scrollOffset - SCROLL_INTERVAL});
            }}
            onTagClick={(tagId) => {
              this.props.dispatch({type: ON_TAG_TOGGLE, tagId, beltId: idx});
            }}
            onMoreClick={(beltName) => {
              this.props.dispatch({type: HISTORY_PUSH, path: beltNameToPath(beltName)});
            }}
            custom={custom}
          />;
        })}
      </div>
    );
  }

  render() {
    return (
      <div className='frontpage'>
        <div className='row frontpage-image'/>
        {this.renderBelts()}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {beltsState: state.beltsReducer, filterState: state.filterReducer};
  }
)(FrontPage);
