import React from 'react';
import withPermissions from '../hoc/Permissions';

/**

  Permissions component usage

  <Permisisons name="TheNameOfYourComponent">
    <YourComponent />
  </Permisisons>

  props Options

  @param {string} name {required}
  @param {obj} context premium + login modal context (same context for both)
  @param {obj} modals individual modal context settings

  modals object exmaple:

  modals:  {
    login {title: 'only login modal will have this title', reason: '...'}
    premium {title: '...', reason, '....'}
  }

  Set permissions for your component in the hoc/Permissions/permissions.json file

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

export function Permissions({children}) {
  return <React.Fragment>{children}</React.Fragment>;
}

export default withPermissions(Permissions);
