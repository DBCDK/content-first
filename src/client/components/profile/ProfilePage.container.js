import React from 'react';
import {connect} from 'react-redux';
import ProfileTopbar from './ProfileTopbar.container';
import ProfileBelt from './ProfileBelt.component';
import ProfileCreateTaste from './ProfileCreateTaste.component';
import ArchetypeTooltip from './ArchetypeTooltip.component';
import AuthorTooltip from './AuthorTooltip.component';
import {
  ON_ADD_PROFILE_ARCHETYPE,
  ON_PROFILE_LOAD_PROFILES,
  ON_PROFILE_REMOVE_CURRENT_PROFILE
} from '../../redux/profile.reducer';

class ProfilePage extends React.Component {

  componentDidMount() {
    this.props.dispatch({type: ON_PROFILE_LOAD_PROFILES});
  }
  render() {
    const {profileTastes, recommendations, belts} = this.props.profileState;
    const {currentTaste, profiles, loading} = profileTastes;
    if (loading) {
      return (<div>Loading</div>);
    }
    if (!currentTaste) {
      return (<ProfileCreateTaste profiles={profiles} belts={belts} dispatch={this.props.dispatch}/>);
    }
    const profile = profiles[currentTaste];
    return (
      <div className={`profile-page text-left ${profile.allSelectedTags.length > 0 ? 'has-topbar' : ''}`}>
        <ProfileTopbar
          profile={profile}
          recommendations={recommendations}
          currentTaste={currentTaste}
          onDeselectProfile = {() => this.props.dispatch({type: ON_PROFILE_REMOVE_CURRENT_PROFILE})}
        />
        <div className='profile-page-content'>
          <h2>Hvilke stemninger foretrække du i bøger</h2>
          <ProfileBelt type="moods" selectionType="checkmark" />
          <h2>Hvilke genre af bøger foretrækker du</h2>
          <ProfileBelt type="genres" selectionType="checkmark" />
          <h2>Hvilke typer af forslag vil du se?</h2>
          <ProfileBelt type="archetypes" size="6" tooltip={ArchetypeTooltip} add={ON_ADD_PROFILE_ARCHETYPE} />
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
