import React from 'react';
import {connect} from 'react-redux';
import CheckmarkMenu, {MenuItem} from './CheckmarkMenu.component';
import CheckmarkButton from './CheckmarkButton.component';

import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import {
  storeList,
  getListsForOwner,
  toggleElementInList,
  SYSTEM_LIST
} from '../../redux/list.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {ORDER} from '../../redux/order.reducer';

/*
  Class Connected use EXAMPLE:
  <CheckMarkConnected book={{book: work.data}} origin="Fra egen værkside"/>
*/

export class CheckmarkConnected extends React.PureComponent {
  // Toggle remember (Husk) work
  shortlistToggle = (book, origin) => {
    this.props.dispatch({
      type: ON_SHORTLIST_TOGGLE_ELEMENT,
      element: book,
      origin: origin
    });
  };

  toggleInList = (book, id) => {
    this.props.dispatch(toggleElementInList(book, id));
    this.props.dispatch(storeList(id));
  };
  // Open save-to-my-lists modal
  openModal = book => {
    this.props.dispatch({
      type: OPEN_MODAL,
      modal: 'addToList',
      context: book
    });
  };
  // Open order-this-book Modal
  order = book => {
    this.props.dispatch({
      type: ORDER,
      book: book
    });
  };

  render() {
    const remembered = this.props.shortListState.elements.reduce((map, e) => {
      map[e.book.pid] = e;
      return map;
    }, {});

    // Define button if user is loggedIn
    if (this.props.isLoggedIn) {
      return (
        <CheckmarkMenu
          text="Husk"
          checked={remembered[this.props.book.book.pid]}
          onClick={e => {
            this.shortlistToggle(this.props.book, this.props.origin);
            e.stopPropagation();
          }}
        >
          {this.props.systemLists.map(l => (
            <MenuItem
              key={l.id}
              text={l.title}
              checked={
                l.list.filter(
                  element => element.book.pid === this.props.book.book.pid
                ).length > 0
              }
              onClick={e => {
                this.toggleInList(this.props.book, l.id);
                e.stopPropagation();
              }}
            />
          ))}
          <MenuItem
            key="addToList"
            text="Tilføj til liste"
            onClick={e => {
              this.openModal(this.props.book);
              e.stopPropagation();
            }}
          />
          <MenuItem
            key="order"
            text="Bestil"
            onClick={e => {
              this.order(this.props.book.book);
              e.stopPropagation();
            }}
          />
        </CheckmarkMenu>
      );
    }

    return (
      <CheckmarkButton
        label="Husk"
        marked={remembered[this.props.book.book.pid]}
        onClick={e => {
          this.shortlistToggle(this.props.book, this.props.origin);
          e.stopPropagation();
        }}
      />
    );
  }
}

export default connect(
  // Map redux state to props
  state => {
    return {
      shortListState: state.shortListReducer,
      systemLists: getListsForOwner(state, {
        type: SYSTEM_LIST,
        owner: state.userReducer.openplatformId,
        sort: true
      }),
      isLoggedIn: state.userReducer.isLoggedIn
    };
  }
)(CheckmarkConnected);
