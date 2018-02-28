import React from 'react';

const CommentUserImage = ({size = '35', user, style}) => {
  return (
    <span
      className="profile-image small round"
      style={{...style, width: `${size}px`, height: `${size}px`}}
    >
      {user.image ? (
        <img
          className="cover"
          src={`/v1/image/${user.image}/200/200`}
          alt={user.name}
        />
      ) : (
        <span
          className="glyphicon glyphicon-user"
          style={{fontSize: `${size / 2}px`}}
        />
      )}
    </span>
  );
};

export default CommentUserImage;
