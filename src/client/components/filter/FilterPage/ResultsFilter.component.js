import React, {useReducer} from 'react';

const ALLBOOKS = 'Bog';
const EBOOKS = 'Ebog';
const AUDIOBOOKS = 'Lydbog (net)';

function changeBtn(state, action) {
  const {type, changeType} = action;
  changeType(type);
  return {selected: type};
}

function ResultsFilter(props) {
  const {changeType, type} = props;
  const [state, dispatch] = useReducer(changeBtn, {
    type,
    changeType
  });
  const getSelected = btn => {
    const selected = state.selected ? state.selected : ALLBOOKS;
    if (selected === btn) {
      return 'filter-selected';
    }
  };

  return (
    <div className="results-filter">
      <div className="filter-button-container">
        <span
          className={'results-filter-button ' + getSelected(ALLBOOKS)}
          id={ALLBOOKS}
          onClick={() => dispatch({type: ALLBOOKS, changeType})}
        >
          ALLE
        </span>
        <span
          className={'results-filter-button ' + getSelected(EBOOKS)}
          id={EBOOKS}
          onClick={() => dispatch({type: EBOOKS, changeType})}
        >
          E-BØGER
        </span>
        <span
          className={'results-filter-button ' + getSelected(AUDIOBOOKS)}
          id={AUDIOBOOKS}
          onClick={() => dispatch({type: AUDIOBOOKS, changeType})}
        >
          LYDBØGER
        </span>
      </div>
    </div>
  );
}

export default ResultsFilter;
