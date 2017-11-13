import React from 'react';
import {connect} from 'react-redux';
import ProfileTopbar from './ProfileTopbar.container';
import ProfileDummyBelt from './ProfileDummyBelt.component';
import '../../style/profilePage.css';
import {ON_PROFILE_RECOMMENDATIONS_REQUEST} from '../../redux/profile.reducer';


class ProfilePage extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileState.tags !== this.props.profileState.tags) {
      this.props.dispatch({type: ON_PROFILE_RECOMMENDATIONS_REQUEST, action: nextProps});
    }
  }
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
