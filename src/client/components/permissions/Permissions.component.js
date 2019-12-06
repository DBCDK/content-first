import React from 'react';

import withPermissions from '../hoc/Permissions';

// import permissions from '../hoc/Permissions/permissions.json';

export function Permissions({name, children}) {
  // export default Permissions => props => {
  // const {name, children} = props;

  console.log('## Permissions => name', name);

  return (
    <WrappedWithPermissions name={name}>{children}</WrappedWithPermissions>
  );
}

const WrappedWithPermissions = props => {
  console.log('## WrappedWithPermissions => props', props);
  return withPermissions(Permissions, props.name)(props);
};

// export default withPermissions(Permissions, componentName);
export default Permissions;
