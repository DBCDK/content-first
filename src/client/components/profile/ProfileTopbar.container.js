import React from 'react';
import Progress from './Progress.component';
import '../../style/components/profileTopbar.css';
import ProfileRecommendations from './profileRecommendations.component';

const ProfileTags = () => (
  <div className="tags">
    <span className='btn selected-tag'>Agatha Christie</span>
    <span className='btn selected-tag'>Agatha Christie</span>
    <span className='btn selected-tag'>Agatha Christie</span>
    <span className='btn selected-tag'>Agatha Christie</span>
  </div>
);

class ProfileTopbar extends React.Component {

  constructor() {
    super();
    this.state = {
      hasContent: false
    };
  }
  componentDidMount() {
    setTimeout(() => this.setState({hasContent: true}), 1000);
  }
  render() {
    return (<div className={`profile-topbar ${this.state.hasContent && 'has-content' || ''}`} >
      <div className="profile-topbar-content container">
        <Progress percent="75" strokeWidth="16" />
        <ProfileTags />
        <ProfileRecommendations />
      </div>
    </div>);
  }
}

export default ProfileTopbar;
