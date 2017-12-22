import React from 'react';
import {connect} from 'react-redux';
import AddToListModal from './AddToListModal.component';
import ShortListMergeModal from './ShortListMergeModal.container';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

class Modal extends React.Component {
  static anyOpen(modalState) {
    const modals = Object.keys(modalState);
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      if (modalState[modal].open) {
        return true;
      }
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    const openCurrent = Modal.anyOpen(this.props.modalState);
    const openNext = Modal.anyOpen(nextProps.modalState);

    if (openCurrent !== openNext) {
      if (openNext) {
        this.bodyScrollTop = document.body.scrollTop;
        this.documentElementScrollTop = document.documentElement.scrollTop;
        // document.body.classList.add('modal-open'); // super slow on ipad safari
        // document.body.setAttribute('style', 'position:fixed; overflow-y: hidden; top: 0; bottom: 0; left: 0; right: 0;'); // super slow on ipad safari
        document.body.setAttribute(
          'style',
          'position:fixed; top: 0; bottom: 0; left: 0; right: 0;'
        );
      } else {
        document.body.setAttribute('style', '');
        document.body.scrollTop = this.bodyScrollTop;
        document.documentElement.scrollTop = this.documentElementScrollTop;
      }
    }
  }

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
    if (this.props.modalState.mergeShortList.open) {
      return <ShortListMergeModal />;
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
