import React from 'react';
import {connect} from 'react-redux';
import {ON_ADD_PROFILE_TAG, ON_REMOVE_PROFILE_TAG} from '../../redux/profile.reducer';

class ProfileDummyBelt extends React.Component {
  isTagSelected(tag) {
    return this.props.profileState.tags.filter(({label}) => label === tag.label).length === 1;
  }

  renderTag(tag) {
    if (!this.isTagSelected(tag)) {
      return (
        <div key={tag.label} className="btn btn-primary tag" onClick={() => this.props.dispatch({type: ON_ADD_PROFILE_TAG, tag})}>
          <span className="tag-label">{tag.label}</span>
        </div>
      );
    }
    return (
      <div key={tag.label} className="btn btn-default tag" onClick={() => this.props.dispatch({type: ON_REMOVE_PROFILE_TAG, tag})}>
        <span className="tag-label">{tag.label}</span>
      </div>
    );
  }

  render() {
    const dummyTags = [
      {label: 'Agatha Cristie'},
      {label: 'Mørk'},
      {label: 'Filosofisk'},
      {label: 'Middelalder'},
      {label: 'Charmerende'}
    ];
    return (
      <div className="profile-dummy-belt">
        {dummyTags.map(tag => this.renderTag(tag))}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {profileState: state.profileReducer};
  }
)(ProfileDummyBelt);
