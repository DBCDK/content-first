import React from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {isMobileOnly} from 'react-device-detect';
import Icon from '../../base/Icon';
import ToastMessage from '../../base/ToastMessage';
import Button from '../../base/Button';
import T from '../../base/T/';
import {withList} from '../../hoc/List/';
import {OPEN_MODAL} from '../../../redux/modal.reducer';
import isInViewport from '../../../utils/isInViewport';
import scrollDirection from '../../../utils/scrollDirection';
import {
  CUSTOM_LIST,
  SYSTEM_LIST,
  createGetLists
} from '../../../redux/list.reducer';
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
        data-cy="add-to-list-button"
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
              `md-xsmall ${
                status && !multiple ? 'pistache pistache-txt' : ''
              }` + (multiple ? ' m-0' : '')
            }
          />
        )}
        <span>{list.title}</span>
      </li>
    );
  }
);

export class AddToListButton extends React.Component {
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

  // Force dropdown to show
  forceOpen = () => {
    if (this.dropdown) {
      this.dropdown.classList.add('show');
    }
  };

  // Force dropdown to close
  forceClose = () => {
    if (this.dropdown) {
      this.dropdown.classList.remove('show');
    }
  };

  dropdownDirection = () => {
    if (this.dropdown) {
      console.log('isInViewport', isInViewport(this.dropdown));

      const btn = this.listContainer.getBoundingClientRect();
      const menu = this.dropdown.getBoundingClientRect();
      const offset = 50;

      console.log('el', btn);

      const topSpace = btn.top;
      const bottomSpace = window.innerHeight - btn.bottom;
      menu.height;

      console.log('top: ', topSpace, 'bottom', bottomSpace);

      if (menu.height + offset < bottomSpace) {
        console.log('should drop-down');
        this.dropdown.classList.add('drop-down');
        this.dropdown.classList.remove('drop-up');
      } else {
        console.log('should drop-up');
        this.dropdown.classList.add('drop-up');
        this.dropdown.classList.remove('drop-down');
      }
    }
  };

  // Title for addToList button
  constructTitle(defaultTitle) {
    const work = this.props.work;
    const book = work.book;

    // Default titles
    let systemTitle = '';
    let customTitle = '';

    // Construct title based on which lists the work is presented on.
    if (this.props.isLoggedIn) {
      this.props.customLists.forEach(list => {
        let status = this.pidInList(book.pid, list.list);
        if (status) {
          customTitle += list.title + ', ';
        }
      });
      this.props.systemLists.forEach(list => {
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
      customLists = [],
      systemLists = [],
      openModal,
      multiple,
      elements
    } = this.props;

    const defaultTitle = multiple
      ? T({component: 'list', name: 'addAllToList'})
      : T({component: 'list', name: 'addToList'});
    const buttonTitle = multiple
      ? defaultTitle
      : this.constructTitle(defaultTitle);

    const buttonActive =
      defaultTitle !== buttonTitle ? 'AddToListButton__Active' : '';

    const newListFromElements = multiple ? [...elements] : [work];
    if (!isLoggedIn) {
      return (
        <div className={multiple ? 'multiple-works-button-container ' : ''}>
          <Button
            className={
              `AddToListButton ${className}` +
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
        className={
          `AddToListButton__Container dropdown ${className}` +
          (multiple ? ' multiple-works-button-container ' : '')
        }
        data-cy={this.props['data-cy'] || 'add-to-list-btn'}
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
          className="AddToListButton__Dropdown drop-bottom AddToListButton__Dropdown__ShowLists dropdown-menu"
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

          <div className="AddToListButton__Lists">
            {this.createDropdownElement(systemLists, systemLists.length)}
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            {this.createDropdownElement(customLists, customLists.length)}
          </div>

          <li className="AddToListButton__Mobile__Heading">{'test'}</li>

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
)(AddToListButton);
