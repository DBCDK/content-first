import React from 'react';
import {connect} from 'react-redux';
import {addElementToList, storeList} from '../../redux/list.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import BookSearchSuggester from './BookSearchSuggester';
import {ListItem} from './ListCreate.container';

export class AddToList extends React.Component {
  constructor() {
    super();
    this.state = {elementToAdd: null};
  }
  render() {
    const {list, allowAdd, addElement, requireLogin} = this.props;
    if (!allowAdd || !list) {
      return null;
    }

    const elementToAdd = this.state.elementToAdd;
    const alreadyInList = elementToAdd
      ? list.list.filter(item => item.book.pid === elementToAdd.book.pid)
          .length > 0
      : false;
    return (
      <div className="addbook">
        <h2 className="list-creator__headline mt2">Tilføj bøger til listen</h2>

        <BookSearchSuggester
          list={list}
          onSubmit={book => this.setState({elementToAdd: book})}
        />
        {elementToAdd &&
          !alreadyInList && (
            <div className="item mt4">
              <ListItem
                key={elementToAdd.book.pid}
                item={elementToAdd}
                onChange={(item, description) => {
                  item.description = description;
                  this.setState({elementToAdd: item});
                }}
              />
              <div className="text-right mt1">
                <span
                  className="btn btn-default"
                  onClick={() => {
                    this.setState({elementToAdd: null});
                  }}
                >
                  Fortryd
                </span>
                <span
                  className="btn btn-success ml1"
                  onClick={() => {
                    if (this.props.isLoggedIn) {
                      addElement(elementToAdd, list);
                      this.setState({elementToAdd: null});
                    } else {
                      requireLogin();
                    }
                  }}
                >
                  Tilføj
                </span>
              </div>
            </div>
          )}
        {alreadyInList && (
          <h4 className="mt2 mb2 text-center">
            <strong>{this.state.elementToAdd.book.title}</strong> kan ikke
            tilføjes, da den allerede er i listen
          </h4>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allowAdd:
      ownProps.list.open ||
      ownProps.list.owner === state.userReducer.openplatformId,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};
export const mapDispatchToProps = dispatch => ({
  addElement: async (book, list) => {
    await dispatch(addElementToList(book, list.id));
    dispatch(storeList(list.id));
  },
  requireLogin: () => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'login',
      context: {
        title: 'LÆG I LISTE',
        reason: 'Du skal logge ind for at lægge bøger i en liste.'
      }
    });
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(AddToList);
