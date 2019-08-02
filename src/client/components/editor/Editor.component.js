import React from 'react';
import {connect} from 'react-redux';
import SortableList from '../base/SortableList/SortableList';

import './Editor.css';
import Banner from '../base/Banner';
import Text from '../base/Text';
import Title from '../base/Title';
import T from '../base/T';

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

export class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: defaultItems};
    this.onSortEndHandler = props.onSortEnd;
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
        <Text type="small">{createdBy}</Text>
        {up !== '' ? (
          <i
            className="material-icons drag-indicator up-down"
            index={index}
            onClick={this.moveUp}
          >
            {up}
          </i>
        ) : (
          <div className="material-icons up-down" />
        )}
        {down !== '' ? (
          <i
            className="material-icons drag-indicator up-down"
            index={index}
            onClick={this.moveDown}
          >
            {down}
          </i>
        ) : (
          <div className="material-icons up-down" />
        )}
        {remove !== '' ? (
          <i
            className="material-icons drag-indicator remove"
            index={index}
            onClick={this.remove}
          >
            {remove}
          </i>
        ) : (
          <div className="material-icons remove" />
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
      'delete'
    );

  listComponent = value =>
    this.listContentRow(
      value.children.index,
      value.children.enabled,
      value.children.title,
      value.children.createdBy
    );

  render() {
    return (
      <div className="Editor">
        <Banner
          title={T({component: 'editStartPage', name: 'editStartPage'})}
          className="fixed-width-col-md position-relative"
        />
        <div className="top-bar-dropdown-list-page col-centered">
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
