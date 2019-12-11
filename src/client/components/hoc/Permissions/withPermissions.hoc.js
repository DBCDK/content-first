import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';

import Kiosk from '../../base/Kiosk/Kiosk';

import {loadKiosk} from '../../../redux/kiosk.thunk';
import {OPEN_MODAL} from '../../../redux/modal.reducer';

import permissions from './permissions.json';

function getUserRoles(roles) {
  return roles.map(role => role.machineName);
}

const defaultPremiumContext = {
  title: 'Du har desværre ikke adgang',
  reason: 'Indholdet er ikke tilgængeligt for dit bibliotek'
};

const defaultLoginContext = {
  title: 'Login',
  reason: 'Login for at se om dit bibliotek har adgang til dette indhold'
};

/**

  Permissions.hoc usage example:

  export default withPermissions(YourComponent, Options);

  Options parameters
  @param {string} name {required}
  @param {obj} context premium + login modal context (same context for both)
  @param {obj} modals individual modal context settings

 Options example:
    {
      name: 'YourComponentName',

    -- set context like this --

      context: {
        title: 'all prompted modals will have this title',
        reason: 'all prompted modals will have this description'
      },

    -- or this --

      modals:  {
        login: {
          context: {title: 'only login modal will have this title', reason: '...'}
        },
        premium: {
          context: {title: '...', reason: '....'}
        }
      }

    }

  Set permissions for your component in the /permissions.json file

  Permissions object in permissions.json example:

  "YourComponentName": {
    "free": false,
    "premium": true,
    "kiosk": false,
    "role": {
      "contentFirstAdmin": false,
      "contentFirstEditor": false
    }
  }

**/

export default (WrappedComponent, ComponentOptions) => props => {
  /* Get the name of the wrapped component, this name is used to
  get the component options from the permissions.json object. */
  const name = get(ComponentOptions, 'name', false) || props.name;

  /* If user is denied acces to a premium functionality,
    they will be prompted with a modal. content of the
    modal is given by the premium context */
  const premiumContext =
    get(ComponentOptions, 'context', false) ||
    get(ComponentOptions, 'modals.premium.context', false) ||
    get(props, 'premium.context', false);

  /* If user is denied acces to a logged-in-user functionality,
      they will be prompted with a modal. content of the
      modal is given by the login context */
  const loginContext =
    get(ComponentOptions, 'context', false) ||
    get(ComponentOptions, 'modals.login.context', false) ||
    get(props, 'login.context', false);

  const dispatch = useDispatch();

  // Kiosk
  const kioskState = useSelector(state => get(state, 'kiosk', false));

  // Premium
  const isPremium = useSelector(state =>
    get(state, 'userReducer.isPremium', false)
  );

  const isLoggedIn = useSelector(state =>
    get(state, 'userReducer.isLoggedIn', false)
  );

  // Roles
  const roles = useSelector(state => get(state, 'userReducer.roles', []));

  const isAdmin = getUserRoles(roles).includes('contentFirstAdmin');
  const isEditor = getUserRoles(roles).includes('contentFirstEditor');

  // Get component Permissions
  const p = permissions[name];

  // If no name or settings is found for the wrapped component
  if (!p) {
    return <WrappedComponent {...props} />;
  }

  // If Kioskmode is enabled and allowed - return component without further checks.
  if (kioskState.enabled) {
    // const agency = get(kiosk, 'configuration.agencyId', false);
    // const branch = get(kiosk, 'configuration.branch', false);

    // Get kiosk configuration if not loaded
    if (!kioskState.loaded) {
      dispatch(loadKiosk());
    }

    // Return
    if (p.kiosk) {
      // if (p.kiosk && agency && branch) {
      // return <WrappedComponent {...props} />;
      return (
        <Kiosk
          render={({kiosk}) => <WrappedComponent kiosk={kiosk} {...props} />}
        />
      );
    }
  }

  // If permission is allowed on a free plan.
  if (p.free) {
    return <WrappedComponent {...props} />;
  }

  // Checks, which is only available if user is logged in
  if (isLoggedIn) {
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

    // If component has premium options set
    if (premiumContext) {
      // Promt the user with a premium-only modal
      return (
        <WrappedComponent
          {...props}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            dispatch({
              type: OPEN_MODAL,
              modal: 'confirm',
              context: {
                ...defaultPremiumContext,
                ...premiumContext,
                className: 'premium-modal',
                hideCancel: true
              }
            });
          }}
        />
      );
    }
  }

  if (!isLoggedIn && p.premium) {
    return (
      <WrappedComponent
        {...props}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          dispatch({
            type: OPEN_MODAL,
            modal: 'login',
            context: {
              ...defaultLoginContext,
              ...loginContext
            }
          });
        }}
      />
    );
  }

  return null;
};
