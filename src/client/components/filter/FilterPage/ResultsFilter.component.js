import React from 'react';

class ResultsFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'alle'
    };
  }

  handleClick = e => {
    let chosen = e.target.id;
    /*   for (let prop in e.target) {
      console.log(prop, 'e', e.target[prop]);
    }*/

    switch (chosen) {
      case 'alle':
        this.setState({selected: 'alle'});
        break;
      case 'e':
        this.setState({selected: 'e'});
        break;
      case 'lyd':
        this.setState({selected: 'lyd'});
        break;
      default:
        return;
    }
  };
  getSelected = btn => {
    if (this.state.selected === btn) {
      return 'filter-selected';
    }
  };

  render() {
    console.log('props', this.props);
    return (
      <div className="results-filter">
        <div className="filter-button-container">
          <span
            className={'results-filter-button ' + this.getSelected('alle')}
            id="alle"
            onClick={this.handleClick}
          >
            ALLE
          </span>
          <span
            className={'results-filter-button ' + this.getSelected('e')}
            id="e"
            onClick={this.handleClick}
          >
            E-BØGER
          </span>
          <span
            className={'results-filter-button ' + this.getSelected('lyd')}
            id="lyd"
            onClick={this.handleClick}
          >
            LYDBØGER
          </span>
        </div>
      </div>
    );
  }
}

export default ResultsFilter;
