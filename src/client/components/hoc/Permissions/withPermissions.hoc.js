import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';

import Kiosk from '../../base/Kiosk/Kiosk';
import ConfirmModal from '../../modals/ConfirmModal.component';

import {loadKiosk} from '../../../redux/kiosk.thunk';
import {OPEN_MODAL, CLOSE_MODAL} from '../../../redux/modal.reducer';

import permissions from './permissions.json';

function getUserRoles(roles) {
  return roles.map(role => role.machineName);
}

export default (WrappedComponent, ComponentOptions) => props => {
  const name = get(ComponentOptions, 'ComponentName', false) || props.name;

  console.log('name', name);

  const dispatch = useDispatch();

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

  if (name !== 'CompareButton') {
    console.log('p', name, p);
  }
  // If no name or settings is found for the wrapped component
  if (!p) {
    return <WrappedComponent {...props} />;
  }

  // If Kioskmode is enabled and allowed - return component without further checks.
  if (kiosk.enabled) {
    // const agency = get(kiosk, 'configuration.agencyId', false);
    // const branch = get(kiosk, 'configuration.branch', false);

    // Get kiosk configuration if not loaded
    if (!kiosk.loaded) {
      dispatch(loadKiosk());
    }

    // Return
    if (p.kiosk) {
      // if (p.kiosk && agency && branch) {
      // return <WrappedComponent {...props} />;
      return <Kiosk render={({kiosk}) => <WrappedComponent {...props} />} />;
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

  // If component has a onDenied option
  if (p.onDenied) {
    // Promt the user with a premium-only modal
    if (p.onDenied === 'prompt-premium') {
      return (
        <WrappedComponent
          {...props}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            console.log('i was clicked');
            dispatch({
              type: OPEN_MODAL,
              modal: 'confirm',
              context: {
                title: 'Premium indhold',
                reason:
                  'Indholdet er desværre kun tilgængeligt for betalende biblioteker',
                hideCancel: true
              }
            });
          }}
        />
      );
    }
  }

  return null;
};
