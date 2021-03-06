import React from 'react';
import {useSelector} from 'react-redux';
import {get} from 'lodash';
import Button from '../base/Button';
import Icon from '../base/Icon';
import T from '../base/T';
import Spinner from '../general/Spinner/Spinner.component';
import {withWork} from '../hoc/Work';
import withPermisisons, {ORDER_CONTEXT} from '../hoc/Permissions';
import Kiosk from '../base/Kiosk/Kiosk';

import './orderButton.css';
import FindBookButton from '../kiosk/WayFinder/FindBookButton';

export function OrderButton(props) {
  // Check if loan button should use lookupUrl
  const shouldUseLookupUrl = useSelector(state =>
    get(state, 'userReducer.shouldUseLookupUrl', false)
  );

  // lookupUrl
  const lookupUrl = useSelector(state =>
    get(state, 'userReducer.lookupUrl', false)
  );

  // OrderButton default state:
  const orderState = (state => {
    switch (state) {
      // Ordered button state
      case 'ordered':
        return {
          class: 'success',
          label: <T component="order" name="orderDone" />
        };

      // Order in progres
      case 'ordering':
        return {
          class: 'progress',
          label: (
            <React.Fragment>
              <Spinner className="mr-1" size={14} color={'var(--petroleum)'} />
              <T component="order" name="orderInProgress" />
            </React.Fragment>
          )
        };

      // Error while ordering
      case 'error':
        return {
          class: 'progress',
          label: <T component="order" name="orderError" />
        };

      // default order state
      default:
        return {
          class: '',
          label: (
            <React.Fragment>
              <Icon name={props.icon} />
              {props.children || props.label}
            </React.Fragment>
          )
        };
    }
  })(props.orderState);

  // If physical book does NOT exist in the work collection
  if (!props.collectionContainsBook()) {
    return null;
  }

  return (
    <Kiosk
      render={({kiosk}) => {
        if (kiosk.enabled) {
          return <FindBookButton pid={props.pid} />;
        }
        return (
          <Button
            className={`orderButton ${orderState.class} ${props.className}`}
            type={props.type}
            size={props.size}
            iconLeft={props.iconLeft}
            iconRight={props.iconRight}
            onClick={
              shouldUseLookupUrl
                ? () => window.open(`${lookupUrl}${props.pid}`, '_blank')
                : props.onClick || props.order
            }
            dataCy="order-btn"
          >
            {orderState.label}
          </Button>
        );
      }}
    />
  );
}

export default withPermisisons(
  withWork(OrderButton, {
    includeCollection: true
  }),
  ORDER_CONTEXT
);
