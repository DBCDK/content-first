import React from 'react';
import {connect} from 'react-redux';
import Belt from './Belt.component';
import CreateProfile from '../profile/CreateProfile.component';
import {ON_BELT_SCROLL} from '../../reducers/belts';

const SCROLL_INTERVAL = 5;

class FrontPage extends React.Component {

  renderBelts() {

    return (
      <div className='belts'>
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
            custom={custom}
          />;
        })}
      </div>
    );
  }

  render() {
    return (
      <div className='frontpage'>
        <div className='row frontpage-image'>
          billede
        </div>
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
