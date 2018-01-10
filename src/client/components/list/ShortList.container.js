import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Kryds from '../svg/Kryds.svg';
import BookCover from '../general/BookCover.component';
import Textarea from 'react-textarea-autosize';
import OrderButton from '../work/OrderButton.component';
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
    return (
      <div className="item col-xs-12 col-lg-10 text-left">
        <div className="row">
          <div className="book col-xs-6">
            <div className="row">
              <div className="col-xs-2">
                <div className="book-cover">
                  <BookCover book={this.props.element.book} />
                </div>
              </div>
              <div className="col-xs-10 book-description">
                <div className="title">{this.props.element.book.title}</div>
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
            <OrderButton pid={this.props.element.book.pid} />
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
                onRemove={() =>
                  this.props.dispatch({
                    type: ON_SHORTLIST_REMOVE_ELEMENT,
                    pid: e.book.pid
                  })
                }
                onOriginUpdate={origin => {
                  this.props.dispatch({
                    type: SHORTLIST_UPDATE_ORIGIN,
                    pid: e.book.pid,
                    origin
                  });
                }}
                onAddToList={() => {
                  this.props.dispatch({
                    type: OPEN_MODAL,
                    modal: 'addToList',
                    context: e
                  });
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
                onClick={() =>
                  this.props.dispatch({
                    type: OPEN_MODAL,
                    modal: 'addToList',
                    context: elements
                  })
                }
              >
                TILFØJ ALLE TIL LISTE
              </span>
              <span
                className="btn btn-success ml2"
                onClick={() =>
                  this.props.orderAll(elements.map(e => e.book.pid))
                }
              >
                BESTIL HELE LISTEN
              </span>
              <span
                className="clear-all-btn btn btn-success ml2"
                onClick={() =>
                  this.props.dispatch({
                    type: SHORTLIST_CLEAR
                  })
                }
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
export default connect(
  // Map redux state to props
  state => {
    return {
      shortListState: state.shortListReducer
    };
  },
  dispatch => ({
    orderAll: pids => pids.forEach(pid => dispatch({type: ORDER, pid})),
    dispatch
  })
)(ShortList);
