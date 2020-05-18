import React from 'react';
import {getItem, setItem} from '../../utils/localstorage';
import {useDispatch} from 'react-redux';
import {OPEN_MODAL} from '../../redux/modal.reducer';

const Reason = () => (
  <span>
    De fleste biblioteker har igen åbent for lån af bøger, og Læsekompasset
    giver derfor igen inspiration til al skønlitteratur på dansk for voksne, som
    kan findes på bibliotekerne – både fysiske bøger, samt e-bøger og lydbøger
    på eReolen. Når du logger på med dit bibliotekslogin kan du bestille bøger
    til dit bibliotek, hvis biblioteket har abonnement.
  </span>
);
export default () => {
  const dispatch = useDispatch();
  const haveReadNotice = getItem('haveReadNotice', 1, false);
  if (!haveReadNotice) {
    setItem('haveReadNotice', true, 1);
    dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: 'Bibliotekerne åbner for udlån',
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
