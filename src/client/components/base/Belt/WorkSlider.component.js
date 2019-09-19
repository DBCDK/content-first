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
    const {pids = []} = this.props;
    const worksPerSlide = this.getWorksPerSlide();
    const {didSwipe = false, scrollPos = 0} = this.props.mountedData;

    return (
      <div
        className={this.props.className + ' position-relative'}
        ref={container => (this.refs = {...this.refs, container})}
      >
        {this.props.recommendationsLoaded && pids.length === 0 && (
          <Title
            tag="h1"
            type="title4"
            variant="transform-uppercase--weight-bold"
            className="WorkSlider__no-hits-container position-relative"
          >
            <T component="belts" name="noHits" renderAsHtml={true} />
          </Title>
        )}
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
                    enableLongpress={true}
                    hoverClass={this.props.bgClass}
                    highlight={this.props.selected === pid}
                    isVisible={
                      this.props.isVisible &&
                      idx < scrollPos + worksPerSlide * 2
                    }
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
