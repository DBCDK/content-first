import React from 'react';
import {get, debounce} from 'lodash';
import Title from '../Title';
import WorkCard from '../../work/WorkCard.container';
import withChildBelt from './withChildBelt.hoc';

const Row = withChildBelt(
  ({pids, cardRef, openSimilarBelt, openWorkPreview, selected}) => (
    <div
      className="d-flex justify-content-around justify-content-md-between px-0 px-sm-3 px-lg-5 pt-5 "
      ref={container => (this.refs = {...this.refs, container})}
    >
      {pids.map((pid, idx) => (
        <WorkCard
          cardRef={cardRef}
          className={'mb-3 mb-sm-0 ' + (pid ? '' : 'invisible')}
          enableHover={true}
          highlight={pid === selected}
          isVisible={true}
          pid={pid}
          rid={''}
          key={pid + idx}
          origin={`Fra søgning`}
          onMoreLikeThisClick={openSimilarBelt}
          onWorkClick={openWorkPreview}
        />
      ))}
    </div>
  )
);

class MultiRowContainer extends React.Component {
  constructor() {
    super();
    this.state = {resultsPerRow: 1};
    this.handleResize = debounce(this.handleResize, 100);
  }
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.recommendations.length === 0 &&
      this.props.recommendations.length > 0
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
    if (pids.length === 0) {
      return null;
    }
    const rows = this.pidsToRows(pids, this.state.resultsPerRow);

    return (
      <div className={'work-container w-100 ' + this.props.className}>
        <div ref={container => (this.refs = {...this.refs, container})}>
          {rows.map(pids => (
            <Row
              key={JSON.stringify(pids)}
              mount={JSON.stringify(pids)}
              pids={pids}
              cardRef={workCard => (this.refs = {...this.refs, workCard})}
            />
          ))}
        </div>
      </div>
    );
  }
}
export default MultiRowContainer;
