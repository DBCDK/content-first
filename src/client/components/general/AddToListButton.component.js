import React from 'react';
import {connect} from 'react-redux';
import {isMobile} from 'react-device-detect';
import {toast} from 'react-toastify';
import Icon from '../base/Icon';
import ToastMessage from '../base/ToastMessage';
import Button from '../base/Button';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {
  CUSTOM_LIST,
  SYSTEM_LIST,
  getListsForOwner,
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
    this.listContainer.classList.add('open');
  }

  forceClose() {
    this.listContainer.classList.remove('open');
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
    const {work} = this.props;
    const book = work.book;

    // Number of customLists to show
    const customListsToShow = isMobile ? 20 : 3;

    let defaultTitle = 'Tilføj til liste';

    let customTitle = '';
    this.props.customLists.forEach(list => {
      let status = this.pidInList(book.pid, list.list);
      if (status) {
        customTitle += list.title + ', ';
        defaultTitle = '';
      }
    });

    let systemTitle = '';
    this.props.systemLists.forEach(list => {
      let status = this.pidInList(book.pid, list.list);
      if (status) {
        systemTitle += list.title + ', ';
        defaultTitle = '';
      }
    });

    const buttonActive = defaultTitle === '' ? 'AddToListButton__Active' : '';

    return (
      <div
        className={'AddToListButton__Container dropdown'}
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
          onClick={e => {
            if (!this.props.isLoggedIn) {
              e.stopPropagation();
              this.props.openModal(
                {
                  title: 'BESTIL',
                  reason: 'Du skal logge ind for at bestille bøger'
                },
                'login'
              );
            }
          }}
        >
          <Icon className="md-small" name="more_vert" />
          <span>
            {systemTitle.slice(0, -2) ||
              customTitle.slice(0, -2) ||
              defaultTitle}
          </span>
        </Button>

        {this.props.isLoggedIn && (
          <React.Fragment>
            <ul
              className="AddToListButton__Dropdown AddToListButton__Dropdown__ShowLists dropdown-menu"
              aria-labelledby="addtolist"
            >
              <li className="AddToListButton__Mobile__Heading">
                Tilføj til liste
              </li>
              {this.props.customLists.map((list, i) => {
                const ny = list._owner ? false : true;

                let status = this.pidInList(book.pid, list.list);
                const statusClass = status ? 'Radio__Active' : '';
                const ToastMessageLabel = status
                  ? 'Fjernet fra: '
                  : 'Tilføjet til: ';

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
                      <span
                        className={'AddToListButton__Radio ' + statusClass}
                      />
                      <span>{list.title}</span>
                      {ny && <span className="AddToListButton__New"> Ny</span>}
                    </li>
                  );
                }
              })}

              {this.props.customLists.length > 0 && (
                <li role="separator" className="dropdown-divider" />
              )}

              {this.props.systemLists.map(list => {
                let status = this.pidInList(book.pid, list.list);
                const statusClass = status ? 'Radio__Active' : '';
                const ToastMessageLabel = status
                  ? 'Fjernet fra: '
                  : 'Tilføjet til: ';

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
                Eller opret en ny Liste
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
                  Tilføj liste
                </Button>
              </li>

              <li role="separator" className="dropdown-divider" />

              <li onClick={() => this.props.openModal(work, 'addToList')}>
                <span className="AddToListButton__Radio" />
                <span>Læg på anden liste</span>
                <Icon className="md-small" name="chevron_right" />
              </li>

              <li onClick={() => this.props.openModal(work, 'addToList')}>
                <span className="AddToListButton__Radio" />
                <span>Opret ny liste</span>
                <Icon className="md-small" name="chevron_right" />
              </li>
            </ul>
            <ul className="AddToListButton__Dropdown AddToListButton__Dropdown__Top dropdown-menu">
              <li className="AddToListButton__Mobile__Back">
                <Icon name="chevron_left" className="md-medium" />
                Tilbage
              </li>
            </ul>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    customLists: getListsForOwner(state, {
      type: CUSTOM_LIST,
      owner: state.userReducer.openplatformId
    }).sort(function(a, b) {
      if (!b._modified) {
        return 1;
      }
      return b._modified - a._modified;
    }),
    systemLists: getListsForOwner(state, {
      type: SYSTEM_LIST,
      owner: state.userReducer.openplatformId,
      sort: true
    }),
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

export const mapDispatchToProps = dispatch => ({
  addToList: (work, listId) => dispatch(addElementToList(work, listId)),
  newList: title => dispatch(addList({title})),
  toggleInList: (work, listId) => {
    dispatch(toggleElementInList(work, listId));
    dispatch(storeList(listId));
  },
  saveList: listId => dispatch(storeList(listId)),
  openModal: (works, modal) => {
    dispatch({
      type: OPEN_MODAL,
      modal: modal,
      context: [works]
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToListButton);
