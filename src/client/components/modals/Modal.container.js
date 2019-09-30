import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import OrderModal from './OrderModal.container';
import LoginModal from './LoginModal.component';
// import ProfileModal from './ProfileModal/ProfileModal.component';
import ConfirmModal from './ConfirmModal.component';
import ListSettingsModal from './ListSettingsModal.container';
import ReorderListModal from './ReorderListModal.container';
import ListModal from './ListModal/ListModal.component';
import ShowReviewModal from './ShowReviewModal.component';
import CompareBooksModal from './CompareBooksModal.component';

import {CLOSE_MODAL} from '../../redux/modal.reducer';

class Modal extends React.Component {
  render() {
    const anyOpen = ms => {
      const modals = Object.keys(ms);
      for (let i = 0; i < modals.length; i++) {
        const modal = modals[i];
        if (ms[modal].open) {
          return true;
        }
      }
      return false;
    };

    let rootView = document.getElementById('root');
    let scrollArea = document.getElementById('scrollableArea');
    //
    if (scrollArea && rootView) {
      if (anyOpen(this.props.modalState)) {
        let orig = scrollArea.getBoundingClientRect();
        rootView.style.height = '100vh';
        scrollArea.style.marginTop = orig.top - 80 + 'px';
      } else {
        rootView.style.height = 'auto';
        let fixedScrollPos =
          Math.abs(scrollArea.getBoundingClientRect().top) + 80;
        scrollArea.style.marginTop = 0;
        window.scrollTo(0, fixedScrollPos);
      }
    }

    let modal = null;

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
          close={this.props.close('list')}
          {...this.props.modalState.list.context}
        />
      );
    }
    if (this.props.modalState.showReview.open) {
      modal = (
        <ShowReviewModal context={this.props.modalState.showReview.context} />
      );
    }

    if (this.props.modalState.compare.open) {
      modal = (
        <CompareBooksModal context={this.props.modalState.compare.context} />
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

const mapStateToProps = state => ({
  modalState: state.modalReducer
});

const mapDispatchToProps = dispatch => ({
  close: modal => () => dispatch({type: CLOSE_MODAL, modal})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
