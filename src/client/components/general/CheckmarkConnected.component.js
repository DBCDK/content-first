import React from 'react';
import {connect} from 'react-redux';
import CheckmarkMenu, {MenuItem} from './CheckmarkMenu.component';
import CheckmarkButton from './CheckmarkButton.component';

import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import {
  storeList,
  getLists,
  toggleElementInList,
  SYSTEM_LIST
} from '../../redux/list.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {ORDER} from '../../redux/order.reducer';

/*
  Class Connected use EXAMPLE:
  <CheckMarkConnected book={{book: work.data}} origin="Fra egen værkside"/>
*/

export class CheckMarkConnected extends React.PureComponent {
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
          onClick={() => {
            this.shortlistToggle(this.props.book, this.props.origin);
          }}
        >
          {this.props.systemLists.map(l => (
            <MenuItem
              key={l.data.id}
              text={l.data.title}
              checked={
                l.data.list.filter(
                  element => element.book.pid === this.props.book.book.pid
                ).length > 0
              }
              onClick={() => {
                this.toggleInList(this.props.book, l.data.id);
              }}
            />
          ))}
          <MenuItem
            key="addToList"
            text="Tilføj til liste"
            onClick={() => {
              this.openModal(this.props.book);
            }}
          />
          <MenuItem
            key="order"
            text="Bestil"
            onClick={() => {
              this.order(this.props.book.book);
            }}
          />
        </CheckmarkMenu>
      );
    }

    return (
      <CheckmarkButton
        label="Husk"
        marked={remembered[this.props.book.book.pid]}
        onClick={() => {
          this.shortlistToggle(this.props.book, this.props.origin);
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
      systemLists: getLists(state.listReducer, {
        type: SYSTEM_LIST,
        owner: state.profileReducer.user.openplatformId,
        sort: true
      }),
      isLoggedIn: state.profileReducer.user.isLoggedIn
    };
  }
)(CheckMarkConnected);
