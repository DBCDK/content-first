import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  ON_SHORTLIST_REMOVE_ELEMENT,
  SHORTLIST_UPDATE_ORIGIN,
  SHORTLIST_CLEAR
} from '../../../redux/shortlist.reducer';
import {ORDER} from '../../../redux/order.reducer';
import BookCover from '../../general/BookCover/BookCover.component';
import PrintButton from '../button/PrintButton';
import OrderButton from '../../order/OrderButton.component';
import Link from '../../general/Link.component';
import Head from '../../base/Head';
import Title from '../../base/Title';
import Text from '../../base/Text';
import T from '../../base/T';
import Icon from '../../base/Icon';
import Divider from '../../base/Divider';
import Button from '../../base/Button';
import Banner from '../../base/Banner';
import {withWork} from '../../hoc/Work';
import AddToListButton from '../../general/AddToListButton/AddToListButton.component';
import OrderAllButton from '../../order/OrderAllButton.component';
import Origin from '../../base/Origin';
import SkeletonText from '../../base/Skeleton/Text';

import './ShortList.css';

export class ShortListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.origin
    };
  }

  render() {
    const {
      work,
      pid,
      isKiosk,
      origin,
      onRemove,
      className = '',
      hasValidCollection,
      filterCollection,
      newRelease
    } = this.props;
    if (!work) {
      return null;
    }

    const url = `/værk/${pid}`;

    // get collections including ereolen
    const collection = filterCollection();
    const orderBookButton = hasValidCollection() && (
      <OrderButton
        pid={pid}
        size="medium"
        type="quaternary"
        iconLeft="chrome_reader_mode"
      >
        <T component="general" name="book" />
      </OrderButton>
    );

    const orderElectronicBookButtons =
      hasValidCollection() &&
      collection
        .filter(col => col.count === 1)
        .map(col => {
          return (
            <Button
              size="medium"
              type="quaternary"
              iconLeft={col.icon}
              className={'ml-2 ' + col.type}
              key={col.url}
              href={col.url}
            >
              {col.type}
            </Button>
          );
        });

    return (
      <div>
        <div className={`shortlist__item ${className}`}>
          <Icon name="clear" className="remove-btn" onClick={onRemove} />
          <Link href={url}>
            <BookCover pid={work.book.pid} />
          </Link>
          <div className="shortlist__item--details">
            <Title Tag="h1" type="title5">
              {work.book.title}
            </Title>

            <Text type="body">{work.book.creator}</Text>

            {!isKiosk && <Origin componentData={origin} />}

            <div className="shortlist__item--actions">
              {!isKiosk && <AddToListButton work={work} />}
              {isKiosk && (
                <div className="shortlist__item--devices">
                  {work.collectionHasLoaded ? (
                    <React.Fragment>
                      {this.props.collectionContainsBook() && (
                        <div className="type">
                          <Icon name="chrome_reader_mode" />
                          <Text type="body" variant="weight-semibold">
                            BOG
                          </Text>
                        </div>
                      )}
                      {this.props.collectionContainsEBook() && (
                        <div className="type">
                          <Icon name="language" />
                          <Text type="body" variant="weight-semibold">
                            EBOG
                          </Text>
                        </div>
                      )}
                      {this.props.collectionContainsAudioBook() && (
                        <div className="type">
                          <Icon name="headset" />
                          <Text type="body" variant="weight-semibold">
                            LYDBOG
                          </Text>
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <SkeletonText
                      className="book-types-skeleton Skeleton__Pulse"
                      lines="1"
                    />
                  )}{' '}
                </div>
              )}
              <div className="shortlist__item--loan">
                {!isKiosk && (
                  <Text type="body" className="loanTitle">
                    <T component="work" name="loanTitle" />
                  </Text>
                )}
                {orderBookButton}
                {!isKiosk && orderElectronicBookButtons}
              </div>
            </div>

            {work.collectionHasLoaded && !hasValidCollection() && (
              <Text type="body">
                <T
                  component="work"
                  name={
                    newRelease() ? 'noValidCollectionYet' : 'noValidCollection'
                  }
                />
              </Text>
            )}
          </div>
        </div>

        <Divider />
      </div>
    );
  }
}

const ShortListItemWithWork = withWork(ShortListItem, {
  includeReviews: false,
  includeCollection: true,
  includeCover: true
});

export class ShortList extends React.Component {
  render() {
    const {
      orderAll,
      orderList,
      isKiosk,
      shortListState,
      clearList,
      remove,
      originUpdate,
      shouldUseLookupUrl
    } = this.props;
    const {elements, hasLoaded} = shortListState;
    if (!hasLoaded) {
      return null;
    }

    const scrollableClass = elements.length > 3 ? 'scrollable' : '';
    const isEmpty = !!(elements.length === 0);

    return (
      <React.Fragment>
        <Head
          title="Huskeliste"
          description="Gem bøger på din huskeliste mens du går på opdagelse. Så kan du nemmere vælge en bog, der giver dig den helt rigtige læseoplevelse."
          canonical="/huskeliste"
          og={{
            'og:url': 'https://laesekompas.dk/huskeliste'
          }}
        />

        <Banner
          color={!isKiosk ? '#81c793' : '#f3f3f3'}
          textColor={!isKiosk ? 'white' : 'petroleum'}
          className="fixed-width-col-md position-relative text-uppercase"
          title={
            !isKiosk ? T({component: 'shortlist', name: 'title'}) : 'Huskeliste'
          }
        />

        <div className="shortlist--wrap">
          <div className="shortlist__tools--top">
            {!isKiosk && <PrintButton className="printListBtn" />}
            <Button
              className="clearList"
              disabled={isEmpty}
              size="medium"
              type="quaternary"
              iconLeft="delete"
              onClick={() => clearList()}
            >
              <T component="shortlist" name="shortlistClear" />
            </Button>
          </div>

          <div className={`shortlist__items--container ${scrollableClass}`}>
            {!isEmpty && <Divider />}
            <ReactCSSTransitionGroup
              transitionName="dropdownlist"
              transitionEnter={false}
              transitionLeaveTimeout={200}
            >
              {elements.map(e => (
                <ShortListItemWithWork
                  key={e.book.pid}
                  origin={e.origin}
                  pid={e.book.pid}
                  isKiosk={isKiosk}
                  onRemove={() => remove(e.book.pid)}
                  onOriginUpdate={origin => originUpdate(origin, e.book.pid)}
                />
              ))}
            </ReactCSSTransitionGroup>
          </div>
          {isEmpty && (
            <div className="shortlist__empty--wrap">
              <span>
                <T component="shortlist" name="emptyList" />
              </span>
            </div>
          )}
          {!isKiosk && elements.length > 0 && (
            <div className="shortlist__tools--bottom">
              <AddToListButton
                elements={elements}
                multiple={true}
                data-cy="add-all-to-list"
              />
              {!shouldUseLookupUrl && (
                <OrderAllButton
                  iconLeft="chrome_reader_mode"
                  size="large"
                  onClick={
                    orderList.length > 0 &&
                    (() => orderAll(orderList.map(e => e.book)))
                  }
                />
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const {elements} = state.shortListReducer;
  const orderList = (elements || [])
    .filter(o => {
      const order = state.orderReducer.orders[o.book.pid] || {};
      return order.orderState !== 'ordered';
    })
    .slice(0, 10);
  return {
    shouldUseLookupUrl: state.userReducer.shouldUseLookupUrl,
    shortListState: state.shortListReducer,
    isLoggedIn: state.userReducer.isLoggedIn,
    isKiosk: state.kiosk.enabled,
    orderList
  };
};

export const mapDispatchToProps = dispatch => ({
  orderAll: books => books.forEach(book => dispatch({type: ORDER, book})),
  remove: pid =>
    dispatch({
      type: ON_SHORTLIST_REMOVE_ELEMENT,
      pid
    }),
  originUpdate: (origin, pid) =>
    dispatch({
      type: SHORTLIST_UPDATE_ORIGIN,
      pid,
      origin
    }),
  clearList: () =>
    dispatch({
      type: SHORTLIST_CLEAR
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShortList);
