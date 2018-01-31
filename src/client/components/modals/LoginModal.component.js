import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import {HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

export function LoginModal({context, closeModal, login}) {
  return (
    <Modal
      className="short-list--merge-modal"
      header={context.title}
      onClose={closeModal}
      onDone={login}
      doneText="LOG IND"
    >
      <p>
        <strong>{context.reason || 'Du skal logge ind.'}</strong>
      </p>
      <small>
        <p>
          Har du ikke en profil? Du kan nemt oprette en profil med det login, du
          bruger på biblioteket.
        </p>
        <p>Klik på login for at oprette en profil.</p>
      </small>
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
        path: '/v1/login'
      });
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
