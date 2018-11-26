import React from 'react';
import {connect} from 'react-redux';
import Icon from '../Icon';
import Text from '../Text';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import './Pin.css';

const Pin = ({
  Tag = 'h1',
  type = 'title3',
  active = false,
  text = false,
  className = '',
  onClick,
  isLoggedIn,
  requireLogin,
  ...props
}) => {
  const status = active ? 'active' : 'default';

  return (
    <div
      className={`Pin Pin__${status} ${className}`}
      onClick={isLoggedIn ? onClick : requireLogin}
      {...props}
    >
      <Icon name="flag" />
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

export const mapDispatchToProps = dispatch => ({
  requireLogin: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'login',
      context: {
        title: 'GEM SØGNING TIL FORSIDE',
        reason: 'Du skal logge ind for at kunne gemme din søgning til forsiden.'
      }
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pin);
