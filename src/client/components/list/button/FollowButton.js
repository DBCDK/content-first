import React from 'react';
import {connect} from 'react-redux';
import {getListByIdSelector, CUSTOM_LIST} from '../../../redux/list.reducer';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {FOLLOW, UNFOLLOW} from '../../../redux/follow.reducer';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
const getListById = getListByIdSelector();

export const FollowButton = ({
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
      style={style}
      type="link2"
      style={{
        color: isFollowing ? 'var(--de-york)' : 'var(--petrolium)'
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
      <Icon name="visibility" className="align-middle" />
      <span className="align-middle ml-2">Følg liste</span>
    </Button>
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    allowFollow: list.type === CUSTOM_LIST,
    isFollowing: state.followReducer[ownProps._id],
    isLoggedIn: state.userReducer.isLoggedIn
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  follow: () =>
    dispatch({
      type: FOLLOW,
      id: ownProps._id,
      cat: 'list'
    }),
  unFollow: () => {
    dispatch({
      type: UNFOLLOW,
      id: ownProps._id
    });
  },
  requireLogin: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'login',
      context: {
        title: 'FØLG LISTE',
        reason: 'Du skal logge ind for at følge en liste.'
      }
    });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowButton);