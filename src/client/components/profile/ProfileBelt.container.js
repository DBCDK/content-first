/* eslint-disable max-len */
import React from 'react';
import {connect} from 'react-redux';
import {
  ADD_TASTE_ELEMENT,
  REMOVE_TASTE_ELEMENT
} from '../../redux/taste.reducer';
import Card from './ProfileCard.component';

class ProfileBelt extends React.Component {
  isTagSelected(tag) {
    const currentProfile = this.props.tastes.profileTastes.profiles[
      this.props.tastes.profileTastes.currentTaste
    ];
    return (
      currentProfile[this.props.type].filter(label => label === tag.label)
        .length === 1
    );
  }
  render() {
    const {
      format = 'square',
      size = '8',
      selectionType = 'border',
      tastes,
      dispatch,
      type,
      tooltip = () => {},
      add = ADD_TASTE_ELEMENT,
      remove = REMOVE_TASTE_ELEMENT
    } = this.props;
    return (
      <div
        className={`profile-belt flex-grid flex-grid-${size} flex-grid-6-m ${format}`}
      >
        {tastes.belts[type].map(element => (
          <Card
            key={element.label}
            onAddElement={() =>
              dispatch({type: add, element, elementType: type})
            }
            onRemoveElement={() =>
              dispatch({type: remove, element, elementType: type})
            }
            element={element}
            isSelected={this.isTagSelected(element)}
            selectionType={selectionType}
          >
            {tooltip(element)}
          </Card>
        ))}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  state => {
    return {tastes: state.tasteReducer};
  }
)(ProfileBelt);
