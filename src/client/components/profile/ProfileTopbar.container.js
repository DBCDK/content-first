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

  constructor(props) {
    super(props);
    this.state = {
      hasContent: false
    };
  }
  componentDidMount() {
    setTimeout(() => this.setState({hasContent: true}), 1000);
  }
  render() {
    return (<div className={`profile-topbar ${this.state.hasContent ? 'has-content' : ''}`} >
      <div className="profile-topbar-content container">
        <Progress percent="75" strokeWidth="16" />
        <ProfileTags tags={this.props.profile.tags} />
        <ProfileRecommendations recommendations={this.props.profile.recommendations} />
      </div>
    </div>);
  }
}

export default ProfileTopbar;
