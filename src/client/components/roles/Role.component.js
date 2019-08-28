import React from 'react';
import {connect} from 'react-redux';

export const ADMIN_ROLE = 'contentFirstAdmin';
export const EDITOR_ROLE = 'contentFirstEditor';

export function Role(props) {
  const getUserRoles = () =>
    Array.isArray(props.roles)
      ? props.roles.map(element => element.machineName)
      : [];

  const isAccessAllowed = requiredRoles => {
    if (typeof requiredRoles === 'string') {
      return getUserRoles().includes(requiredRoles);
    } else if (Array.isArray(requiredRoles)) {
      for (let role in getUserRoles()) {
        if (requiredRoles.includes(role)) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <React.Fragment>
      {isAccessAllowed(props.requiredRoles) ? props.children : false}
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {roles: state.userReducer.roles};
};

export const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Role);
