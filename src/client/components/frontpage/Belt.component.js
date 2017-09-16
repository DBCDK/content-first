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

  getTooltipText(filters) {
    return filters.length > 0 ? filters.map(filter => {
      return `<span>${filter.title}</span>`;
    }).join(' ') : '<span>Ingen filtre</span>';
  }

  render() {
    const scrollPos = this.props.belt.scrollOffset ? (-1 * this.props.belt.scrollOffset * 265) + 'px' : '0px';

    // Create the html to go into
    const tooltipText = this.getTooltipText(this.props.filters);

    return (
      <div className='row belt text-left'>
        <div className='col-xs-12 header'>
          <span onClick={() => this.props.onMoreClick(this.props.belt.name)} className='belt-title' data-html='true' data-toggle='tooltip' title={tooltipText}>
            {this.props.belt.name}</span>
        </div>
        <div className='col-xs-12 belt-links'>
          {this.props.links.length > 0 && <span>Se også:</span>}
          {this.props.links.map(link => {
            return <span
              className='belt-link'
              data-html='true'
              data-toggle='tooltip'
              title={this.getTooltipText(link.filters)}
              onClick={() => this.props.onMoreClick(link.title)}>
              {link.title}
            </span>;
          })}
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
                return <WorkItem id={`work-${idx}`} key={work.book.pid} work={work}/>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
