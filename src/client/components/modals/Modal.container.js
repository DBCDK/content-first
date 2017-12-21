import React from 'react';
import {connect} from 'react-redux';
import AddToListModal from './AddToListModal.component';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

class Modal extends React.Component {
  render() {
    if (this.props.modalState.addToList.open) {
      const {context} = this.props.modalState.addToList;
      return (
        <AddToListModal
          work={context}
          lists={this.props.listState.lists}
          onClose={() =>
            this.props.dispatch({type: CLOSE_MODAL, modal: 'addToList'})
          }
          dispatch={this.props.dispatch}
        />
      );
    }
    return '';
  }
}

export default connect(
  // Map redux state to props
  state => {
    return {
      listState: state.listReducer,
      modalState: state.modalReducer
    };
  }
)(Modal);
