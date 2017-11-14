/* eslint-disable max-len */
import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_TAG, ON_REMOVE_PROFILE_TAG} from '../../redux/profile.reducer';
import '../../style/components/profileBelt.css';
import Checkmark from '../svg/Checkmark';

const Tag = ({tag, isSelected, dispatch})=> (
  <div key={tag.label} className={`tag ${isSelected ? 'is-selected' : ''}`} onClick={() => dispatch({type: isSelected ? ON_REMOVE_PROFILE_TAG : ON_ADD_PROFILE_TAG, tag: tag.label})}>
    <div className="tag-background">
      <img src={tag.image} alt={tag.label} />
    </div>
    <span className="tag-checked"><Checkmark /></span>
    <span className="tag-label raleway">{tag.label}</span>
  </div>
);

class ProfileMoodBelt extends React.Component {
  isTagSelected(tag) {
    return this.props.profileState.tags.filter(label => label === tag.label).length === 1;
  }

  render() {
    return (
      <div className="profile-belt">
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
