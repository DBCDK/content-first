import React from 'react';
import {connect} from 'react-redux';

export const ADMIN_ROLE = 'contentFirstAdmin';
export const EDITOR_ROLE = 'contentFirstEditor';

export function Role({roles, requiredRoles, children, onAccessDenied}) {
  const onAccessDeniedCode =
    typeof onAccessDenied === 'undefined' ? false : onAccessDenied;

  const getUserRoles = () =>
    Array.isArray(roles) ? roles.map(element => element.machineName) : [];

  const isAccessAllowed = reqRoles => {
    if (typeof reqRoles === 'string') {
      return getUserRoles().includes(reqRoles);
    } else if (Array.isArray(reqRoles)) {
      const foundRole = getUserRoles().find(role => reqRoles.includes(role));
      return typeof foundRole !== 'undefined';
    }
    return false;
  };

  if (isAccessAllowed(requiredRoles)) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return onAccessDeniedCode;
}

const mapStateToProps = state => {
  return {roles: state.userReducer.roles};
};

export const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Role);
