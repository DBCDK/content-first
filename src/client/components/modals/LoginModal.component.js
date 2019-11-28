import React from 'react';
import {connect} from 'react-redux';
import T from '../base/T/';
import Modal from './Modal/Modal.component';
import Text from '../base/Text';
import Button from '../base/Button';
import {HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

export function LoginModal({context, closeModal, login}) {
  return (
    <Modal
      className="login-modal"
      header={context.title || context}
      onClose={closeModal}
      hideConfirm={true}
      hideCancel={true}
      url={'/v1/auth/login'}
    >
      <p>
        {context.reason || <T component="login" name="modalNoContextReason" />}
      </p>
      <div className="modal-window--buttons">
        <Button
          type="quaternary"
          className={`modal-window-login-btn`}
          onClick={login}
        >
          <T component="login" name="loginButton" />
        </Button>
      </div>
      <Text type="small" className="loginmodal-create-profile-text">
        <T component="login" name="modalCreateProfileText" />{' '}
        <a href={'/v1/auth/login'}>
          <T component="login" name="modalCreateProfileLink" />
        </a>
      </Text>
    </Modal>
  );
}
function mapStateToProps() {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    closeModal: () => dispatch({type: CLOSE_MODAL, modal: 'login'}),
    login: () => {
      dispatch({
        type: HISTORY_PUSH_FORCE_REFRESH,
        path: '/v1/auth/login'
      });
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
