import React from 'react';
import {connect} from 'react-redux';
import SortableList from '../base/SortableList/SortableList';

import './Editor.css';
import Banner from '../base/Banner';
import Text from '../base/Text';
import Title from '../base/Title';
import T from '../base/T';
import Button from '../base/Button';

const defaultItems = [
  {
    enabled: true,
    title: 'Norske superromaner',
    createdBy: 'Bibliotekar Sarah'
  },
  {
    enabled: true,
    title: 'Franske fristelser',
    createdBy: 'Christian Ertmann-Christiansen'
  },
  {
    enabled: false,
    title: 'Uhygge bag hjemmets fire vægge',
    createdBy: 'Bibliotekar Sarah'
  }
];

const newItem = {
  enabled: false,
  title: 'Ny titel',
  createdBy: 'Ny forfatter'
};

export class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: defaultItems};
  }

  onSortEnd = items => {
    this.setState({items: items});
  };

  moveUp = event => this.refs.sortableList.moveUp(event);
  moveDown = event => this.refs.sortableList.moveDown(event);
  remove = event => this.refs.sortableList.remove(event);

  enableDisable = event => {
    let index = parseInt(event.target.getAttribute('index'), 10);
    if (index < this.state.items.length) {
      this.state.items[index].enabled = !this.state.items[index].enabled;
      this.setState({items: this.state.items});
    }
  };

  listRow = (
    index,
    dragIcon,
    visibility,
    title,
    createdBy,
    up,
    down,
    remove,
    className = ''
  ) => (
    <div
      className={
        'order-list-element' + (className !== '' ? ' ' + className : '')
      }
      data-cy="reorder-list-element"
    >
      <div className="flex-container">
        <i className="material-icons drag-indicator">{dragIcon}</i>
        {typeof visibility === 'string' ? (
          <i className="material-icons drag-indicator">{visibility}</i>
        ) : (
          <i
            className={
              'material-icons drag-indicator ' +
              (visibility ? 'enabled' : 'disabled')
            }
            index={index}
            onClick={this.enableDisable}
          >
            fiber_manual_record
          </i>
        )}
        <Text type="small" variant="weight-semibold">
          {title}
        </Text>
        <Text type="small" className="desktop-only-column">
          {createdBy}
        </Text>
        {up !== '' ? (
          <i
            className="material-icons drag-indicator up-down desktop-only-column"
            index={index}
            onClick={this.moveUp}
          >
            {up}
          </i>
        ) : (
          <div className="material-icons up-down desktop-only-column" />
        )}
        {down !== '' ? (
          <i
            className="material-icons drag-indicator up-down desktop-only-column"
            index={index}
            onClick={this.moveDown}
          >
            {down}
          </i>
        ) : (
          <div className="material-icons up-down desktop-only-column" />
        )}
        {remove !== '' ? (
          <i
            className="material-icons drag-indicator remove desktop-only-column"
            index={index}
            onClick={this.remove}
          >
            {remove}
          </i>
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
      value.children.enabled,
      value.children.title,
      value.children.createdBy
    );

  createNewBelt = () => {
    this.setState(state => {
      const items = [Object.assign({}, newItem)].concat(state.items);
      this.refs.sortableList.update(items);
      return {items};
    });
  };

  render() {
    return (
      <div className="Editor">
        <Banner
          title={T({component: 'editStartPage', name: 'editStartPage'})}
          className="fixed-width-col-md position-relative"
        />
        <div className="Editor__container col-centered">
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
          <SortableList
            items={this.state.items}
            listComponent={this.listComponent}
            onSortEnd={this.onSortEnd}
            ref="sortableList"
          />
          <Button type="quaternary" size="medium" onClick={this.createNewBelt}>
            <T component="editStartPage" name="createNewBelt" />
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
