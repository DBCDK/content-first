import React from 'react';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';

import './SortableList.css';

const SortableBlock = SortableContainer(({children}) => <div>{children}</div>);

const arrayRemove = (items, index) =>
  index >= items.length ? items : (items.splice(index, 1), items);

export class SortableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: props.items};
    this.listComponent = props.listComponent;
    this.onSortEndHandler = props.onSortEnd;
  }

  notifyParent = () => {
    if (this.onSortEndHandler instanceof Function) {
      this.onSortEndHandler(this.state.items);
    }
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(
      ({items}) => ({
        items: arrayMove(items, oldIndex, newIndex)
      }),
      this.notifyParent
    );
  };

  moveUp = event => {
    let index = parseInt(event.target.getAttribute('index'), 10);
    if (index > 0) {
      this.setState(
        {
          items: arrayMove(this.state.items, index, index - 1)
        },
        this.notifyParent
      );
    }
  };

  moveDown = event => {
    let index = parseInt(event.target.getAttribute('index'), 10);
    if (index < this.state.items.length - 1) {
      this.setState(
        {
          items: arrayMove(this.state.items, index, index + 1)
        },
        this.notifyParent
      );
    }
  };

  remove = event => {
    let index = parseInt(event.target.getAttribute('index'), 10);
    this.setState(
      ({items}) => ({
        items: arrayRemove(items, index)
      }),
      this.notifyParent
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
    return (
      <SortableBlock onSortEnd={this.onSortEnd} lockAxis="y" distance={3}>
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
