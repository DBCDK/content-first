import React from 'react';
import Button from '../../base/Button';
import T from '../../base/T';

import withPermissions from '../../hoc/Permissions';

const PrintButton = ({
  style,
  onClick = false,
  className,
  _id = 'huskeliste'
}) => {
  return (
    <Button
      size="large"
      type="link2"
      iconLeft="print"
      className={'pr-0 ' + className}
      onClick={e => {
        if (onClick) {
          onClick(e);
        } else {
          window.open(`/print/${_id}`, '_blank');
        }
      }}
      style={{backgroundColor: 'unset', marginLeft: '10px', ...style}}
    >
      <T component="list" name="printList" />
    </Button>
  );
};

export default withPermissions(PrintButton, {
  name: 'PrintButton',
  context: {
    title: 'Udskriv liste'
  }
});
