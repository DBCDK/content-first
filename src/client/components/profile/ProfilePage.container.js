import React from 'react';
import {connect} from 'react-redux';
import ProfileTopbar from './ProfileTopbar.container';

class ProfilePage extends React.Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <div className='profile-page'>
        <ProfileTopbar />
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
