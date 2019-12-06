import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';

import permissions from './permissions.json';

function getUserRoles(roles) {
  return roles.map(role => role.machineName);
}

export default (WrappedComponent, name) => props => {
  console.log('withPermissions.hoc ............');
  console.log('withPermissions.hoc => name', name);
  console.log('withPermissions.hoc => props', props);

  // Kiosk
  const kiosk = useSelector(state => get(state, 'kiosk', false));

  // Premium
  const isPremium = useSelector(state =>
    get(state, 'userReducer.isPremium', false)
  );

  // Roles
  const roles = useSelector(state => get(state, 'userReducer.roles', []));

  const isAdmin = getUserRoles(roles).includes('contentFirstAdmin');
  const isEditor = getUserRoles(roles).includes('contentFirstEditor');

  // Get component Permissions
  const p = permissions[name];

  if (name === 'EditorpageButton') {
    console.log('## withPermissions.hoc => p', p);
  }

  // If Kioskmode is enabled and allowed - return component without further checks.
  if (kiosk.enabled) {
    const agency = get(kiosk, 'configuration.agencyId', false);
    const branch = get(kiosk, 'configuration.branch', false);
    if (p.kiosk && agency && branch) {
      return <WrappedComponent {...props} />;
    }
  }

  // If permission is allowed on a free plan.
  if (p.free) {
    return <WrappedComponent {...props} />;
  }

  // If user has a paying library (Premium access)
  if (p.premium && isPremium) {
    return <WrappedComponent {...props} />;
  }

  // if user has a editor role
  if (p.role.contentFirstEditor && isEditor) {
    return <WrappedComponent {...props} />;
  }

  // if user has an admin role
  if (p.role.contentFirstAdmin && isAdmin) {
    return <WrappedComponent {...props} />;
  }

  return null;
};
