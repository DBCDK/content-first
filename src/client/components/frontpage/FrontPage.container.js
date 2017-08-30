import React from 'react';
import {connect} from 'react-redux';
import Belt from './Belt.component';

class FrontPage extends React.Component {

  renderBelts() {
    return (
      <div className='belts'>
        {this.props.beltsState.belts.map((belt, idx) => {
          return <Belt key={idx} belt={belt}/>;
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
