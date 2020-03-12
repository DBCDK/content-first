import React from 'react';
import Button from '../base/Button';
import T from '../base/T';
import withPermisisons, {ORDER_CONTEXT} from '../hoc/Permissions';

const OrderAllButton = props => {
  return '';
  /*(
  <Button
    size="medium"
    type="quaternary"
    className="orderAllBtn"
    data-cy="orderAllButton"
    {...props}
  >
    <T component="shortlist" name="shortlistOrder" />
  </Button>
  )*/};

export default withPermisisons(OrderAllButton, ORDER_CONTEXT);
