import React from 'react';
import {connect} from 'react-redux';
import Icon from '../Icon';
import Text from '../Text';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import './Pin.css';

const Pin = ({
  active = false,
  text = false,
  icon = 'flag',
  className = '',
  onClick,
  isLoggedIn,
  requireLogin,
  notLoggedIncontext, // eslint-disable-line no-unused-vars
  ...props
}) => {
  const status = active ? 'active' : 'default';

  return (
    <div
      className={`Pin Pin__${status} ${className}`}
      onClick={isLoggedIn ? onClick : requireLogin}
      {...props}
    >
      <Icon name={icon} />
      {text && (
        <Text className="m-0 ml-2 align-self-center" type="small">
          {text}
        </Text>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

export const mapDispatchToProps = (dispatch, ownProps) => {
  const context = ownProps.notLoggedIncontext;

  return {
    requireLogin: () => {
      dispatch({
        type: OPEN_MODAL,
        modal: 'login',
        context
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pin);
