import React from 'react';
import {getItem, setItem} from '../../utils/localstorage';
import {useDispatch} from 'react-redux';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import config from '../../utils/config';

import './Notice.css';

const Reason = () => (
  <div className="Notice">
    <p>
      Husk at du kan filtrere efter e-bøger og/eller lydbøger, når du har
      foretaget en søgning.
    </p>
    <p>Så bliver du kun præsenteret for bøger, som du kan låne på eReolen.</p>
    <p>
      Se efter bøger med disse knapper{' '}
      <img
        className="Notice-inline-image"
        src="img/general/filter-buttons-teaser.png"
      ></img>
    </p>
  </div>
);
export default () => {
  if (!config.showNotice) {
    return '';
  }
  const dispatch = useDispatch();
  const haveReadCoronaNotice = getItem('haveReadCoronaNotice2', 1, false);
  if (!haveReadCoronaNotice) {
    setItem('haveReadCoronaNotice2', true, 1);
    dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: 'Har dit bibliotek lukket for reservationer?',
        reason: <Reason />,
        confirmText: 'OK',
        hideCancel: true,
        onConfirm: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'confirm'
          });
        }
      }
    });
  }
  return '';
};
