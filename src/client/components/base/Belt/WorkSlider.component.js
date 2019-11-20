import React from 'react';
import './WorkSlider.component.css';
import {get, debounce} from 'lodash';
import WorkCard from '../../work/WorkCard/WorkCard.container';
import Slider from './Slider.component';
import Title from '../../base/Title';
import T from '../T';

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
    if (this.props.isVisible === false) {
      return <div style={{height: 442}}></div>;
    }
    const {
      pids = [],
      className = '',
      mountedData,
      updateMount,
      origin,
      recommendationsLoaded
    } = this.props;

    const worksPerSlide = this.getWorksPerSlide();
    const {didSwipe = false, scrollPos = 0} = mountedData;

    return (
      <div
        className={`work-slider ${className}`}
        ref={container => (this.refs = {...this.refs, container})}
      >
        {recommendationsLoaded && pids.length === 0 && (
          <Title
            tag="h1"
            type="title4"
            variant="transform-uppercase--weight-bold"
            className="work-slider__no-hits-container"
          >
            <T component="belts" name="noHits" renderAsHtml={true} />
          </Title>
        )}
        <Slider
          name="workslider"
          initialScrollPos={scrollPos}
          onSwipe={index => {
            if (index > 0 && !didSwipe) {
              updateMount({
                didSwipe: true,
                beltName: origin
              });
            }
            if (scrollPos !== index) {
              updateMount({
                scrollPos: index,
                beltName: origin
              });
            }
          }}
        >
          {pids.length > 0
            ? pids.map((pid, idx) => {
                return (
                  <WorkCard
                    pid={pid}
                    rid={this.props.rid}
                    key={pid}
                    cardRef={workCard => (this.refs = {...this.refs, workCard})}
                    enableHover={true}
                    enableLongpress={this.props.enableLongpress || false}
                    hoverClass={this.props.bgClass}
                    highlight={this.props.selected === pid}
                    isVisible={
                      this.props.isVisible &&
                      idx < scrollPos + worksPerSlide * 2
                    }
                    origin={this.props.origin}
                    onMoreLikeThisClick={this.props.onMoreLikeThisClick}
                    onWorkClick={this.props.onWorkClick}
                    cardIndex={idx}
                    data-cy={`workcard-${pid}-${idx}`}
                  />
                );
              })
            : Array(20)
                .fill(0)
                .map((val, idx) => (
                  <WorkCard
                    cardRef={workCard => (this.refs = {...this.refs, workCard})}
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
