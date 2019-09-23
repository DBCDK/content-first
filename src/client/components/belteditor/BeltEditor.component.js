import React from 'react';
import {connect} from 'react-redux';
import SortableList from '../base/SortableList/SortableList';

import './BeltEditor.css';
import Banner from '../base/Banner';
import Text from '../base/Text';
import Title from '../base/Title';
import T from '../base/T';
import Button from '../base/Button';
import Link from '../general/Link.component';
import {withObjects} from '../hoc/Storage/withObjects.hoc';
import {isEqual} from 'lodash';
import Storage from '../roles/Storage.component';
import Spinner from '../general/Spinner/Spinner.component';

const EditorRole = 'contentFirstEditor';

export class BeltEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: []};
    this.sortableList = React.createRef();
  }

  componentDidMount() {
    this.defaultValuesLoaded = false;
  }
  ascending = (a, b) => a.index - b.index;

  updateSortableList = items => {
    if (!this.props.objects.fetching) {
      this.sortableList.current.update(items);
    }
  };

  componentDidUpdate() {
    if (
      !this.defaultValuesLoaded &&
      !isEqual(this.props.objects.objects, this.state.items)
    ) {
      // Initial update
      this.setState({
        items: this.props.objects.objects,
        loading: this.props.objects.fetching
      });
      this.updateSortableList(this.props.objects.objects.sort(this.ascending));
      this.defaultValuesLoaded = true;
    } else {
      // All updates except initial update
      this.updateSortableList(this.state.items.sort(this.ascending));
    }
  }

  updateStorage = (update, items) => {
    if (Array.isArray(items)) {
      items.forEach(item => {
        item._rev = ''; // Suppress overwrite error
        update(item);
      });
    }
  };

  onSortEnd = (update, items) => {
    this.setState({items: items}, this.updateStorage(update, items));
  };

  moveUp = (update, index) => {
    this.sortableList.current.moveUp(index, items =>
      this.updateStorage(update, items)
    );
  };

  moveDown = (update, index) => {
    this.sortableList.current.moveDown(index, items =>
      this.updateStorage(update, items)
    );
  };

  remove = (remove, index) => {
    this.sortableList.current.remove(index);
    remove(this.state.items.find(e => e.index === index));
  };

  enableDisable = (update, index) => {
    if (index < this.state.items.length) {
      let newItems = this.state.items;
      newItems[index].onFrontPage = !newItems[index].onFrontPage;
      this.setState({items: newItems});
      update(newItems[index]);
    }
  };

  listRow = (
    index,
    dragIcon,
    visibilityIcon,
    title,
    createdBy,
    upIcon,
    downIcon,
    removeIcon,
    className = ''
  ) => (
    <div
      className={
        'order-list-element' + (className !== '' ? ' ' + className : '')
      }
      data-cy="reorder-list-element"
    >
      <div className="flex-container">
        <i className="material-icons drag-indicator drag">{dragIcon}</i>
        {typeof visibilityIcon === 'string' ? (
          <i className="material-icons drag-indicator">{visibilityIcon}</i>
        ) : (
          <Storage
            role={EditorRole}
            render={({update}) => (
              <i
                className={
                  'material-icons drag-indicator ' +
                  (visibilityIcon ? 'enabled' : 'disabled')
                }
                index={index}
                onClick={() => this.enableDisable(update, index)}
              >
                fiber_manual_record
              </i>
            )}
          />
        )}
        <Text type="small" variant="weight-semibold">
          {title}
        </Text>
        <Text type="small" className="desktop-only-column">
          {createdBy}
        </Text>
        {upIcon !== '' ? (
          <Storage
            role={EditorRole}
            render={({update}) => (
              <i
                className="material-icons drag-indicator up-down desktop-only-column"
                index={index}
                onClick={() => this.moveUp(update, index)}
              >
                {upIcon}
              </i>
            )}
          />
        ) : (
          <div className="material-icons up-down desktop-only-column" />
        )}
        {downIcon !== '' ? (
          <Storage
            role={EditorRole}
            render={({update}) => (
              <i
                className="material-icons drag-indicator up-down desktop-only-column"
                index={index}
                onClick={() => this.moveDown(update, index)}
              >
                {downIcon}
              </i>
            )}
          />
        ) : (
          <div className="material-icons up-down desktop-only-column" />
        )}
        {removeIcon !== '' ? (
          <Storage
            role={EditorRole}
            render={({remove}) => (
              <i
                className="material-icons drag-indicator remove desktop-only-column"
                index={index}
                onClick={() => this.remove(remove, index)}
              >
                {removeIcon}
              </i>
            )}
          />
        ) : (
          <div className="material-icons remove desktop-only-column" />
        )}
      </div>
    </div>
  );

  listTitleRow = (title, createdBy) =>
    this.listRow(
      -1 /* not used in the title row */,
      'swap_vert',
      'remove_red_eye',
      title,
      createdBy,
      '',
      '',
      '',
      'list-title-row'
    );

  listContentRow = (index, enabled, title, createdBy) =>
    this.listRow(
      index,
      'drag_indicator',
      enabled,
      title,
      createdBy,
      'keyboard_arrow_up',
      'keyboard_arrow_down',
      'delete',
      'list-content-row'
    );

  listComponent = value =>
    this.listContentRow(
      value.children.index,
      value.children.onFrontPage,
      value.children.name,
      value.children._owner // Find real user name, and not owner id
    );

  render() {
    return (
      <div className="BeltEditor">
        <Banner
          title={T({component: 'editStartPage', name: 'editStartPage'})}
          className="fixed-width-col-md position-relative"
        />
        <div className="BeltEditor__container col-centered">
          <Title type="title5">
            <T component="editStartPage" name="belt" />
          </Title>
          <Text type="body" variant="weight-semibold">
            <T component="editStartPage" name="order" />
          </Text>
          {this.listTitleRow(
            T({component: 'editStartPage', name: 'title'}),
            T({component: 'editStartPage', name: 'createdBy'})
          )}
          <Storage
            role={EditorRole}
            render={({update}) =>
              this.state.loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner size="30px" className="mt-5" />
                </div>
              ) : (
                <SortableList
                  items={this.state.items}
                  listComponent={this.listComponent}
                  onSortEnd={items => this.onSortEnd(update, items)}
                  ref={this.sortableList}
                />
              )
            }
          />
          <Link href="/redaktionen/opret">
            <Button
              type="quaternary"
              size="medium"
              dataCy="create-new-row-button"
            >
              <T component="editStartPage" name="createNewBelt" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default connect()(withObjects(BeltEditor, {type: 'belt'}));
