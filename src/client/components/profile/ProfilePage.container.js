import React from 'react';
import {connect} from 'react-redux';

class ProfilePage extends React.Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <div className='profilepage'>
          This is a profile container page
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  () => {
    return {};
  }
)(ProfilePage);
