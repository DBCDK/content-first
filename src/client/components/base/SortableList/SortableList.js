import React from 'react';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';

import './SortableList.css';
import {isMobile} from 'react-device-detect';

const SortableBlock = SortableContainer(({children}) => (
  <div data-cy="sortable-list-container">{children}</div>
));

const arrayRemove = (items, index) =>
  index >= items.length ? items : (items.splice(index, 1), items);

export class SortableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: props.items};
    this.listComponent = props.listComponent;
    this.onSortEndHandler = props.onSortEnd;
  }

  notify = callback => {
    if (callback instanceof Function) {
      callback(this.state.items);
    }
    if (this.onSortEndHandler instanceof Function) {
      this.onSortEndHandler(this.state.items);
    }
  };

  onSortEnd = ({oldIndex, newIndex, callback}) => {
    this.setState(
      ({items}) => ({
        items: arrayMove(items, oldIndex, newIndex)
      }),
      () => this.notify(callback)
    );
  };

  moveUp = (index, callback) => {
    if (index > 0) {
      this.setState(
        {
          items: arrayMove(this.state.items, index, index - 1)
        },
        () => this.notify(callback)
      );
    }
  };

  moveDown = (index, callback) => {
    if (index < this.state.items.length - 1) {
      this.setState(
        {
          items: arrayMove(this.state.items, index, index + 1)
        },
        () => this.notify(callback)
      );
    }
  };

  remove = (index, callback) => {
    this.setState(
      ({items}) => ({
        items: arrayRemove(items, index)
      }),
      () => this.notify(callback)
    );
  };

  update = items => {
    this.setState(() => ({
      items: items
    }));
  };

  render() {
    const {items} = this.state;
    const SortableItem = SortableElement(this.listComponent);
    const sortableProps = isMobile ? {pressDelay: 150} : {distance: 3};
    return (
      <SortableBlock onSortEnd={this.onSortEnd} lockAxis="y" {...sortableProps}>
        {items.map((value, index) => {
          value.index = index;
          return (
            <SortableItem
              className="row order-list-element"
              data-cy="reorder-list-element"
              key={`item-${index}`}
              index={index}
              value={value}
            >
              {value}
            </SortableItem>
          );
        })}
      </SortableBlock>
    );
  }
}

export default SortableList;
