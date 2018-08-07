import React from 'react';
import DragSvg from '../svg/drag.svg';
class DragableListItem extends React.PureComponent {
  render() {
    const {onDrag, onRemove, onHover, item, children, isDragging} = this.props;
    return (
      <div
        className="drag-item flex"
        style={{opacity: isDragging ? 0.5 : 1}}
        onMouseEnter={e => onHover(e, item)}
      >
        <img
          onMouseDown={e => onDrag(e, item)}
          src={DragSvg}
          alt="drag book"
          className="drag-item__dragger"
        />
        {children}
        <div>
          <span className="list-item__close" onClick={e => onRemove(item, e)} />
        </div>
      </div>
    );
  }
}

const DragableSelectedItem = ({x, y, children}) => (
  <div
    className="drag-item flex selected"
    draggable="false"
    style={{
      pointerEvents: 'none',
      zIndex: 10,
      left: x,
      top: y,
      position: 'absolute'
    }}
  >
    <img src={DragSvg} alt="drag book" className="drag-item__dragger" />
    {children}
  </div>
);

class DragableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
      selectedItem: null,
      isDragging: false,
      x: 0,
      y: 0,
      diffX: 0,
      diffY: 0
    };
  }
  onDrag = (e, selectedItem) => {
    e.preventDefault();
    const diffX = e.clientX - e.target.offsetLeft;
    const diffY = e.clientY - e.target.offsetTop + 30;
    const x = e.clientX - diffX;
    const y = e.clientY - diffY;
    this.setState({x, y, isDragging: true, diffX, diffY, selectedItem});
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onDrop);
  };
  onMove = e => {
    const x = e.clientX - this.state.diffX;
    const y = e.clientY - this.state.diffY;
    this.setState({x, y});
  };

  onDrop = e => {
    e.preventDefault();
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onDrop);
    this.setState({isDragging: false, x: 0, y: 0, selectedItem: null});
  };

  onHover = (e, item) => {
    if (!this.state.selectedItem || item === this.state.selectedItem) {
      return;
    }
    const list = this.props.list.filter(
      listItem => listItem._id !== this.state.selectedItem._id
    );
    const index = this.props.list.indexOf(item);
    list.splice(index, 0, this.state.selectedItem);
    this.props.onUpdate(list);
  };

  onChangeDescription = (item, description) => {
    const list = this.props.list.map(listItem => {
      if (listItem === item) {
        item.description = description;
      }
      return listItem;
    });
    this.props.onUpdate(list);
  };
  renderListItem(item) {
    return (
      <DragableListItem
        ref={item.book.pid}
        key={item.book.pid}
        onDrag={this.onDrag}
        onRemove={this.props.onRemove}
        onHover={this.onHover}
        item={item}
        isDragging={this.state.selectedItem === item}
      >
        {this.props.renderListItem({item, onChange: this.onChangeDescription})}
      </DragableListItem>
    );
  }
  renderDraggingItem() {
    if (this.state.selectedItem) {
      return (
        <DragableSelectedItem
          onDrop={this.onDrop}
          x={this.state.x}
          y={this.state.y}
        >
          {this.props.renderListItem({item: this.state.selectedItem})}
        </DragableSelectedItem>
      );
    }
  }
  render() {
    return (
      <div
        className={`drag-list ${this.state.selectedItem ? 'is-dragging' : ''}`}
      >
        {this.renderDraggingItem()}
        {this.props.list.map(item => this.renderListItem(item))}
      </div>
    );
  }
}

export default DragableList;
