import React from 'react';
import {get} from 'lodash';
import WorkCard from '../../work/WorkCard/WorkCard.container';

import './BeltSkeleton.css';

class BeltSkeleton extends React.Component {
  constructor() {
    super();
    this.state = {resultsPerRow: 1};
    // this.handleResize = debounce(this.handleResize, 100, {leading: true});
  }
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }
  componentDidUpdate(prevProps) {
    if (
      (prevProps.recommendations.length === 0 &&
        this.props.recommendations.length > 0) ||
      prevProps.isLoading !== this.props.isLoading
    ) {
      this.handleResize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const resultsPerRow = Math.floor(
      get(this.refs, 'container.clientWidth', 1) /
        (get(this.refs, 'workCard.clientWidth', 1) + 30)
    );
    this.setState({resultsPerRow: Math.max(resultsPerRow, 1)});
  };

  render() {
    let resultsPerRow = this.state.resultsPerRow;
    return (
      <div className={`beltskeleton--container  ${this.props.className}`}>
        <div
          className="container--row"
          ref={container => (this.refs = {...this.refs, container})}
        >
          {Array(resultsPerRow)
            .fill(0)
            .map((val, idx) => (
              <WorkCard
                cardRef={workCard => {
                  this.refs = {...this.refs, workCard};
                }}
                key={`skeleton-${idx}`}
                isVisible={false}
              />
            ))}
        </div>
      </div>
    );
  }
}
export default BeltSkeleton;
