import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_ARCHETYPE, ON_REMOVE_PROFILE_ARCHETYPE} from '../../redux/profile.reducer';
import TooltipBeltElement from './TooltipBeltElement.component';

const Archetype = ({archetype, isSelected, dispatch}) => (
  <TooltipBeltElement
    onAddElement={(element) => dispatch({type: ON_ADD_PROFILE_ARCHETYPE, archetype: element})}
    onRemoveElement={(element) => dispatch({type: ON_REMOVE_PROFILE_ARCHETYPE, archetype: element})}
    element={archetype}
    isSelected={isSelected}
  >
    <h4>Følger:</h4>
    <div className="flex-grid tight authors">
      {archetype.authors.map(author => <span key={author}>{author}</span>)}
    </div>
    <h4>læser:</h4>
    <div className="flex-grid tight">
      {archetype.moods.map(mood => <span key={mood} className="tag small tag-orange">{mood}</span>)}
    </div>
    <h4>Kan lide:</h4>
    <div className="flex-grid flex-grid-3">
      {archetype.likes.map(pid => <img key={pid} className="card-like" src={`https://content-first.demo.dbc.dk/v1/image/${pid}`} alt={pid} />)}
    </div>
  </TooltipBeltElement>
);

class ProfileArchetypeBelt extends React.Component {
  isSelected(tag) {
    return this.props.profileState.selectedArchetypes.filter(archetype => archetype === tag.label).length === 1;
  }

  render() {
    return (
      <div className="profile-belt flex-grid flex-grid-6 square">
        {this.props.archetypes.map(archetype => <Archetype key={archetype.label} archetype={archetype} dispatch={this.props.dispatch} isSelected={this.isSelected(archetype)} />)}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {profileState: state.profileReducer};
  }
)(ProfileArchetypeBelt);
