import React from 'react';
import {connect} from 'react-redux';
import {HISTORY_PUSH_FORCE_REFRESH} from '../../redux/middleware';
import {CLOSE_MODAL} from '../../redux/modal.reducer';
import Kryds from '../svg/KrydsElm.svg';
import ArrowBack from '../svg/ArrowBack.svg';
import {isMobile} from 'react-device-detect';

export function LoginModal({context, closeModal, login}) {
  function renderHeder() {
    if (isMobile) {
      return (
        <div className="login-modal-small-screen-header" onClick={closeModal}>
          <img src={ArrowBack} alt="luk" onClick={closeModal} />
          <p>Tilbage</p>
        </div>
      );
    }
    return (
      <img
        src={Kryds}
        alt="luk"
        className="modal-window--close-btn"
        onClick={closeModal}
      />
    );
  }
  return (
    <div className="modal-container login-modal-container">
      <div className="modal-backdrop" onClick={closeModal} />
      <div className={`modal-window text-left modal-narrow login-modal`}>
        <div className="modal-window--header text-center">{renderHeder()}</div>
        <div className="modal-window--content">
          <h3>{context.title || context}</h3>
          <p>
            <strong>{context.reason || 'Du skal logge ind.'}</strong>
          </p>
          <div className="modal-window--buttons text-center">
            <span className={`btn  modal-window-login-btn`} onClick={login}>
              LOG IND
            </span>
          </div>
          <small>
            <p>
              Har du ikke en profil? Du kan nemt oprette en profil med det
              login, du bruger på biblioteket.{' '}
              <a href={'/v1/login'}>Opret en profil</a>
            </p>
          </small>
        </div>
      </div>
    </div>
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
