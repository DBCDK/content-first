import React from 'react';
import WorkItem from '../work/WorkItem.component';

class ScrollableBelt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {scrollOffset: 0};
  }

  render() {
    const scrollPos = this.state.scrollOffset ? (-1 * this.state.scrollOffset * 265) + 'px' : '0px';
    return (
      <div className='belt-wrapper'>
        {this.props.works && (
          <div className='button-wrapper col-xs-12 noselect'>
            <div className='left-btn scroll-btn text-center' onClick={() => {
              this.setState({scrollOffset: Math.max(this.state.scrollOffset - this.props.scrollInterval, 0)});
            }}>{'<'}</div>
            <div className='right-btn scroll-btn text-center' onClick={() => {
              this.setState({scrollOffset: Math.min(this.state.scrollOffset + this.props.scrollInterval, this.props.works.length-5)});
            }}>{'>'}</div>
          </div>
        )}
        <div className='works-wrapper col-xs-12 noselect'>
          <div className='works' style={{transform: `translate3d(${scrollPos}, 0px, 0px)`}}>
            {this.props.works && this.props.works.map((work, idx) => {
              return <WorkItem
                id={`work-${idx}`}
                key={work.book.pid}
                work={work}
                onCoverClick={this.props.onCoverClick}
                onRememberClick={this.props.onRememberClick}
                marked={this.props.remembered[work.book.pid]}/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default ScrollableBelt;
