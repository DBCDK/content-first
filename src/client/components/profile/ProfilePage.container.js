import React from 'react';
import {connect} from 'react-redux';
import ProfileTopbar from './ProfileTopbar.container';

const profile = {
  tags: [
    {label: 'Agatha Cristie'},
    {label: 'Mørk'},
    {label: 'Filosofisk'},
    {label: 'Middelalder'},
    {label: 'Charmerende'}
  ],
  recommendations: [
    {pid: '870970-basis:52038014'},
    {pid: '870970-basis:52530423'},
    {pid: '870970-basis:52387078'},
    {pid: '870970-basis:52939321'},
    {pid: '870970-basis:51591046'},
    {pid: '870970-basis:52788226'}
  ]
};

class ProfilePage extends React.Component {

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <div className='profile-page'>
        <ProfileTopbar profile={profile}/>
        <div className='profile-page-content'>
          {/**/}
        </div>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  () => {
    return {};
  }
)(ProfilePage);
