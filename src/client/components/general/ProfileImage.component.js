import React from 'react';

/*
<ProfileImage user={user} />

// namePosition: false (default) || 'bottom' || 'right'
*/

export const ProfileImage = ({
  user,
  type = 'card',
  className = '',
  size = '35',
  namePosition = false,
  style = {}
}) => (
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
        <img
          className="cover"
          src={'/v1/image/' + user.image + '/' + size + '/' + size}
          alt={user.name}
        />
      ) : (
        <span
          className="glyphicon glyphicon-user"
          style={{
            fontSize: size * 0.85 + 'px',
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

export default ProfileImage;
