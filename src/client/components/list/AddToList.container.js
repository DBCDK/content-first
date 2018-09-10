import React from 'react';
import {connect} from 'react-redux';
import {addElementToList, storeList} from '../../redux/list.reducer';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import BookSearchSuggester from './BookSearchSuggester';
import ListElement from './templates/ListElement';
import Heading from '../base/Heading';
import ProfileImage from '../general/ProfileImage.component';
import Button from '../base/Button';

export class AddToList extends React.Component {
  constructor() {
    super();
    this.state = {exists: false};
  }
  render() {
    const {
      list,
      allowAdd,
      addElement,
      requireLogin,
      openplatformId,
      profile,
      className,
      style,
      onAdd
    } = this.props;
    if (!allowAdd || !list) {
      return null;
    }
    return (
      <div className={'addbook ' + className} style={style}>
        <Heading tag="h2" type="section">
          Vil du tilføje bøger til listen?
        </Heading>

        <div className="d-flex flex-row french-pass pt-4">
          <ProfileImage className="ml-4" user={profile} size={'40'} />
          <BookSearchSuggester
            className="ml-4 mr-4"
            list={list}
            onSubmit={book => {
              if (
                list.list.filter(item => item.book.pid === book.book.pid)
                  .length > 0
              ) {
                this.setState({exists: true, selected: book});
              } else {
                addElement(book, list);
                this.setState({exists: false});
                if (onAdd) {
                  onAdd(book.book.pid);
                }
              }
            }}
          />
        </div>

        {this.state.exists && (
          <Heading Tag="h3" type="peach-subtitle" className="mt-2 mb-0">
            <strong>{this.state.selected.book.title}</strong>
            <span> eksisterer allerede i listen</span>
          </Heading>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    openplatformId: state.userReducer.openplatformId,
    profile: state.users.toJS()[state.userReducer.openplatformId],
    allowAdd:
      ownProps.list.open ||
      ownProps.list.owner === state.userReducer.openplatformId,
    isLoggedIn: state.userReducer.isLoggedIn
  };
};
export const mapDispatchToProps = dispatch => ({
  addElement: async (book, list) => {
    await dispatch(addElementToList(book, list._id));
    dispatch(storeList(list._id));
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToList);
