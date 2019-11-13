import React from 'react';
import Button from '../base/Button';
import Icon from '../base/Icon';
import T from '../base/T';
import Spinner from '../general/Spinner/Spinner.component';
import {withWork} from '../hoc/Work';
import Kiosk from '../base/Kiosk/Kiosk';

import './orderButton.css';
import FindBookButton from '../kiosk/WayFinder/FindBookButton';

export function OrderButton(props) {
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
          return <FindBookButton {...props} className="find-book-button" />;
        }
        return (
          <Button
            className={`orderButton ${orderState.class} ${props.className}`}
            type={props.type}
            size={props.size}
            iconLeft={props.iconLeft}
            iconRight={props.iconRight}
            onClick={props.order}
            dataCy="order-btn"
          >
            {orderState.label}
          </Button>
        );
      }}
    />
  );
}

export default withWork(OrderButton, {
  includeCollection: true
});
