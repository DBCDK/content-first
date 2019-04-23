import React from 'react';
import {connect} from 'react-redux';
import {isMobile} from 'react-device-detect';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';

import Modal from './Modal/Modal.component';
import Text from '../base/Text';
import BookCover from '../general/BookCover/BookCover.component';

import {
  updateList,
  storeList,
  getListByIdSelector
} from '../../redux/list.reducer';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

const getListById = getListByIdSelector();

const SortableItem = SortableElement(({book, moveUp, moveDown, className}) => (
  <li
    className={'order-list-element d-flex align-items-middle' + className}
    data-cy="reorder-list-element"
  >
    <i className="material-icons drag-indicator">drag_indicator</i>

    <div className="ml-2 w-75">
      <span style={{height: 32, float: 'left', marginRight: 10, marginTop: 3}}>
        <BookCover book={book} style={{width: 'unset'}} />
      </span>
      <div className="order-list-element-text">
        <Text type="large" data-cy="reorder-list-element-title">
          {book.title}
        </Text>
        <Text type="body">{book.creator}</Text>
      </div>
    </div>

    <div className="d-none d-md-flex p-0 justify-content-between ml-auto">
      <i
        onClick={moveUp}
        className="material-icons curser-pointer"
        data-cy="order-list-element-moveup"
      >
        expand_less
      </i>
      <i className="material-icons curser-pointer" onClick={moveDown}>
        expand_more
      </i>
    </div>
  </li>
));
const SortableList = SortableContainer(
  ({items, moveUp, moveDown, movedElementIndex}) => {
    return (
      <ul className="reorder-list-element-container mt-4">
        {items.map((value, index) => (
          <SortableItem
            className={index === movedElementIndex ? 'highlight-element' : ' '}
            pressThreshold={5}
            key={`item-${index}`}
            index={index}
            book={value.book}
            style={{zIndex: 100}}
            moveUp={() => moveUp(index)}
            moveDown={() => moveDown(index)}
          />
        ))}
      </ul>
    );
  }
);

export class ReorderListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      template: props.list.template || 'list',
      public: props.list.public || false,
      social: props.list.social || false,
      open: props.list.open || false,
      updatedList: props.list.list || [],
      movedElementIndex: null
    };
  }

  moveUp(oldIndex) {
    let newIndex = oldIndex === 0 ? 0 : oldIndex - 1;
    this.setState({movedElementIndex: -1});

    let updatedList = arrayMove(this.state.updatedList, oldIndex, newIndex);
    this.setState({updatedList: updatedList});
    setTimeout(() => this.setState({movedElementIndex: newIndex}), 1);
  }
  moveDown(oldIndex) {
    let maxIndex = this.state.updatedList.length - 1;

    let newIndex = oldIndex === maxIndex ? maxIndex : oldIndex + 1;
    this.setState({movedElementIndex: -1});
    let updatedList = arrayMove(this.state.updatedList, oldIndex, newIndex);
    this.setState({updatedList: updatedList});
    setTimeout(() => this.setState({movedElementIndex: newIndex}), 1);
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    let updatedList = arrayMove(this.state.updatedList, oldIndex, newIndex);

    this.setState({updatedList});
    this.setState({updatedList: updatedList, movedElementIndex: null});
  };

  render() {
    const {list, updateListData, close, submit} = this.props;
    const sortableProps = isMobile ? {pressDelay: 150} : {distance: 3};
    return (
      <Modal
        header="REDIGER RÆKKEFØLGE"
        onClose={this.props.close}
        onDone={() => {
          updateListData({
            _id: list._id,
            list: this.state.updatedList
          });
          submit(list);
          close();
        }}
        doneText="Gem ændringer"
        cancelText="Fortryd"
        className="reorder-list-modal-window"
      >
        <SortableList
          items={this.state.updatedList}
          onSortEnd={this.onSortEnd}
          moveUp={this.moveUp.bind(this)}
          moveDown={this.moveDown.bind(this)}
          lockAxis="y"
          movedElementIndex={this.state.movedElementIndex}
          {...sortableProps}
        />
      </Modal>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  list: getListById(state, {_id: ownProps.context._id})
});
const mapDispatchToProps = dispatch => ({
  submit: list => dispatch(storeList(list._id)),
  updateListData: data => dispatch(updateList(data)),
  close: () => dispatch({type: CLOSE_MODAL, modal: 'reorderList'})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReorderListModal);
