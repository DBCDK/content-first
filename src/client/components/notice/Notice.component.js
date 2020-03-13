import React from 'react';
import {getItem, setItem} from '../../utils/localstorage';
import {useDispatch} from 'react-redux';
import {OPEN_MODAL} from '../../redux/modal.reducer';

const Reason = () => (
  <span>
    Læsekompasset viser i øjeblikket primært forslag til e-bøger og lydbøger med
    direkte link til eReolen. Dette sker, da bibliotekerne holder lukket som
    følge af Corona-situationen. <br /> <br /> Du kan af samme grund ikke
    bestille fysiske bøger til dit bibliotek.
  </span>
);
export default () => {
  const dispatch = useDispatch();
  const haveReadCoronaNotice = getItem('haveReadCoronaNotice', 1, false);
  if (!haveReadCoronaNotice) {
    dispatch({
      type: OPEN_MODAL,
      modal: 'confirm',
      context: {
        title: 'Vi fokuserer på e-bøger og lydbøger',
        reason: <Reason />,
        confirmText: 'OK',
        hideCancel: true,
        onConfirm: () => {
          setItem('haveReadCoronaNotice', true, 1);
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
