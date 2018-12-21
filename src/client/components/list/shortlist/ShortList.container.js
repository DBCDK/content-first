import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Textarea from 'react-textarea-autosize';
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
      <div className="item col-12 col-lg-10 text-left">
        <div className="row">
          <div className="book col-6">
            <div className="row">
              <div className="col-2">
                <Link href={url}>
                  <BookCover
                    book={this.props.element.book}
                    style={{width: 'unset'}}
                  />
                </Link>
              </div>
              <div className="col-10 book-description">
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
          <div className="add-to-list col-3">
            <span
              className="d-flex align-items-center"
              onClick={this.props.onAddToList}
            >
              Tilføj til liste
              <i className="material-icons" style={{fontSize: 11}}>
                arrow_forward_ios
              </i>
            </span>
          </div>
          <div className="order-book col-3">
            <OrderButton
              book={this.props.element.book}
              size="medium"
              type="tertiary"
              label="Bestil"
              className="ml1"
            />
          </div>

          <i
            className="material-icons remove-btn"
            onClick={this.props.onRemove}
          >
            clear
          </i>
        </div>
      </div>
    );
  }
}
class ShortList extends React.Component {
  render() {
    const {elements} = this.props.shortListState;
    return (
      <div className="container">
        <div className="top-bar-dropdown-list-page col-11 col-centered">
          <div className="page-header-1">Huskeliste</div>
          <div className="items mb2">
            <ReactCSSTransitionGroup
              transitionName="dropdownlist"
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
                    this.props.addToList(
                      [
                        {
                          book: e.book,
                          description: e.origin || 'Tilføjet fra huskelisten'
                        }
                      ],
                      this.props.isLoggedIn,
                      () => this.props.remove(e.book.pid)
                    );
                  }}
                />
              ))}
            </ReactCSSTransitionGroup>
          </div>
          {elements.length === 0 && (
            <div className="empty-list-text">Din huskeliste er tom</div>
          )}
          {elements.length > 0 && (
            <div className="list-actions col-12 col-lg-10 text-right mt4 mb4">
              <div className="row d-block">
                <span
                  className="btn btn-success"
                  onClick={() =>
                    this.props.addToList(
                      elements,
                      this.props.isLoggedIn,
                      this.props.clearList
                    )
                  }
                  data-cy="listpage-add-elemts-to-list"
                >
                  TILFØJ ALLE TIL LISTE
                </span>
                <span
                  className={
                    'btn ml2 ' +
                    (this.props.orderList.length > 0
                      ? 'btn-success'
                      : 'disabled')
                  }
                  onClick={
                    this.props.orderList.length > 0 &&
                    (() =>
                      this.props.orderAll(
                        this.props.orderList.map(e => e.book)
                      ))
                  }
                >
                  BESTIL HELE LISTEN
                </span>
                <span
                  className="clear-all-btn btn btn-success ml2"
                  onClick={() => this.props.clearList()}
                >
                  RYD LISTEN
                  <i className="material-icons ml1" style={{fontSize: '18px'}}>
                    delete
                  </i>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
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
