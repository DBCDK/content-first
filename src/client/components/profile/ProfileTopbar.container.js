import React from 'react';
import Progress from './Progress.component';
import '../../style/components/profileTopbar.css';
import ProfileRecommendations from './profileRecommendations.component';

const ProfileTags = ({tags}) => (
  <div className="tags">
    {tags.map((label) => <span key={label} className='btn selected-tag'>{label}</span>)}
  </div>
);

class ProfileTopbar extends React.Component {
  getProgress() {
    const percent = this.props.profile.allSelectedTags.length * 10;
    return percent > 100 ? 100 : percent;
  }
  render() {
    return (
      <div className={`profile-topbar ${this.props.profile.allSelectedTags.length > 0 ? 'has-content' : ''}`} >
        <div className="profile-topbar-content container">
          <Progress percent={this.getProgress()} strokeWidth="16" />
          <ProfileTags tags={this.props.profile.allSelectedTags} />
          <ProfileRecommendations recommendations={this.props.profile.recommendations.elements} isLoading={this.props.profile.recommendations.isLoading}/>
        </div>
      </div>
    );
  }
}

export default ProfileTopbar;
