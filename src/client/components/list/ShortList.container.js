import React from 'react';
import {connect} from 'react-redux';
import Kryds from '../svg/Kryds.svg';
import BookCover from '../general/BookCover.component';
import Textarea from 'react-textarea-autosize';
import {ON_SHORTLIST_REMOVE_ELEMENT, SHORTLIST_CLEAR} from '../../redux/shortlist.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';

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
                <Textarea
                  className="form-control description"
                  name="item-description"
                  placeholder={'Skriv en beskrivelse'}
                  onChange={e => this.setState({description: e.target.value})}
                  value={this.state.description}
                />
              </div>
            </div>
          </div>
          <div className="add-to-list col-xs-3">
            <span onClick={this.props.onAddToList}>
              Tilføj til liste<span className="glyphicon glyphicon-copy" />
            </span>
          </div>
          <div className="order-book col-xs-3">
            <span>
              Bestil til dit bibliotek<span className="glyphicon glyphicon-road" />
            </span>
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
        <div className="items">
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
              onAddToList={() => {
                this.props.dispatch({
                  type: OPEN_MODAL,
                  modal: 'addToList',
                  context: e
                });
              }}
            />
          ))}
        </div>
        <div className="list-actions col-xs-12 col-lg-10 text-right">
          <span className="btn btn-success" onClick={() => this.props.dispatch({
            type: SHORTLIST_CLEAR
          })}>RYD LISTEN</span>
        </div>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  state => {
    return {shortListState: state.shortListReducer};
  }
)(ShortList);
