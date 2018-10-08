import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import Text from '../base/Text';
import Title from '../base/Title';
import Button from '../base/Button';
import Icon from '../base/Icon';
import BookCover from '../general/BookCover.component';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import './Modal.css';
import {
  updateList,
  storeList,
  getListByIdSelector
} from '../../redux/list.reducer';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';
const getListById = getListByIdSelector();

const SortableItem = SortableElement(({book, index}) => (
  <li className="order-list-element row">
    <div className="col-1">hej</div>
    <div className="col-9">
      <span style={{height: 32, float: 'left', marginRight: 10}}>
        <BookCover book={book} style={{width: 'unset'}} />
      </span>
      <div className="order-list-element-text">
        <Text type="large">{book.title}</Text>
        <Text type="body">{book.creator}</Text>
      </div>
    </div>

    <div className="col-2 d-flex">
      <i
        onClick={index => this.moveUp(index)}
        className="material-icons curser-pointer"
      >
        expand_less
      </i>
      <i className="material-icons">expand_more</i>
    </div>
  </li>
));
const SortableList = SortableContainer(({items}) => {
  return (
    <ul className="reorder-list-element-container">
      {items.map((value, index) => (
        <SortableItem
          pressThreshold={5}
          key={`item-${index}`}
          index={index}
          book={value.book}
          style={{zIndex: 100}}
        />
      ))}
    </ul>
  );
});

export class ReorderListModal extends React.Component {
  constructor(props) {
    super(props);
    console.log('list', props.list);
    this.state = {
      template: props.list.template || 'list',
      public: props.list.public || false,
      social: props.list.social || false,
      open: props.list.open || false,
      updatedList: props.list.list || []
    };
  }

  moveUp(oldIndex) {
    let newIndex = oldIndex + 1;
    console.log(oldIndex, newIndex);

    let updatedList = arrayMove(this.state.updatedList, oldIndex, newIndex);
    this.setState({updatedList});
  }
  moveDown(index) {}
  onSortEnd = ({oldIndex, newIndex}) => {
    //console.log(oldIndex,newIndex)
    let updatedList = arrayMove(this.state.updatedList, oldIndex, newIndex);
    this.setState({updatedList});
  };

  render() {
    const {list, updateListData, close, submit} = this.props;

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
      >
        <SortableList
          items={this.state.updatedList}
          onSortEnd={this.onSortEnd}
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
