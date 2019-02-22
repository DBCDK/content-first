import React from 'react';
import {connect} from 'react-redux';
import AddToListModal from './AddToListModal.container';
import OrderModal from './OrderModal.container';
import LoginModal from './LoginModal.component';
import ConfirmModal from './ConfirmModal.component';
import ListSettingsModal from './ListSettingsModal.container';
import ReorderListModal from './ReorderListModal.container';
import ListModal from './ListModal.component';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
    let modal = null;
    if (this.props.modalState.addToList.open) {
      const {context} = this.props.modalState.addToList;
      if (Array.isArray(context)) {
        modal = (
          <AddToListModal
            key="addToList"
            works={context}
            close={this.props.close('addToList')}
          />
        );
      } else {
        modal = (
          <AddToListModal
            key="addToList"
            work={context}
            close={this.props.close('addToList')}
          />
        );
      }
    }
    if (this.props.modalState.order.open) {
      modal = <OrderModal key="order" close={this.props.close('order')} />;
    }
    if (this.props.modalState.login.open) {
      modal = (
        <LoginModal
          context={this.props.modalState.login.context}
          close={this.props.close('login')}
        />
      );
    }
    if (this.props.modalState.confirm.open) {
      modal = (
        <ConfirmModal
          context={this.props.modalState.confirm.context}
          close={this.props.close('confirm')}
        />
      );
    }
    if (this.props.modalState.listSettings.open) {
      modal = (
        <ListSettingsModal
          context={this.props.modalState.listSettings.context}
          close={this.props.close('listSettings')}
        />
      );
    }
    if (this.props.modalState.reorderList.open) {
      modal = (
        <ReorderListModal
          context={this.props.modalState.reorderList.context}
          close={this.props.close('reorderList')}
        />
      );
    }
    if (this.props.modalState.list.open) {
      modal = (
        <ListModal
          context={this.props.modalState.list.context}
          close={this.props.close('list')}
        />
      );
    }
    return (
      <ReactCSSTransitionGroup
        transitionName="modal"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {modal}
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  modalState: state.modalReducer
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  close: modal => () => dispatch({type: CLOSE_MODAL, modal})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
