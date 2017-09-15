import React from 'react';
import WorkItem from '../work/WorkItem.component';

export default class Belt extends React.Component {

  constructor() {
    super();
    this.state = {showDetails: false};
  }

  componentDidMount() {
    window.$('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    window.$('[data-toggle="tooltip"]').tooltip();
  }

  render() {
    const scrollPos = this.props.belt.scrollOffset ? (-1 * this.props.belt.scrollOffset * 265) + 'px' : '0px';

    // Create the html to go into
    const tooltipText = this.props.filters.length > 0 ? this.props.filters.map(filter => {
      return `<span>${filter.title}</span>`;
    }) : ['<span>Ingen filtre</span>'];

    return (
      <div className='row belt text-left'>
        <div className='col-xs-12 header'>
          <span onClick={this.props.onMoreClick} className='belt-title' data-html='true' data-toggle='tooltip' title={tooltipText.join(' ')}>
            {this.props.belt.name}</span>
        </div>
        <div className='col-xs-12 other-belts'>

        </div>
        {this.props.custom}
        <div className='belt-wrapper'>
          {this.props.belt.works && (
            <div className='button-wrapper col-xs-12 noselect'>
              <div className='left-btn scroll-btn text-center' onClick={this.props.onScrollLeft}>{'<'}</div>
              <div className='right-btn scroll-btn text-center' onClick={this.props.onScrollRight}>{'>'}</div>
            </div>
          )}
          <div className='works-wrapper col-xs-12 noselect'>
            <div className='works' style={{transform: `translate3d(${scrollPos}, 0px, 0px)`}}>
              {this.props.belt.works && this.props.belt.works.map((work, idx) => {
                return <WorkItem id={`work-${idx}`} key={idx} work={work} disableShadow={this.state.showDetails}/>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
