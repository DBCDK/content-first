import React from 'react';
import {connect} from 'react-redux';
import ProfileTopbar from './ProfileTopbar.container';
import ProfileBelt from './ProfileBelt.component';
import ArchetypeTooltip from './ArchetypeTooltip.component';
import AuthorTooltip from './AuthorTooltip.component';
import {ON_PROFILE_RECOMMENDATIONS_REQUEST, ON_ADD_PROFILE_ARCHETYPE, ON_REMOVE_PROFILE_ARCHETYPE} from '../../redux/profile.reducer';

class ProfilePage extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileState.allSelectedTags.length !== this.props.profileState.allSelectedTags.length) {
      this.props.dispatch({type: ON_PROFILE_RECOMMENDATIONS_REQUEST, action: nextProps});
    }
  }
  render() {
    return (
      <div className={`profile-page ${this.props.profileState.allSelectedTags.length > 0 ? 'has-topbar' : ''}`}>
        <ProfileTopbar profile={this.props.profileState}/>
        <div className='profile-page-content'>
          <h2>Hvilke stemninger foretrække du i bøger</h2>
          <ProfileBelt type="moods" selectionType="checkmark" />
          <h2>Hvilke genre af bøger foretrækker du</h2>
          <ProfileBelt type="genres" selectionType="checkmark" />
          <h2>Hvilke typer af forslag vil du se?</h2>
          <ProfileBelt type="archetypes" size="6" tooltip={ArchetypeTooltip} add={ON_ADD_PROFILE_ARCHETYPE} remove={ON_REMOVE_PROFILE_ARCHETYPE} />
          <h2>Hvilke forfattere kan du godt lide at læse?</h2>
          <ProfileBelt type="authors" format="wide" size="6" tooltip={AuthorTooltip} />
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
