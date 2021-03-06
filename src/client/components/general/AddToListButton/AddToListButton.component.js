import React from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {isMobileOnly} from 'react-device-detect';
import Icon from '../../base/Icon';
import ToastMessage from '../../base/ToastMessage';
import Button from '../../base/Button';
import T from '../../base/T/';
import {withList, withLists} from '../../hoc/List/';
import {OPEN_MODAL} from '../../../redux/modal.reducer';

import './AddToListButton.css';

const MenuEntry = withList(
  ({
    list,
    addElementsToList,
    toggleWorkInList,
    work,
    status,
    elements,
    ToastMessageLabel,
    classLast,
    forceOpen,
    multiple
  }) => {
    return (
      <li
        className={
          `AddToListButton__${list.type} ${classLast}` +
          (multiple ? ' pl-3' : '')
        }
        data-cy={`add-to-list-button-${list.title}`}
        onClick={() => {
          if (isMobileOnly) {
            // Dont auto-close dropdown on mobile devices - multiselection is allowed
            forceOpen();
          }
          if (multiple) {
            addElementsToList(elements);
          } else {
            toggleWorkInList(work);
          }
          toast(
            <ToastMessage
              type="success"
              icon="check_circle"
              lines={[ToastMessageLabel, !multiple && list.title]}
            />
          );
        }}
      >
        {!multiple && (
          <Icon
            name="lens"
            className={
              `md-small ${status && !multiple ? 'pistache pistache-txt' : ''}` +
              (multiple ? ' m-0' : '')
            }
          />
        )}
        <span>{list.title}</span>
      </li>
    );
  }
);

export class AddToListButton extends React.Component {
  state = {show: false};
  // Force dropdown to show
  forceOpen = () => {
    if (!this.state.show) {
      this.setState({show: true});
    }
  };

  // Force dropdown to close
  forceClose = e => {
    if (e.type === 'click') {
      this.setState({show: false});
    }
    if (this.dropdown && this.dropdown.contains(e.target)) {
      // inside click
      return;
    }
    if (this.state.show) {
      this.setState({show: false});
    }
  };
  dropdownDirection = () => {
    if (this.dropdown && this.listContainer) {
      const btn = this.listContainer.getBoundingClientRect();
      const menu = this.dropdown.getBoundingClientRect();
      const bottomSpace = window.innerHeight - btn.bottom;
      const offset = 50;

      if (menu.height + offset < bottomSpace) {
        this.dropdown.classList.add('drop-down');
        this.dropdown.classList.remove('drop-up');
      } else {
        this.dropdown.classList.add('drop-up');
        this.dropdown.classList.remove('drop-down');
      }
    }
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.forceClose);
    document.addEventListener('scroll', this.dropdownDirection);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.forceClose);
    window.removeEventListener('scroll', this.dropdownDirection);
  }

  // Check if a work exist in a list
  pidInList(pid, list) {
    let status = false;
    list.forEach(listWork => {
      if (listWork.pid === pid) {
        status = true;
      }
    });
    return status;
  }

  // Title for addToList button
  constructTitle(defaultTitle, customLists, systemLists) {
    const work = this.props.work;
    const book = work.book;

    // Default titles
    let systemTitle = '';
    let customTitle = '';

    // Construct title based on which lists the work is presented on.
    if (this.props.isLoggedIn) {
      customLists.forEach(list => {
        let status = this.pidInList(book.pid, list.list);
        if (status) {
          customTitle += list.title + ', ';
        }
      });
      systemLists.forEach(list => {
        let status = this.pidInList(book.pid, list.list);
        if (status) {
          systemTitle += list.title + ', ';
        }
      });
    }

    return systemTitle.slice(0, -2) || customTitle.slice(0, -2) || defaultTitle;
  }

  createDropdownElement(list, limit = 99) {
    const elements = this.props.elements || [];
    const work = this.props.work || elements[0];
    const book = work.book;
    const multiple = this.props.multiple;

    return list.map((l, i) => {
      if (i < limit) {
        let status = this.pidInList(book.pid, l.list);
        const ToastMessageLabel = (
          <T
            component="list"
            name={
              multiple
                ? 'booksAddedToList'
                : status
                ? 'toastRemovedFrom'
                : 'toastAddedTo'
            }
            vars={[elements.length, l.title]}
          />
        );

        // Add the "last-class" if the element is last of a kind (Used for custom borders)
        const classLast =
          i + 1 === limit || i + 1 === list.length ? 'last' : '';

        return (
          <MenuEntry
            id={l._id}
            key={l._id}
            status={status}
            elements={elements}
            work={work}
            multiple={multiple}
            ToastMessageLabel={ToastMessageLabel}
            forceOpen={this.forceOpen}
            classLast={classLast}
          />
        );
      }
      return false;
    });
  }

  render() {
    const {
      work,
      isLoggedIn,
      className = '',
      openModal,
      multiple,
      elements,
      getCustomLists,
      getSystemLists
    } = this.props;

    const customLists = getCustomLists();
    const systemLists = getSystemLists();
    const systemListsArr = [systemLists.didRead, systemLists.willRead];

    const defaultTitle = multiple
      ? T({component: 'list', name: 'addAllToList'})
      : T({component: 'list', name: 'addToList'});
    const buttonTitle = multiple
      ? defaultTitle
      : this.constructTitle(defaultTitle, customLists, systemListsArr);

    const buttonActive =
      defaultTitle !== buttonTitle ? 'AddToListButton__Active' : '';

    const newListFromElements = multiple ? [...elements] : [work];
    if (!isLoggedIn) {
      return (
        <div
          className={`${className} ${
            multiple ? 'multiple-works-button-container ' : ''
          }`}
        >
          <Button
            className={
              `AddToListButton` +
              (multiple ? ' multiple-works-to-list-button ' : '')
            }
            type={multiple ? 'tertiary' : 'quinary'}
            size={multiple ? 'large' : 'medium'}
            iconRight="more_vert"
            onClick={() => {
              openModal('login', {
                title: <T component="login" name="modalTitle" />,
                reason: <T component="login" name="modalDescription" />
              });
            }}
          >
            {defaultTitle}
          </Button>
        </div>
      );
    }
    return (
      <div
        ref={e => (this.listContainer = e)}
        data-cy={this.props['data-cy'] || 'add-to-list-btn'}
        className={
          `AddToListButton__Container dropdown ${className}` +
          (multiple ? ' multiple-works-button-container ' : '')
        }
      >
        <Button
          className={`AddToListButton ${buttonActive}`}
          type={multiple ? 'tertiary' : 'quinary'}
          size={multiple ? 'large' : 'medium'}
          id="addtolist"
          iconRight="more_vert"
          onClick={() => {
            if (this.dropdown && !this.dropdown.classList.contains('show')) {
              this.dropdownDirection();
              this.forceOpen();
            }
          }}
        >
          {buttonTitle}
        </Button>

        <ul
          ref={e => (this.dropdown = e)}
          className={`AddToListButton__Dropdown AddToListButton__Dropdown__ShowLists ${
            this.state.show ? 'show' : ''
          }`}
        >
          <li
            className="AddToListButton__Mobile__Back"
            onClick={this.forceClose}
          >
            <Icon name="chevron_left" className="md-medium ml-0" />
            <T component="general" name="back" />
          </li>

          <li className="AddToListButton__Mobile__Input mt-4">
            <Button
              size="medium"
              type="quaternary"
              className=""
              iconLeft={'add'}
              onClick={() => openModal('list', {works: newListFromElements})}
            >
              <T component="list" name="createNew" />
            </Button>
          </li>

          <li className="AddToListButton__Mobile__Heading">
            <T component="general" name="lists" />
          </li>

          {this.state.show && (
            <div className="AddToListButton__Lists">
              {this.createDropdownElement(
                systemListsArr,
                systemListsArr.length
              )}
              {this.createDropdownElement(customLists, customLists.length)}
            </div>
          )}

          <li
            className="border-top d-none d-sm-flex align-items-center"
            onClick={() => {
              openModal('list', {works: newListFromElements});
            }}
            data-cy="add-to-new-list"
          >
            <Icon name="add" />
            <span>
              <T component="list" name="createNew" />
            </span>
          </li>

          <li className="mt-4 AddToListButton__Mobile__Input d-flex justify-content-end d-sm-none align-items-center">
            <Button
              size="medium"
              type="quaternary"
              className="porcelain"
              onClick={this.forceClose}
            >
              <T component="general" name="close" />
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

export const mapDispatchToProps = dispatch => ({
  openModal: (modal, context) => {
    dispatch({
      type: OPEN_MODAL,
      modal: modal,
      context,
      createListAttempt: modal === 'list'
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLists(AddToListButton));
