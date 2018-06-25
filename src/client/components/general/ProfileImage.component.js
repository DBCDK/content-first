import React from 'react';
import Icon from '../base/Icon';
import User from '../base/Skeleton/User';

/*
<ProfileImage user={user} />

// namePosition: false (default) || 'bottom' || 'right'
*/

class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imageIsLoading: true, tekstIsLoading: true};
  }

  imageIsLoaded() {
    this.setState({imageIsLoading: false});
  }

  render() {
    const {
      user,
      type = 'card',
      className = '',
      size = '35',
      namePosition = false,
      style = {}
    } = this.props;

    return (
      <div className={`profile-${type} ${className}`}>
        <span
          className="profile-image text-center small round"
          style={{
            width: size + 'px',
            height: size + 'px',
            lineHeight: user && user.image ? 'inherit' : size * 1.85 + 'px',
            marginRight:
              namePosition === 'right'
                ? style.marginRight ? style.marginRight : '5px'
                : '',
            ...style
          }}
        >
          {user && user.image ? (
            this.state.imageIsLoading ? (
              <User pulse={true}>
                <img
                  className="hidden"
                  src={'/v1/image/' + user.image + '/' + size + '/' + size}
                  onLoad={() => this.imageIsLoaded()}
                />
              </User>
            ) : (
              <img
                className="cover"
                src={'/v1/image/' + user.image + '/' + size + '/' + size}
                alt={user.name}
              />
            )
          ) : (
            <Icon
              name="glyphicon glyphicon-user"
              style={{
                fontSize: size * 0.65 + 'px',
                display: 'inline-block',
                color: '#897571'
              }}
            />
          )}
        </span>
        {user && !namePosition === false ? (
          <h4 className="profile-name t-body h4 mt0 mb0">{user.name}</h4>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ProfileImage;
