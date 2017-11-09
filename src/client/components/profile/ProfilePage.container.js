import React from 'react';
import {connect} from 'react-redux';
import ProfileTopbar from './ProfileTopbar.container';
import ProfileDummyBelt from './ProfileDummyBelt.component';
import '../../style/profilePage.css';

class ProfilePage extends React.Component {
  render() {
    return (
      <div className='profile-page'>
        <ProfileTopbar profile={this.props.profileState}/>
        <div className='profile-page-content'>
          <h2>Dummy Profile Tags</h2>
          <ProfileDummyBelt />
        </div>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {profileState: state.profileReducer};
  }
)(ProfilePage);
