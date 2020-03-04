import React from 'react';
import {connect} from 'react-redux';
import {getListByIdSelector} from '../../../redux/list.reducer';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import Button from '../../base/Button';
import Icon from '../../base/Icon';
import T from '../../base/T';
const getListById = getListByIdSelector();

export const AddBookButton = ({
  allowAdd,
  isLoggedIn,
  requireLogin,
  onClick,
  style,
  className
}) => {
  if (!allowAdd) {
    return null;
  }
  return (
    <Button
      className={className}
      style={style}
      type="link2"
      onClick={() => {
        if (!isLoggedIn) {
          return requireLogin();
        }
        onClick();
      }}
    >
      <Icon name="add" className="align-middle" />
      <span className="align-middle ml-2">
        <T component="general" name="addABook" />
      </span>
    </Button>
  );
};

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});
  return {
    allowAdd: list.open || list.owner === state.userReducer.openplatformId,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};
export const mapDispatchToProps = dispatch => ({
  requireLogin: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'login',
      context: {
        title: <T component="login" name="modalTitle" />,
        reason: <T component="login" name="modalDescription" />
      }
    });
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(AddBookButton);
