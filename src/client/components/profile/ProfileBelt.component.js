/* eslint-disable max-len */
import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_ELEMENT, ON_REMOVE_PROFILE_ELEMENT} from '../../redux/profile.reducer';
import BeltElement from './BeltElement.component';

class ProfileBelt extends React.Component {
  isTagSelected(tag) {
    return this.props.profileState.profile[this.props.type].filter(label => label === tag.label).length === 1;
  }
  render() {
    const {format = 'square', size = '8', selectionType = 'border', profileState, dispatch, type, tooltip = () => {}, add = ON_ADD_PROFILE_ELEMENT, remove = ON_REMOVE_PROFILE_ELEMENT} = this.props;
    return (
      <div className={`profile-belt flex-grid flex-grid-${size} flex-grid-6-m ${format}`}>
        {profileState.belts[type].map(element => <BeltElement
          onAddElement={() => dispatch({type: add, element, elementType: type})}
          onRemoveElement={() => dispatch({type: remove, element, elementType: type})}
          element={element}
          isSelected={this.isTagSelected(element)}
          selectionType={selectionType}
        >
          {tooltip(element)}
        </BeltElement>
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
