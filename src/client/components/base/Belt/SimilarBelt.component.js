import React from 'react';
import withIsVisible from '../scroll/withIsVisible.hoc';
import withChildBelt from './withChildBelt.hoc';
import withPidsToPids from '../Recommender/withPidsToPids.hoc';
import withWork from '../Work/withWork.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import withScrollToComponent from '../scroll/withScrollToComponent.hoc';

const WorkTitle = withWork(({work}) => (
  <span>{work && work.book && work.book.title}</span>
));
const WorksTitle = ({pids}) => (
  <Title
    Tag="h1"
    type="title4"
    variant="transform-uppercase"
    className={
      ' inline border-right-xs-0 pr2 pb0 pt0 ml-2 ml-sm-0 mr-2 mr-sm-3 mb2'
    }
  >
    <strong className="mr-2">Minder om</strong>
    {pids.map((pid, idx) => (
      <React.Fragment key={pid}>
        <WorkTitle pid={pid} />
        {idx === pids.length - 2 && <span className="mx-2">og</span>}
        {idx < pids.length - 2 && <span className="mr-2">,</span>}
      </React.Fragment>
    ))}
  </Title>
);

export class SimilarBelt extends React.Component {
  render() {
    return (
      <div
        className={'px-0 px-sm-3 px-lg-5 pt-5 ' + this.props.className}
        // style={{background: 'var(--lys-graa)', ...(this.props.style || {})}}
        style={this.props.style}
      >
        <WorksTitle pids={this.props.likes} />
        <WorkSlider
          {...this.props}
          pids={this.props.recommendations}
          onMoreLikeThisClick={this.props.openSimilarBelt}
          onWorkClick={this.props.openWorkPreview}
          className=""
        />
      </div>
    );
  }
}
export default withChildBelt(
  withScrollToComponent(withIsVisible(withPidsToPids(SimilarBelt)))
);
