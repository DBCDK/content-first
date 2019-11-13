import React from 'react';
import Kiosk from '../../base/Kiosk/Kiosk';
import {withHoldings} from '../../hoc/Holding/withHoldings.hoc';
import Button from '../../base/Button';
import T from '../../base/T';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {useDispatch} from 'react-redux';
import {RAW} from '../../general/Notification/Notification.component';
import Text from '../../base/Text';
import Title from '../../base/Title';

import './FindBookButton.css';

const formatWay = book =>
  book.department +
  (book.location ? ' > ' + book.location : '') +
  (book.subLocation ? ' > ' + book.subLocation : '');

const fetchWaysFromHoldings = holdings => {
  const filteredAndFormattedHoldings = holdings.holdings
    .filter(book => book.onShelf || book.notForLoan)
    .map(book => formatWay(book));
  return [...new Set(filteredAndFormattedHoldings)]; // Do also filter out duplicates
};

const wayFinderBox = (dispatch, holdings) => {
  openWayFinderModal(
    dispatch,
    T({component: 'wayFinder', name: 'findBook'}),
    <div>
      <Text type="large" className="wayFinder__modal--subtitle">
        <T component="wayFinder" name="theBookIsHere" />
      </Text>
      <div className="wayFinder__modal--wayfinder-list">
        {fetchWaysFromHoldings(holdings).map(way => (
          <Title key={way} type="title4">
            {way}
          </Title>
        ))}
      </div>
    </div>
  );
};

const isBookInLibrary = holdings =>
  typeof holdings.holdings.find(book => book.onShelf || book.notForLoan) !==
  'undefined';

const openWayFinderModal = (dispatch, title, ways) => {
  dispatch({
    type: OPEN_MODAL,
    modal: 'notification',
    context: {
      notificationType: RAW,
      title: title.toUpperCase(),
      text: ways,
      cause: '',
      hideCancel: true,
      hideConfirm: false,
      doneText: T({component: 'general', name: 'close'}),
      cancelText: T({component: 'general', name: 'cancel'}),
      onCancel: () => {
        dispatch({
          type: 'CLOSE_MODAL',
          modal: 'notification'
        });
      }
    }
  });
};

const FindBookButtonWithHoldings = withHoldings(props => {
  const {holdings} = props;
  const dispatch = useDispatch();
  if (!holdings || holdings.isFetching || !isBookInLibrary(holdings)) {
    return (
      <Button
        size="medium"
        type="quaternary"
        iconLeft="chrome_reader_mode"
        disabled={true}
        {...props}
      >
        <T component="wayFinder" name="findBook" />
      </Button>
    );
  }
  return (
    <Button
      size="medium"
      type="quaternary"
      iconLeft="chrome_reader_mode"
      {...props}
      onClick={() => wayFinderBox(dispatch, holdings)}
    >
      <T component="wayFinder" name="findBook" />
    </Button>
  );
});

const FindBookButton = props => (
  <Kiosk
    {...props}
    render={({kiosk}) => {
      return (
        <FindBookButtonWithHoldings
          agencyId={
            kiosk.enabled && kiosk.configuration
              ? kiosk.configuration.agencyId
              : ''
          }
          branch={
            kiosk.enabled && kiosk.configuration
              ? kiosk.configuration.branch
              : ''
          }
          {...props}
        />
      );
    }}
  />
);

export default FindBookButton;
