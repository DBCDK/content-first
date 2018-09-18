import React from 'react';
import Icon from '../base/Icon';
import SkeletonUser from '../base/Skeleton/User';
import Heading from '../base/Heading';

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
      <div
        className={`profile-${type} d-flex ${
          namePosition === 'right' ? 'flex-row' : 'flex-column'
        } ${className}`}
      >
        <span
          className="profile-image text-center small round"
          style={{
            width: size + 'px',
            height: size + 'px',
            lineHeight: user && user.image ? 'inherit' : size * 1.85 + 'px',
            ...style
          }}
        >
          {user && user.image ? (
            this.state.imageIsLoading ? (
              <SkeletonUser pulse={true}>
                <img
                  className="d-none"
                  src={'/v1/image/' + user.image + '/' + size + '/' + size}
                  onLoad={() => this.imageIsLoaded()}
                />
              </SkeletonUser>
            ) : (
              <img
                className="cover"
                src={'/v1/image/' + user.image + '/' + size + '/' + size}
                alt={user.name}
              />
            )
          ) : (
            <Icon
              name="face"
              style={{
                width: size + 'px',
                height: size + 'px',
                lineHeight: size + 'px',
                fontSize: size * 0.65 + 'px',
                display: 'block',
                backgroundColor: '#e9eaeb',
                borderRadius: '50%'
              }}
            />
          )}
        </span>
        {user && !namePosition === false ? (
          <Heading tag="h4" type="title" className="ml-3">
            {user.name}
          </Heading>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ProfileImage;
