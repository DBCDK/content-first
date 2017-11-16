/* eslint-disable max-len */
import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_TAG, ON_REMOVE_PROFILE_TAG} from '../../redux/profile.reducer';
import '../../style/components/profileBelt.css';
import Checkmark from '../svg/Checkmark';

const Tag = ({tag, isSelected, dispatch})=> (
  <div key={tag.label} className={`card ${isSelected ? 'is-selected' : ''}`} onClick={() => dispatch({type: isSelected ? ON_REMOVE_PROFILE_TAG : ON_ADD_PROFILE_TAG, mood: tag})}>
    <div className="card-background">
      <img src={tag.image} alt={tag.label} />
    </div>
    <span className="card-checked"><Checkmark /></span>
    <span className="card-label raleway">{tag.label}</span>
  </div>
);

class ProfileMoodBelt extends React.Component {
  isTagSelected(tag) {
    return this.props.profileState.selectedMoods.filter(label => label === tag.label).length === 1;
  }

  render() {
    return (
      <div className="profile-belt flex-grid flex-grid-8 flex-grid-6-m square">
        {this.props.moods.map(tag => <Tag key={tag.label} tag={tag} dispatch={this.props.dispatch} isSelected={this.isTagSelected(tag)} />)}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {profileState: state.profileReducer};
  }
)(ProfileMoodBelt);
