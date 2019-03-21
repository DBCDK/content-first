import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  ON_SHORTLIST_REMOVE_ELEMENT,
  SHORTLIST_UPDATE_ORIGIN,
  SHORTLIST_CLEAR
} from '../../../redux/shortlist.reducer';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import {ORDER} from '../../../redux/order.reducer';
import BookCover from '../../general/BookCover.component';
import OrderButton from '../../order/OrderButton.component';
import Link from '../../general/Link.component';
import Toolbar from '../../base/Toolbar';
import Title from '../../base/Title';
import Text from '../../base/Text';
import T from '../../base/T';
import Divider from '../../base/Divider';
import Button from '../../base/Button';
import Banner from '../../base/Banner';
import {filterCollection} from '../../work/workFunctions';
import withWork from '../../base/Work/withWork.hoc';

export class ShortListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.origin
    };
  }

  render() {
    const {work, pid, origin, className} = this.props;
    if (!work) {
      return null;
    }
    const url = `/værk/${pid}`;

    // get collections including ereolen
    const collection = filterCollection(this.props.work);
    const addToListButton = (
      <Button
        align="left"
        size="medium"
        type="tertiary"
        className="mr-2 text-uppercase"
        onClick={this.props.onClick}
      >
        <T component="list" name="addToList" />
      </Button>
    );
    const orderBookButton = (
      <OrderButton
        book={work.book}
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
      work.collectionHasLoaded &&
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
      <React.Fragment>
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
            <Text type="body" className="mb-1">
              {origin}
            </Text>
            <Toolbar className="desktop-styling">
              {addToListButton}
              <Text align="right" type="body">
                <T component="work" name="loanTitle" />
              </Text>
              {orderBookButton}
              {orderElectronicBookButtons}
            </Toolbar>
            <div className="mobile-styling">{addToListButton}</div>
          </div>
        </div>
        <div className="mobile-styling">
          <Text align="left" type="body">
            <T component="work" name="loanTitle" />
          </Text>
          <Toolbar className="mobile-styling">
            <React.Fragment align="left">
              {orderBookButton}
              {orderElectronicBookButtons}
            </React.Fragment>
          </Toolbar>
        </div>
      </React.Fragment>
    );
  }
}

const ShortListItemWithWork = withWork(ShortListItem, {
  includeReviews: true,
  includeCollection: true,
  includeCover: true
});

class ShortList extends React.Component {
  render() {
    const {elements} = this.props.shortListState;
    return (
      <React.Fragment>
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
                {elements.map(e => (
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
                      onAddToList={() => {
                        this.props.addToList(
                          [
                            {
                              book: e.book,
                              description: e.origin || (
                                <T component="shortlist" name="origin" />
                              )
                            }
                          ],
                          this.props.isLoggedIn,
                          () => this.props.remove(e.book.pid)
                        );
                      }}
                    />
                    <Divider />
                  </div>
                ))}
              </ReactCSSTransitionGroup>
            </div>
            {elements.length === 0 && (
              <div className="empty-list-text">
                <T component="shortlist" name="emptyList" />
              </div>
            )}
            {elements.length > 0 && (
              <Toolbar className="bottom-toolbar mt-5 mb-5">
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
  addToList: (works, isLoggedIn, callback = null) =>
    dispatch({
      type: OPEN_MODAL,
      modal: isLoggedIn ? 'addToList' : 'login',
      context: isLoggedIn
        ? works
        : {
            title: 'Tilføj til liste',
            reason: 'Du skal logge ind for at flytte bøger til en liste.'
          },
      callback
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
