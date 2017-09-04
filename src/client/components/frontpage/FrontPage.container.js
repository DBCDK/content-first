import React from 'react';
import {connect} from 'react-redux';
import Belt from './Belt.component';
import CreateProfile from '../profile/CreateProfile.component';
import {ON_BELT_SCROLL, ON_TAG_TOGGLE} from '../../redux/belts.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';

const SCROLL_INTERVAL = 5;

class FrontPage extends React.Component {

  renderBelts() {

    return (
      <div className='belts col-xs-11 col-centered'>
        {this.props.beltsState.belts.map((belt, idx) => {
          // We might insert a 'create profile'-component to the belt
          const custom = idx === 2 ? <CreateProfile/> : null;
          return <Belt
            key={idx}
            belt={belt}
            onScrollRight={() => {
              this.props.dispatch({type: ON_BELT_SCROLL, id: idx, scrollOffset: belt.scrollOffset + SCROLL_INTERVAL});
            }}
            onScrollLeft={() => {
              this.props.dispatch({type: ON_BELT_SCROLL, id: idx, scrollOffset: belt.scrollOffset - SCROLL_INTERVAL});
            }}
            onTagClick={(tagId) => {
              this.props.dispatch({type: ON_TAG_TOGGLE, tagId, beltId: idx});
            }}
            onMoreClick={() => {
              this.props.dispatch({type: HISTORY_PUSH, path: beltNameToPath(belt.name)});
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
    return {beltsState: state.beltsReducer};
  }
)(FrontPage);
