import React from 'react';
import withPermissions from '../hoc/Permissions';

export function Permissions({name, children}) {
  return <React.Fragment>{children}</React.Fragment>;
}

export default withPermissions(Permissions);
