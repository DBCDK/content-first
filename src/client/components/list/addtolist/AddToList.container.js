import React from 'react';
import {connect} from 'react-redux';
import {addElementToList, storeList} from '../../../redux/list.reducer';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import BookSearchSuggester from './BookSearchSuggester';
import Title from '../../base/Title';
import Text from '../../base/Text';
import ProfileImage from '../../general/ProfileImage.component';

export class AddToList extends React.Component {
  constructor() {
    super();
    this.state = {exists: false};
  }
  focus = () => {
    this.refs.suggester.focus();
  };

  submit = book => {
    const {addElement, requireLogin, list, isLoggedIn, onAdd} = this.props;
    if (!isLoggedIn) {
      return requireLogin();
    }
    if (list.list.filter(item => item.book.pid === book.book.pid).length > 0) {
      this.setState({exists: true, selected: book});
    } else {
      addElement(book, list);
      this.setState({exists: false});
      if (onAdd) {
        onAdd(book.book.pid);
      }
    }
  };

  render() {
    const {
      list,
      allowAdd,
      profile,
      className,
      style,
      suggesterRef
    } = this.props;
    if (!allowAdd || !list) {
      return null;
    }
    return (
      <div
        className={'addbook position-relative ' + className || ''}
        style={style}
      >
        {this.props.disabled && (
          <div
            className="position-absolute"
            style={{
              width: '100%',
              height: '100%',
              top: 0,
              background: 'white',
              opacity: 0.7,
              zIndex: 1000
            }}
          />
        )}
        <Title
          tag="h2"
          type="title4"
          variant="transform-uppercase"
          className="ml-2 ml-sm-0"
        >
          Vil du tilføje bøger til listen?
        </Title>

        <div className="d-flex flex-row french-pass pt-4">
          <ProfileImage className="ml-4" user={profile} size={'40'} />
          <BookSearchSuggester
            suggesterRef={suggesterRef}
            className="ml-4 mr-4"
            list={list}
            onSubmit={this.submit}
          />
        </div>

        {this.state.exists && (
          <React.Fragment>
            <Text
              type="body"
              variant="color-fersken--weight-semibold"
              className="mt-2 mb-0 d-inline-block"
            >
              {this.state.selected.book.title}
            </Text>
            <Text
              type="body"
              variant="color-fersken"
              className="mt-2 mb-0 d-inline"
            >
              {' eksisterer allerede i listen'}
            </Text>
          </React.Fragment>
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
