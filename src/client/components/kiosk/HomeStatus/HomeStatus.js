import React from 'react';
import Kiosk from '../../base/Kiosk/Kiosk';
import {withHoldings} from '../../hoc/Holding/withHoldings.hoc';
import T from '../../base/T';
import Text from '../../base/Text';

import './HomeStatus.css';

const homeStatusInfo = holdings => {
  if (holdings.find(book => book.onShelf)) {
    return {color: 'green', text: 'onShelf'};
  }
  if (holdings.find(book => book.notForLoan)) {
    return {color: 'yellow', text: 'notForLoan'};
  }
  if (holdings.find(book => book.onLoan)) {
    return {color: 'red', text: 'onLoan'};
  }
  return {color: 'red', text: 'notAvailable'};
};

const HomeStatusComponent = ({icon, color, text}) => {
  return (
    <span className="home-status-indicator">
      <i className={'material-icons ' + color}>{icon}</i>
      <Text>
        <T component="homeStatus" name={text} />
      </Text>
    </span>
  );
};

const HomeStatusWithHoldings = withHoldings(props => {
  const {holdings} = props;
  if (!holdings || holdings.isFetching) {
    return null;
  }
  const {color, text} = homeStatusInfo(holdings.holdings);
  return (
    <HomeStatusComponent icon="fiber_manual_record" color={color} text={text} />
  );
});

const HomeStatus = props => (
  <Kiosk
    {...props}
    render={({kiosk}) => {
      if (!kiosk.enabled) {
        return null;
      }
      return (
        <HomeStatusWithHoldings
          agencyId={kiosk.configuration ? kiosk.configuration.agencyId : ''}
          branch={kiosk.configuration ? kiosk.configuration.branch : ''}
          {...props}
        />
      );
    }}
  />
);

export default HomeStatus;
