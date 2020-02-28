import React, {useReducer} from 'react';
import T from '../../base/T';

const ALLBOOKS = 'Bog';
const EBOOKS = 'Ebog';
const AUDIOBOOKS = 'Lydbog (net)';

function changeBtn(state, action) {
  const {type, changeType} = action;
  let retType;
  switch (state.selected) {
    case EBOOKS:
      if (type === EBOOKS) {
        retType = ALLBOOKS;
      } else if (type === AUDIOBOOKS) {
        retType = EBOOKS + ',' + AUDIOBOOKS;
      } else {
        retType = ALLBOOKS;
      }
      break;
    case AUDIOBOOKS:
      if (type === AUDIOBOOKS) {
        retType = ALLBOOKS;
      } else if (type === EBOOKS) {
        retType = EBOOKS + ',' + AUDIOBOOKS;
      } else {
        retType = ALLBOOKS;
      }
      break;
    case EBOOKS + ',' + AUDIOBOOKS:
      if (type === AUDIOBOOKS) {
        retType = EBOOKS;
      } else if (type === EBOOKS) {
        retType = AUDIOBOOKS;
      } else {
        retType = 'Bog';
      }
      break;
    case ALLBOOKS:
      retType = type;
      break;
    default:
      retType = type;
      break;
  }
  changeType(retType);
  return {selected: retType};
}

function ResultsFilter(props) {
  const {changeType, type, init, disabled} = props;

  const [state, dispatch] = useReducer(
    changeBtn,
    {
      type,
      changeType
    },
    init
  );
  const getSelected = btn => {
    const selected = state.selected && !disabled ? state.selected : ALLBOOKS;
    let multiSelected = selected.split(',');
    if (btn === multiSelected[0] || btn === multiSelected[1]) {
      return 'filter-selected';
    }
    return '';
  };

  const getDisabled = () => {
    if (disabled) {
      return 'filter-disabled';
    }
    return '';
  };

  return (
    <div className={'results-filter ' + getDisabled()}>
      <div className="filter-button-container">
        <span
          className={'results-filter-button ' + getSelected(ALLBOOKS)}
          id={ALLBOOKS}
          onClick={() => {
            if (!disabled) {
              dispatch({type: ALLBOOKS, changeType});
            }
          }}
        >
          <T component="filter" name="allbooks" />
        </span>
        <span
          className={'results-filter-button ' + getSelected(EBOOKS)}
          id={EBOOKS}
          onClick={() => {
            if (!disabled) {
              dispatch({type: EBOOKS, changeType});
            }
          }}
        >
          <T component="filter" name="ebooks" />
        </span>
        <span
          className={'results-filter-button ' + getSelected(AUDIOBOOKS)}
          id={AUDIOBOOKS}
          onClick={() => {
            if (!disabled) {
              dispatch({type: AUDIOBOOKS, changeType});
            }
          }}
        >
          <T component="filter" name="audiobooks" />
        </span>
      </div>
    </div>
  );
}

export default ResultsFilter;
