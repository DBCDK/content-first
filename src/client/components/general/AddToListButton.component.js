import React from 'react';
import {connect} from 'react-redux';
import {isMobile} from 'react-device-detect';
import {toast} from 'react-toastify';
import Icon from '../base/Icon';
import ToastMessage from '../base/ToastMessage';
import Button from '../base/Button';
import T from '../base/T/';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {
  CUSTOM_LIST,
  SYSTEM_LIST,
  createGetLists,
  addList,
  addElementToList,
  toggleElementInList,
  storeList
} from '../../redux/list.reducer';

import './AddToListButton.css';

export class AddToListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listTitle: ''
    };
  }

  pidInList(pid, list) {
    let status = false;
    list.forEach(listWork => {
      if (listWork.pid === pid) {
        status = true;
      }
    });
    return status;
  }

  forceOpen() {
    this.dropdown.classList.add('show');
  }

  forceClose() {
    this.dropdown.classList.remove('show');
  }

  createNewList() {
    const title = this.state.listTitle;

    this.forceOpen();

    if (title === '') {
      return;
    }

    this.props.newList(title);
    this.setState({listTitle: ''});
  }

  render() {
    const {work, isLoggedIn} = this.props;
    const book = work.book;

    // Number of customLists to show
    const customListsToShow = isMobile ? 20 : 3;

    let defaultTitle = T({component: 'list', name: 'addToList'});
    let systemTitle = '';
    let customTitle = '';
    if (isLoggedIn) {
      this.props.customLists.forEach(list => {
        let status = this.pidInList(book.pid, list.list);
        if (status) {
          customTitle += list.title + ', ';
          defaultTitle = '';
        }
      });
      this.props.systemLists.forEach(list => {
        let status = this.pidInList(book.pid, list.list);
        if (status) {
          systemTitle += list.title + ', ';
          defaultTitle = '';
        }
      });
    }

    const buttonActive = defaultTitle === '' ? 'AddToListButton__Active' : '';

    if (!isLoggedIn) {
      return (
        <Button
          className={'AddToListButton ' + this.props.className || ''}
          type="quinary"
          size="medium"
          iconRight="more_vert"
          onClick={() => {
            this.props.openModal(
              {
                title: <T component="login" name="modalTitle" />,
                reason: <T component="login" name="modalDescription" />
              },
              'login'
            );
          }}
        >
          {defaultTitle}
        </Button>
      );
    }

    return (
      <div
        className={
          'AddToListButton__Container dropdown' + this.props.className || ''
        }
        ref={e => (this.listContainer = e)}
      >
        <Button
          className={'AddToListButton ' + buttonActive}
          type="quinary"
          size="medium"
          id="addtolist"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          iconRight="more_vert"
        >
          {systemTitle.slice(0, -2) || customTitle.slice(0, -2) || defaultTitle}
        </Button>

        <ul
          ref={e => (this.dropdown = e)}
          className="AddToListButton__Dropdown AddToListButton__Dropdown__ShowLists dropdown-menu"
          aria-labelledby="addtolist"
        >
          <li
            className="AddToListButton__Mobile__Back"
            onClick={() => this.forceClose()}
          >
            <Icon name="chevron_left" className="md-medium" />
            <T component="general" name="back" />
          </li>
          <li className="AddToListButton__Mobile__Heading">Tilføj til liste</li>
          {this.props.customLists.map((list, i) => {
            const ny = list._owner ? false : true;

            let status = this.pidInList(book.pid, list.list);
            const statusClass = status ? 'Radio__Active' : '';
            const ToastMessageLabel = (
              <T
                component="list"
                name={status ? 'toastRemovedFrom' : 'toastAddedTo'}
              />
            );

            if (i < customListsToShow) {
              return (
                <li
                  key={list.title}
                  onClick={() => {
                    this.props.toggleInList(work, list._id);
                    toast(
                      <ToastMessage
                        type="success"
                        icon="check_circle"
                        lines={[ToastMessageLabel, list.title]}
                      />
                    );
                  }}
                >
                  <span className={'AddToListButton__Radio ' + statusClass} />
                  <span>{list.title}</span>
                  {ny && (
                    <span className="AddToListButton__New">
                      <T component="general" name="new" />
                    </span>
                  )}
                </li>
              );
            }
          })}

          {this.props.customLists.length > 0 && (
            <div className="dropdown-divider" />
          )}

          {this.props.systemLists.map(list => {
            let status = this.pidInList(book.pid, list.list);
            const statusClass = status ? 'Radio__Active' : '';
            const ToastMessageLabel = (
              <T
                component="list"
                name={status ? 'toastRemovedFrom' : 'toastAddedTo'}
              />
            );

            return (
              <li
                key={list.title}
                onClick={() => {
                  this.props.toggleInList(work, list._id);
                  toast(
                    <ToastMessage
                      type="success"
                      icon="check_circle"
                      lines={[ToastMessageLabel, list.title]}
                    />
                  );
                }}
              >
                <span className={'AddToListButton__Radio ' + statusClass} />
                <span>{list.title}</span>
              </li>
            );
          })}

          <li className="AddToListButton__Mobile__Heading">
            <T component="list" name="newList" />
          </li>
          <li className="AddToListButton__Mobile__Input">
            <input
              placeholder="Giv din liste et navn"
              value={this.state.listTitle}
              onChange={e => this.setState({listTitle: e.target.value})}
            />
            <Button
              size="large"
              type="tertiary"
              className="mb1"
              onClick={() => this.createNewList()}
            >
              <T component="list" name="addList" />
            </Button>
          </li>

          <div className="dropdown-divider" />

          <li onClick={() => this.props.openModal([work], 'addToList')}>
            <span className="AddToListButton__Radio" />
            <span>
              <T component="list" name="addToAnotherList" />
            </span>
            <Icon className="md-small" name="chevron_right" />
          </li>

          <li onClick={() => this.props.openModal([work], 'addToList')}>
            <span className="AddToListButton__Radio" />
            <span>
              <T component="list" name="createNew" />
            </span>
            <Icon className="md-small" name="chevron_right" />
          </li>
        </ul>
      </div>
    );
  }
}

const customListSelector = createGetLists();
const systemListsSelector = createGetLists();
const mapStateToProps = state => {
  return {
    customLists: customListSelector(state, {
      type: CUSTOM_LIST,
      _owner: state.userReducer.openplatformId,
      sort: 'created'
    }),
    systemLists: systemListsSelector(state, {
      type: SYSTEM_LIST,
      _owner: state.userReducer.openplatformId,
      sort: true
    }),
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

export const mapDispatchToProps = dispatch => ({
  addToList: (work, listId) => dispatch(addElementToList(work, listId)),
  newList: title => dispatch(addList({title})),
  toggleInList: async (work, listId) => {
    await dispatch(toggleElementInList(work, listId));
    dispatch(storeList(listId));
  },
  saveList: listId => dispatch(storeList(listId)),
  openModal: (element, modal) => {
    dispatch({
      type: OPEN_MODAL,
      modal: modal,
      context: element
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToListButton);
