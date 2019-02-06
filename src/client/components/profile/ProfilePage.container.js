import React from 'react';
import {connect} from 'react-redux';
import ProfileImage from '../general/ProfileImage.component';
import Link from '../general/Link.component';
import Lists from '../list/overview/Lists.container';
import Follow from '../follow/Follow.component';
import T from '../base/T';

export class ProfilePage extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row tl m-0">
          <div className="col-3">
            {this.props.user.isLoggedIn ? (
              <div className="tc mt3">
                <ProfileImage
                  user={this.props.user}
                  size={'60'}
                  namePosition={'bottom'}
                />
                <Link className="small link-subtle" href="/profile/rediger">
                  <T component="general" name="edit" />
                </Link>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="col-9">
            <h1 className="headline">
              <T component="list" name="yourListsTitle" />
            </h1>
            <div className="profile-lists">
              <Lists />
            </div>
            <div className="profile-follow">
              <Follow />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  user: state.userReducer
});
export default connect(mapStateToProps)(ProfilePage);
