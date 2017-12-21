import React from 'react';
import Progress from './Progress.component';
import ProfileRecommendations from './ProfileRecommendations.component';

const ProfileTags = ({tags}) => (
  <div className>
    {tags.map(label => (
      <span key={label} className="btn selected-tag">
        {label}
      </span>
    ))}
  </div>
);

class ProfileTopbar extends React.Component {
  getProgress() {
    const percent = this.props.profile.allSelectedTags.length * 10;
    return percent > 100 ? 100 : percent;
  }
  render() {
    return (
      <div
        className={`profile-topbar ${
          this.props.profile.allSelectedTags.length > 0 ? 'has-content' : ''
        }`}
      >
        <div className="profile-topbar-content container">
          <Progress percent={this.getProgress()} strokeWidth="16" />
          <div className="tags">
            <ProfileTags tags={this.props.profile.allSelectedTags} />
            <div className="profile-topbar-label text-left raleway">
              Din <strong>{this.props.currentTaste}</strong> profil.{' '}
              <button
                className="btn-link"
                onClick={() => this.props.onDeselectProfile()}
              >
                Vælg en anden smagsprofil
              </button>
            </div>
          </div>
          <ProfileRecommendations
            recommendations={this.props.recommendations.elements}
            isLoading={this.props.recommendations.isLoading}
          />
        </div>
      </div>
    );
  }
}

export default ProfileTopbar;
