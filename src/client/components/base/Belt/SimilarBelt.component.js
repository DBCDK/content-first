import React from 'react';
import {get} from 'lodash';
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
const Slider = withWork(({work, ...props}) => (
  <WorkSlider
    {...props}
    pids={props.recommendations}
    onMoreLikeThisClick={props.openSimilarBelt}
    onWorkClick={props.openWorkPreview}
    origin={`Fra "Minder om ${get(work, 'book.title')}"`}
  />
));
const WorksTitle = ({pids}) => (
  <Title
    Tag="h1"
    type="title4"
    variant="transform-uppercase"
    className="ml-2 ml-sm-0 mb-4"
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
        ref={this.props.beltRef || null}
        className={'px-0 px-sm-3 px-lg-5 pt-5 ' + this.props.className}
        // style={{background: 'var(--lys-graa)', ...(this.props.style || {})}}
        style={this.props.style}
      >
        <WorksTitle pids={this.props.likes} />
        <Slider pid={get(this.props, 'likes[0]')} {...this.props} />
      </div>
    );
  }
}
export default withChildBelt(
  withScrollToComponent(withIsVisible(withPidsToPids(SimilarBelt)))
);
