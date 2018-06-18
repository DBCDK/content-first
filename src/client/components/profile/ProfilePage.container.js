import React from 'react';
import {connect} from 'react-redux';
import ProfileImage from '../general/ProfileImage.component';
import Link from '../general/Link.component';
import Lists from '../list/Lists.container';
import Follow from '../follow/Follow.component';

export class ProfilePage extends React.Component {
  render() {
    return (
      <div className="rows tl raleway">
        <div className="col-xs-3">
          {this.props.user.isLoggedIn ? (
            <div className="tc mt3">
              <ProfileImage
                user={this.props.user}
                size={'60'}
                namePosition={'bottom'}
              />
              <Link className="small link-subtle" href="/profile/rediger">
                Redigér
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="col-xs-9">
          <h1 className="headline mb5">Dine Lister</h1>
          <div className="profile-lists">
            <Lists />
          </div>
          <div className="profile-follow">
            <Follow />
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
