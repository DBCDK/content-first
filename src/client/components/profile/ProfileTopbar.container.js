import React from 'react';
import Progress from './Progress.component';
import '../../style/components/profileTopbar.css';
import ProfileRecommendations from './profileRecommendations.component';

const ProfileTags = ({tags}) => (
  <div className="tags">
    {tags.map(({label}) => <span key={label} className='btn selected-tag'>{label}</span>)}
  </div>
);

class ProfileTopbar extends React.Component {
  render() {
    return (<div className={`profile-topbar ${this.props.profile.tags.length > 0 ? 'has-content' : ''}`} >
      <div className="profile-topbar-content container">
        <Progress percent={this.props.profile.tags.length * 10} strokeWidth="16" />
        <ProfileTags tags={this.props.profile.tags} />
        <ProfileRecommendations recommendations={this.props.profile.recommendations} isLoading={this.props.profile.loadingRecommendations}/>
      </div>
    </div>);
  }
}

export default ProfileTopbar;
