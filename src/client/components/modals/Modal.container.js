import React from 'react';
import {connect} from 'react-redux';
import AddToListModal from './AddToListModal.container';
import OrderModal from './OrderModal.container';
import LoginModal from './LoginModal.component';
import ProfileModal from './ProfileModal.component';
import ConfirmModal from './ConfirmModal.component';
import ListSettingsModal from './ListSettingsModal.container';
import ReorderListModal from './ReorderListModal.container';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
        modal = <AddToListModal key="addToList" works={context} />;
      } else {
        modal = <AddToListModal key="addToList" work={context} />;
      }
    }
    if (this.props.modalState.order.open) {
      modal = <OrderModal key="order" />;
    }
    if (this.props.modalState.login.open) {
      modal = <LoginModal context={this.props.modalState.login.context} />;
    }
    if (this.props.modalState.profile.open) {
      modal = <ProfileModal context={this.props.modalState.profile.context} />;
    }
    if (this.props.modalState.confirm.open) {
      modal = <ConfirmModal context={this.props.modalState.confirm.context} />;
    }
    if (this.props.modalState.listSettings.open) {
      modal = (
        <ListSettingsModal
          context={this.props.modalState.listSettings.context}
        />
      );
    }

    if (this.props.modalState.reorderList.open) {
      modal = (
        <ReorderListModal context={this.props.modalState.reorderList.context} />
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

export default connect(
  // Map redux state to props
  state => {
    return {
      modalState: state.modalReducer
    };
  }
)(Modal);
