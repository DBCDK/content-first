/* eslint-disable max-len */
import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_ELEMENT, ON_REMOVE_PROFILE_ELEMENT} from '../../redux/profile.reducer';
import Card from './ProfileCard.component';

class ProfileBelt extends React.Component {
  isTagSelected(tag) {
    const currentProfile = this.props.profileState.profileTastes.profiles[this.props.profileState.profileTastes.currentTaste];
    return currentProfile[this.props.type].filter(label => label === tag.label).length === 1;
  }
  render() {
    const {format = 'square', size = '8', selectionType = 'border', profileState, dispatch, type, tooltip = () => {}, add = ON_ADD_PROFILE_ELEMENT, remove = ON_REMOVE_PROFILE_ELEMENT} = this.props;
    return (
      <div className={`profile-belt flex-grid flex-grid-${size} flex-grid-6-m ${format}`}>
        {profileState.belts[type].map(element => <Card
          key={element.label}
          onAddElement={() => dispatch({type: add, element, elementType: type})}
          onRemoveElement={() => dispatch({type: remove, element, elementType: type})}
          element={element}
          isSelected={this.isTagSelected(element)}
          selectionType={selectionType}
        >
          {tooltip(element)}
        </Card>
        )}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {profileState: state.profileReducer};
  }
)(ProfileBelt);
