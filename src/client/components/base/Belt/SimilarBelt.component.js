import React from 'react';
import {get} from 'lodash';
import withIsVisible from '../Scroll/withIsVisible.hoc';
import withChildBelt from './withChildBelt.hoc';
import withPidsToPids from '../Recommender/withPidsToPids.hoc';
import withWork from '../Work/withWork.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import withScrollToComponent from '../Scroll/withScrollToComponent.hoc';

import './similarBelt.css';

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
const WorksTitle = ({pids, className}) => (
  <Title
    Tag="h1"
    type="title4"
    variant="transform-uppercase"
    className={`mb-3 ${className}`}
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
    const {
      className = '',
      style = {},
      likes,
      beltRef = null,
      isChildBelt
    } = this.props;

    const bgColor = isChildBelt ? 'lys-graa' : 'white';

    const isChildBeltClass = isChildBelt
      ? 'similarBelt-childBelt childBelt'
      : '';

    return (
      <div
        ref={beltRef}
        className={`similarBelt position-relative ${className} ${isChildBeltClass} ${bgColor}`}
        style={{
          ...style
        }}
      >
        <WorksTitle
          pids={likes}
          className={`mb-0 px-0 px-sm-3 px-lg-5 pt-5 ${bgColor}`}
        />
        <Slider
          isChildBelt={isChildBelt}
          pid={get(this.props, 'likes[0]')}
          {...this.props}
        />
      </div>
    );
  }
}
export default withChildBelt(
  withScrollToComponent(withIsVisible(withPidsToPids(SimilarBelt)))
);
