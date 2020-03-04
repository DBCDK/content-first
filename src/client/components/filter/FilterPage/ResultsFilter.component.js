import React from 'react';
import T from '../../base/T';

const ALLBOOKS = 'Bog';
const EBOOKS = 'Ebog';
const AUDIOBOOKS = 'Lydbog (net)';

export default class ResultsFilter extends React.Component {
  constructor() {
    super();
    this.state = {selected: [1, 0, 0]};
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selected !== prevProps.type) {
      this.setState({selected: prevProps.type});
    }
  }

  render() {
    const {changeType, disabled} = this.props;

    const changeBtn = type => {
      let tempArr = this.state.selected;
      if (type === 0) {
        tempArr = [1, 0, 0];
      } else {
        tempArr[0] = 0;
        tempArr[type] = (tempArr[type] + 1) % 2;
        if (tempArr[1] === 0 && tempArr[2] === 0) {
          tempArr = [1, 0, 0];
        }
      }

      changeType(tempArr);
      this.setState({selected: tempArr});
    };

    const getSelected = btn => {
      const selected =
        this.state.selected && !disabled ? this.state.selected : [1, 0, 0];
      if (selected[btn]) {
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
            className={'results-filter-button ' + getSelected(0)}
            id={ALLBOOKS}
            onClick={() => {
              if (!disabled) {
                changeBtn(0);
              }
            }}
          >
            <T component="filter" name="allbooks" />
          </span>
          <span
            className={'results-filter-button ' + getSelected(1)}
            id={EBOOKS}
            onClick={() => {
              if (!disabled) {
                changeBtn(1);
              }
            }}
          >
            <T component="filter" name="ebooks" />
          </span>
          <span
            className={'results-filter-button ' + getSelected(2)}
            id={AUDIOBOOKS}
            onClick={() => {
              if (!disabled) {
                changeBtn(2);
              }
            }}
          >
            <T component="filter" name="audiobooks" />
          </span>
        </div>
      </div>
    );
  }
}
