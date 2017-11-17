import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_AUTHOR, ON_REMOVE_PROFILE_AUTHOR} from '../../redux/profile.reducer';
import TooltipBeltElement from './TooltipBeltElement.component';

const Author = ({author, isSelected, dispatch}) => (
  <TooltipBeltElement
    onAddElement={(element) => dispatch({type: ON_ADD_PROFILE_AUTHOR, author: element})}
    onRemoveElement={(element) => dispatch({type: ON_REMOVE_PROFILE_AUTHOR, author: element})}
    element={author}
    isSelected={isSelected}
  >
    <h4>{author.label}</h4>
    <div className="flex-grid tight authors">
      {author.byline}
    </div>
    <h4>genrer:</h4>
    <div className="flex-grid tight">
      {author.genres.map(mood => <span key={mood} className="tag small tag-orange">{mood}</span>)}
    </div>
    <h4>Kan lide:</h4>
    <div className="flex-grid flex-grid-3">
      {author.likes.map(pid => <img key={pid} className="card-like" src={`https://content-first.demo.dbc.dk/v1/image/${pid}`} alt={pid} />)}
    </div>
  </TooltipBeltElement>
);

class ProfileAuthorBelt extends React.Component {
  isSelected(tag) {
    return this.props.profileState.selectedAuthors.filter(author => author === tag.label).length === 1;
  }

  render() {
    return (
      <div className="profile-belt flex-grid flex-grid-6 wide">
        {this.props.authors.map(author => <Author key={author.label} author={author} dispatch={this.props.dispatch} isSelected={this.isSelected(author)} />)}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {profileState: state.profileReducer};
  }
)(ProfileAuthorBelt);
