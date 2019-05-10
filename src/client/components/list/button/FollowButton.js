import React from 'react';
import {connect} from 'react-redux';
import {getListByIdSelector, CUSTOM_LIST} from '../../../redux/list.reducer';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import T from '../../base/T';

import {withFollow} from '../../hoc/Follow';

const getListById = getListByIdSelector();

export const FollowButton = ({
  disabled = false,
  allowFollow,
  isLoggedIn,
  isFollowing,
  follow,
  unFollow,
  requireLogin,
  className,
  style
}) => {
  if (!allowFollow) {
    return null;
  }
  return (
    <Button
      className={className}
      disabled={disabled}
      type="link2"
      style={{
        color: isFollowing ? 'var(--de-york)' : 'var(--petroleum)',
        textDecoration: 'none',
        ...style
      }}
      onClick={() => {
        if (!isLoggedIn) {
          return requireLogin();
        }
        if (isFollowing) {
          return unFollow();
        }
        return follow();
      }}
    >
      <span className="align-middle">
        <Icon name="playlist_add" className="mr-1 align-middle" />
        <T
          component="list"
          name={isFollowing ? 'followingList' : 'followList'}
        />
      </span>
    </Button>
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    allowFollow: list.type === CUSTOM_LIST,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};
export const mapDispatchToProps = dispatch => ({
  requireLogin: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'login',
      context: {
        title: <T component="list" name={'followList'} />,
        reason: <T component="list" name={'loginFollowModalDescription'} />
      }
    });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFollow(FollowButton));
