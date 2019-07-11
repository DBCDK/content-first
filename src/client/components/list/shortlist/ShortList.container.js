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
import OrderButton from '../../order/OrderButton.component';
import Link from '../../general/Link.component';
import Head from '../../base/Head';
import Toolbar from '../../base/Toolbar';
import Title from '../../base/Title';
import Text from '../../base/Text';
import T from '../../base/T';
import Divider from '../../base/Divider';
import Button from '../../base/Button';
import Banner from '../../base/Banner';
import {withWork} from '../../hoc/Work';
import AddToListButton from '../../general/AddToListButton/AddToListButton.component';
import Origin from '../../base/Origin';

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
      origin,
      className,
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
        align="right"
        size="medium"
        type="quaternary"
        className="ml-2"
        iconLeft="chrome_reader_mode"
      >
        <T component="general" name="book" />
      </OrderButton>
    );

    const orderElectronicBookButtons =
      hasValidCollection() &&
      collection.filter(col => col.count === 1).map(col => {
        return (
          <Button
            align="right"
            size="medium"
            type="quaternary"
            iconLeft={col.icon}
            className="ml-2"
            key={col.url}
            href={col.url}
          >
            {col.type}
          </Button>
        );
      });

    return (
      <div>
        <div className={`short-list-item d-flex flex-row ${className}`}>
          <i
            className="material-icons remove-btn"
            onClick={this.props.onRemove}
          >
            clear
          </i>
          <Link href={url}>
            <BookCover
              book={work.book}
              style={{height: 'unset', width: '70px'}}
            />
          </Link>
          <div className="top-bar-dropdown-shortlist-item-page">
            <Title Tag="h1" type="title5" className="mr-4">
              {work.book.title}
            </Title>
            <Text type="body" className="mb-1">
              {work.book.creator}
            </Text>
            <div type="body" className="mb-1">
              <Origin componentData={origin} />
            </div>
            <Toolbar className="desktop-styling">
              <AddToListButton work={work} align="left" />
              <Text align="right" type="body">
                <T component="work" name="loanTitle" />
              </Text>
              {orderBookButton}
              {orderElectronicBookButtons}
            </Toolbar>
            {work.collectionHasLoaded &&
              !hasValidCollection() && (
                <Text
                  type="body"
                  className="mt-2 d-none d-sm-block"
                  align="right"
                >
                  <T
                    component="work"
                    name={
                      newRelease()
                        ? 'noValidCollectionYet'
                        : 'noValidCollection'
                    }
                  />
                </Text>
              )}
            <div className="mobile-styling">
              <AddToListButton work={work} align="left" />
            </div>
          </div>
        </div>
        <div className="mobile-styling">
          <Text align="left" type="body">
            <T component="work" name="loanTitle" />
          </Text>
          {work.collectionHasLoaded &&
            !hasValidCollection() && (
              <Text type="body">
                <T
                  component="work"
                  name={
                    newRelease() ? 'noValidCollectionYet' : 'noValidCollection'
                  }
                />
              </Text>
            )}
          <Toolbar className="mobile-styling">
            <div align="left" className="d-flex">
              {orderBookButton}
              {orderElectronicBookButtons}
            </div>
          </Toolbar>
        </div>
      </div>
    );
  }
}

const ShortListItemWithWork = withWork(ShortListItem, {
  includeReviews: true,
  includeCollection: true,
  includeCover: true
});

export class ShortList extends React.Component {
  render() {
    const {elements, hasLoaded} = this.props.shortListState;
    if (!hasLoaded) {
      return null;
    }
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
          color="#81c793"
          className="fixed-width-col-md position-relative text-uppercase"
          title={T({component: 'shortlist', name: 'title'})}
        />

        <div className="container">
          <div className="top-bar-dropdown-list-page col-11 col-centered">
            <div className="items mb-2">
              <Toolbar className="top-bar-upper-toolbar">
                <Button
                  align="right"
                  size="large"
                  type="quaternary"
                  iconLeft="delete"
                  className="bg-white pr-0"
                  onClick={() => this.props.clearList()}
                >
                  <T component="shortlist" name="shortlistClear" />
                </Button>
              </Toolbar>
              <Divider />
              <ReactCSSTransitionGroup
                transitionName="dropdownlist"
                transitionEnter={false}
                transitionLeaveTimeout={200}
              >
                {elements.map(e => {
                  return (
                    <div key={e.book.pid}>
                      <ShortListItemWithWork
                        key={e.book.pid}
                        origin={e.origin}
                        pid={e.book.pid}
                        onRemove={() => {
                          this.props.remove(e.book.pid);
                        }}
                        onOriginUpdate={origin => {
                          this.props.originUpdate(origin, e.book.pid);
                        }}
                      />
                      <Divider />
                    </div>
                  );
                })}
              </ReactCSSTransitionGroup>
            </div>
            {elements.length === 0 && (
              <div className="empty-list-text">
                <T component="shortlist" name="emptyList" />
              </div>
            )}
            {elements.length > 0 && (
              <Toolbar className="bottom-toolbar mt-5 mb-5">
                <AddToListButton
                  elements={elements}
                  align="right"
                  multiple={true}
                  data-cy="add-all-to-list"
                />
                {false && (
                  <Button
                    align="right"
                    iconLeft="list"
                    size="large"
                    type="tertiary"
                    className="text-uppercase"
                    onClick={() =>
                      this.props.addToList(
                        elements,
                        this.props.isLoggedIn,
                        this.props.clearList
                      )
                    }
                  >
                    <T component="list" name="addAllToList" />
                  </Button>
                )}
                <Button
                  align="right"
                  iconLeft="chrome_reader_mode"
                  size="large"
                  type="quaternary"
                  className="btn ml-4"
                  onClick={
                    this.props.orderList.length > 0 &&
                    (() =>
                      this.props.orderAll(
                        this.props.orderList.map(e => e.book)
                      ))
                  }
                >
                  <T component="shortlist" name="shortlistOrder" />
                </Button>
              </Toolbar>
            )}
          </div>
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
    shortListState: state.shortListReducer,
    isLoggedIn: state.userReducer.isLoggedIn,
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
