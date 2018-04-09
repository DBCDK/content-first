import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Kryds from '../svg/Kryds.svg';
import BookCover from '../general/BookCover.component';
import Textarea from 'react-textarea-autosize';
import OrderButton from '../order/OrderButton.component';
import Link from '../general/Link.component';
import {
  ON_SHORTLIST_REMOVE_ELEMENT,
  SHORTLIST_UPDATE_ORIGIN,
  SHORTLIST_CLEAR
} from '../../redux/shortlist.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {ORDER} from '../../redux/order.reducer';

export class ShortListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.element.origin
    };
  }

  render() {
    const url = `/værk/${this.props.element.book.pid}`;
    return (
      <div className="item col-xs-12 col-lg-10 text-left">
        <div className="row">
          <div className="book col-xs-6">
            <div className="row">
              <div className="col-xs-2">
                <div className="book-cover">
                  <Link href={url}>
                    <BookCover book={this.props.element.book} />
                  </Link>
                </div>
              </div>
              <div className="col-xs-10 book-description">
                <div className="title">
                  <Link href={url}>{this.props.element.book.title}</Link>
                </div>
                <div className="creator">{this.props.element.book.creator}</div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    this.props.onOriginUpdate(this.state.description);
                  }}
                >
                  <Textarea
                    className="form-control description"
                    name="item-description"
                    placeholder={'Skriv en beskrivelse'}
                    onChange={e => this.setState({description: e.target.value})}
                    value={this.state.description}
                  />
                  {this.state.description !== this.props.element.origin && (
                    <div className="text-right mt1">
                      <span
                        className="btn btn-default"
                        onClick={() => {
                          this.setState({
                            description: this.props.element.origin
                          });
                        }}
                      >
                        Fortryd
                      </span>
                      <input
                        className="btn btn-success ml2"
                        type="submit"
                        value="Gem"
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="add-to-list col-xs-3">
            <span onClick={this.props.onAddToList}>
              Tilføj til liste<span className="glyphicon glyphicon-menu-right" />
            </span>
          </div>
          <div className="order-book col-xs-3">
            <OrderButton book={this.props.element.book} />
          </div>
          <img
            src={Kryds}
            alt="remove"
            className="remove-btn"
            onClick={this.props.onRemove}
          />
        </div>
      </div>
    );
  }
}
class ShortList extends React.Component {
  render() {
    const {elements} = this.props.shortListState;
    return (
      <div className="short-list-page col-xs-11 col-centered">
        <div className="page-header-1">Huskeliste</div>
        <div className="items mb2">
          <ReactCSSTransitionGroup
            transitionName="shortlist"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {elements.map(e => (
              <ShortListItem
                key={e.book.pid}
                element={e}
                onRemove={() => {
                  this.props.remove(e.book.pid);
                }}
                onOriginUpdate={origin => {
                  this.props.originUpdate(origin, e.book.pid);
                }}
                onAddToList={() => {
                  this.props.addToList(e, this.props.isLoggedIn);
                }}
              />
            ))}
          </ReactCSSTransitionGroup>
        </div>
        {elements.length === 0 && (
          <div className="empty-list-text">Din huskeliste er tom</div>
        )}
        {elements.length > 0 && (
          <div className="list-actions col-xs-12 col-lg-10 text-right mt4 mb4">
            <div className="row">
              <span
                className="btn btn-success"
                onClick={() => {
                  this.props.addToList(elements, this.props.isLoggedIn);
                }}
              >
                TILFØJ ALLE TIL LISTE
              </span>
              <span
                className="btn btn-success ml2"
                onClick={() =>
                  this.props.orderAll(this.props.orderList.map(e => e.book))
                }
              >
                BESTIL HELE LISTEN
              </span>
              <span
                className="clear-all-btn btn btn-success ml2"
                onClick={() => this.props.clearList()}
              >
                RYD LISTEN<span className="glyphicon glyphicon-trash ml1" />
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {elements} = state.shortListReducer;
  const orderList = (elements || [])
    .filter(
      o =>
        state.orderReducer.getIn(['orders', o.pid, 'orderState']) !== 'ordered'
    )
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
  addToList: (element, isLoggedIn) =>
    dispatch({
      type: OPEN_MODAL,
      modal: isLoggedIn ? 'addToList' : 'login',
      context: element
    }),
  clearList: () =>
    dispatch({
      type: SHORTLIST_CLEAR
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(ShortList);
