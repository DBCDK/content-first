import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_ARCHETYPE, ON_REMOVE_PROFILE_ARCHETYPE} from '../../redux/profile.reducer';
import '../../style/components/profileBelt.css';
import ProfileTooltip from './profileTooltip.component';

class Archetype extends React.Component {

  constructor() {
    super();
    this.state = {
      showTooltip: false
    };
  }
  toggleTooltip(e) {
    e.stopPropagation();
    this.setState({showTooltip: !this.state.showTooltip});
  }

  render() {
    const {archetype, isSelected, dispatch} = this.props;
    return (
      <div className={`card card-blue-select scale-on-hover scale-1 ${isSelected ? 'is-selected' : ''}`}
        onMouseLeave={() => this.setState({showTooltip: false})}
        onClick={() => dispatch({type: isSelected ? ON_REMOVE_PROFILE_ARCHETYPE : ON_ADD_PROFILE_ARCHETYPE, archetype: archetype})}
      >
        <div className="card-container">
          <div className="card-background">
            <img src={archetype.image} alt={archetype.label} />
          </div>
          <span className="card-info" onClick={(e) => this.toggleTooltip(e)} />
          <span className="card-label raleway">{archetype.label}</span>
        </div>
        <ProfileTooltip isVisible={this.state.showTooltip}>
          <h4>Følger:</h4>
          <div className="flex-grid tight authors">
            {archetype.authors.map(author => <span>{author}</span>)}
          </div>
          <h4>læser:</h4>
          <div className="flex-grid tight">
            {archetype.moods.map(mood => <span className="tag small tag-orange">{mood}</span>)}
          </div>
          <h4>Kan lide:</h4>
          <div className="flex-grid flex-grid-3">
            {archetype.likes.map(pid => <img className="card-like" src={`https://content-first.demo.dbc.dk/v1/image/${pid}`} alt={pid} />)}
          </div>
        </ProfileTooltip>

      </div>
    );
  }
}

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
