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
    return (
      <div className='row belt text-left'>
        <div className='col-xs-12 header'>
          <span className='belt-title' data-toggle='tooltip' title={this.props.belt.details}>
            {this.props.belt.name}</span>
          {this.props.belt.works && this.props.belt.works.length > 0 &&
          <span className='more-link btn' onClick={this.props.onMoreClick}>Se flere</span>}
        </div>
        <div className='col-xs-12 tags'>
          {this.props.filters && this.props.filters.map((filter, idx) => {
            return <span key={idx} className='btn btn-default'>{filter.title}</span>;
            // const btnClass = filter.selected ? 'btn-success' : 'btn-default';
            // return <span className={`btn ${btnClass}`} key={idx} onClick={() => {
            //   this.props.onTagClick(idx);
            // }}>{filter.title}</span>;
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
                return <WorkItem id={`work-${idx}`} key={idx} work={work}/>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
