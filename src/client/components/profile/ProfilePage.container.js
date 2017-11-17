import React from 'react';
import {connect} from 'react-redux';
import ProfileTopbar from './ProfileTopbar.container';
import ProfileMoodBelt from './ProfileMoodBelt.component';
import ProfileArchetypeBelt from './ProfileArchetype.component';
import ProfileAuthorBelt from './ProfileAuthor.component';
import '../../style/profilePage.css';
import {ON_PROFILE_RECOMMENDATIONS_REQUEST} from '../../redux/profile.reducer';


class ProfilePage extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileState.selectedMoods !== this.props.profileState.selectedMoods) {
      this.props.dispatch({type: ON_PROFILE_RECOMMENDATIONS_REQUEST, action: nextProps});
    }
  }
  render() {
    return (
      <div className={`profile-page ${this.props.profileState.selectedMoods.length > 0 ? 'has-topbar' : ''}`}>
        <ProfileTopbar profile={this.props.profileState}/>
        <div className='profile-page-content'>
          <h2>Hvilke stemninger foretrække du i bøger</h2>
          <ProfileMoodBelt moods={this.props.profileState.belts.moods}/>
          <h2>Hvilke typer af forslag vil du se?</h2>
          <ProfileArchetypeBelt archetypes={this.props.profileState.belts.archetypes} />
          <h2>Hvilke forfattere kan du godt lide at læse?</h2>
          <ProfileAuthorBelt authors={this.props.profileState.belts.authors} />
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
