import React from 'react';
import {get, debounce} from 'lodash';
import WorkCard from '../../work/WorkCard.container';
import Slider from './Slider.component';

export default class WorkSlider extends React.Component {
  constructor() {
    super();
    this.handleResize = debounce(this.handleResize, 100);
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize = () => {
    this.forceUpdate();
  };
  getWorksPerSlide = () => {
    const containerWidth = get(this.refs, 'container.clientWidth', 800);
    const workCardWidth = get(this.refs, 'workCard.clientWidth', 200);
    const resultsPerRow = Math.floor(containerWidth / workCardWidth);
    return resultsPerRow;
  };
  render() {
    const {pids = []} = this.props;
    const worksPerSlide = this.getWorksPerSlide();
    const {didSwipe = false, scrollPos = 0} = this.props.mountedData;

    return (
      <div
        className={this.props.className}
        ref={container => (this.refs = {...this.refs, container})}
      >
        <Slider
          initialScrollPos={scrollPos}
          onSwipe={index => {
            if (index > 0 && !didSwipe) {
              this.props.updateMount({
                didSwipe: true,
                beltName: this.props.origin
              });
            }
            if (scrollPos !== index) {
              this.props.updateMount({
                scrollPos: index,
                beltName: this.props.origin
              });
            }
          }}
        >
          {pids.length > 0
            ? pids.map((pid, idx) => {
                return (
                  <WorkCard
                    cardRef={workCard => (this.refs = {...this.refs, workCard})}
                    className={idx === pids.length - 1 ? '' : 'mr-4'}
                    enableHover={true}
                    highlight={this.props.selected === pid}
                    isVisible={idx < scrollPos + worksPerSlide * 2}
                    pid={pid}
                    rid={this.props.rid}
                    key={pid}
                    origin={this.props.origin}
                    onMoreLikeThisClick={this.props.onMoreLikeThisClick}
                    onWorkClick={this.props.onWorkClick}
                    cardIndex={idx}
                  />
                );
              })
            : Array(20)
                .fill(0)
                .map((val, idx) => (
                  <WorkCard
                    cardRef={workCard => (this.refs = {...this.refs, workCard})}
                    className="ml-2 mr-2"
                    highlight={false}
                    isVisible={false}
                    key={idx}
                  />
                ))}
        </Slider>
      </div>
    );
  }
}
