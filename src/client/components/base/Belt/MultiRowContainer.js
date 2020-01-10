import React from 'react';
import {get} from 'lodash';
import WorkCard from '../../work/WorkCard/WorkCard.container';
import {withChildBelt} from '../../hoc/Belt';
import {withIsVisible} from '../../hoc/Scroll';

import './MultiRowContainer.css';

const Row = withIsVisible(
  withChildBelt(
    ({
      pids,
      cardRef,
      openSimilarBelt,
      openWorkPreview,
      selected,
      rid,
      origin,
      isVisible,
      isLoading
    }) => (
      <div data-cy={'container-row'} className="container--row">
        {pids.map((pid, idx) => (
          <WorkCard
            cardRef={cardRef}
            className={pid || isLoading ? '' : 'invisible'}
            enableHover={true}
            enableLongpress={true}
            highlight={pid === selected}
            isVisible={isVisible}
            pid={pid}
            rid={rid}
            key={pid + idx}
            origin={origin || ''}
            onMoreLikeThisClick={openSimilarBelt}
            onWorkClick={openWorkPreview}
            data-cy={'workcard-' + idx}
          />
        ))}
      </div>
    )
  )
);

const SkeletonRow = () => {};

class MultiRowContainer extends React.Component {
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

  createSkeletonRow = () => {
    const resultsPerRow = this.state.resultsPerRow;
    return (
      <div data-cy={'container-row'} className="container--row">
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
    );
  };

  pidsToRows = (pids, resultsPerRow) => {
    if (pids.length === 0) {
      return [];
    }
    const rows = [];
    let currentRow;
    pids.forEach((pid, idx) => {
      if (idx % resultsPerRow === 0) {
        currentRow = [];
        rows.push(currentRow);
      }
      currentRow.push(pid);
    });
    while (currentRow.length < resultsPerRow) {
      currentRow.push(null);
    }
    return rows;
  };
  render() {
    const pids = this.props.recommendations || [];
    const isLoading = this.props.isLoading;
    const rows = this.pidsToRows(pids, this.state.resultsPerRow);
    return (
      <div className={`multirow--container ${this.props.className}`}>
        <div ref={container => (this.refs = {...this.refs, container})}>
          {rows.map(pidList => (
            <Row
              key={JSON.stringify(pidList)}
              mount={JSON.stringify(pidList)}
              origin={this.props.origin}
              rid={this.props.rid}
              pids={pidList}
              cardRef={workCard => (this.refs = {...this.refs, workCard})}
              isLoading={isLoading}
            />
          ))}
          {isLoading && this.createSkeletonRow()}
        </div>
      </div>
    );
  }
}
export default MultiRowContainer;
