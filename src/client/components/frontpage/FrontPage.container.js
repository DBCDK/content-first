import React from 'react';
import {connect} from 'react-redux';

class FrontPage extends React.Component {

  render() {
    return (
      <div className='row frontpage--container'>
        <div className='col-md-8 col-centered'>
          <h2 className='title--thin text-center'>En lille overskrift</h2>
        </div>
      </div>
    );
  }
}
export default connect(
  // Map redux state to group prop
  (state) => {
    return {state};
  }
)(FrontPage);
