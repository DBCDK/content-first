import React from 'react';
import {connect} from 'react-redux';
import ProfileImage from '../general/ProfileImage.component';
import Link from '../general/Link.component';
import Lists from '../list/Lists.container';

export class ProfilePage extends React.Component {
  render() {
    return (
      <div className="rows tl raleway">
        <div className="col-xs-3">
          {this.props.user.isLoggedIn ? (
            <div className="tc mt3">
              <ProfileImage
                size="60px"
                src={`/v1/image/${this.props.user.image}/200/200`}
                name={this.props.user.name}
              />
              <Link className="small link-subtle" href="/profile/rediger">Redigér</Link>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="col-xs-9">
          <h1 className="headline mb2">Dine Lister</h1>
          <Lists />
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  user: state.userReducer
});
export default connect(mapStateToProps)(ProfilePage);
