import React from 'react';
import WorkItem from '../work/WorkItem.component';

export default class Belt extends React.Component {

  constructor() {
    super();
    this.state = {showDetails: false};
  }

  showDetails(show) {
    if (this.showDetailsTimeout) {
      clearTimeout(this.showDetailsTimeout);
    }
    this.showDetailsTimeout = setTimeout(() => {
      this.setState({showDetails: show});
    }, show ? 250 : 500);
  }

  render() {
    const scrollPos = this.props.belt.scrollOffset ? (-1 * this.props.belt.scrollOffset * 275) + 'px' : '0px';
    const detailsClassName = this.state.showDetails ? 'belt-title-details' : 'belt-title-details no-opacity';
    return (
      <div className='row belt text-left'>
        <div className='col-xs-12 header'>
          <span className='belt-title'
            onMouseOver={() => this.showDetails(true)}
            onMouseOut={() => this.showDetails(false)}>
            {this.props.belt.name}</span>
          {this.props.belt.works && this.props.belt.works.length > 5 &&
          <span className='more-link btn' onClick={this.props.onMoreClick}>Se flere</span>}
          <div className={detailsClassName}
            onMouseOver={() => this.showDetails(true)}
            onMouseOut={() => this.showDetails(false)}>
            Jeg er detaljer</div>
        </div>
        <div className='col-xs-12 tags'>
          {this.props.belt.tags && this.props.belt.tags.map((tag, idx) => {
            const btnClass = tag.selected ? 'btn-success' : 'btn-default';
            return <span className={`btn ${btnClass}`} key={idx} onClick={() => {
              this.props.onTagClick(idx);
            }}>{tag.name}</span>;
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
                return <WorkItem id={`work-${idx}`} key={idx} work={work} disableShadow={this.state.showDetails}/>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
