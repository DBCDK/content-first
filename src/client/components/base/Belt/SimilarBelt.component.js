import React from 'react';
import {get} from 'lodash';
import {withIsVisible, withScrollToComponent} from '../../hoc/Scroll';
import {withChildBelt} from '../../hoc/Belt';
import {withPidsToPids} from '../../hoc/Recommender';
import withWork from '../../hoc/Work/withWork.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import T from '../T';

import './similarBelt.css';

const WorkTitle = withWork(({work}) => (
  <span>{work && work.book && work.book.title}</span>
));
const Slider = withWork(({work, ...props}) => (
  <WorkSlider
    {...props}
    pids={props.recommendations}
    enableLongpress={true}
    onMoreLikeThisClick={(wrk, bName, rid) =>
      props.openSimilarBelt(wrk, `Minder om ${work.book.title}`, rid)
    }
    onWorkClick={(wrk, bName, rid) =>
      props.openWorkPreview(wrk, `Minder om ${work.book.title}`, rid)
    }
    origin={{
      type: 'minderOm',
      parent: props.pid,
      minderLink: [props.pid, work.book.title]
    }}
  />
));
const WorksTitle = ({pids, className}) => (
  <Title
    Tag="h1"
    type="title4"
    variant="transform-uppercase"
    className={`similar-belt__title ${className}`}
  >
    <strong>
      <T component="work" name="remindsOf" />{' '}
    </strong>
    {pids.map((pid, idx) => (
      <React.Fragment key={pid}>
        <WorkTitle pid={pid} />
        {idx === pids.length - 2 && (
          <span>
            <T component="general" name="and" />
          </span>
        )}
        {idx < pids.length - 2 && <span>{', '}</span>}
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
    const isChildBeltClass = isChildBelt ? 'child-belt' : '';

    return (
      <div
        ref={beltRef}
        data-cy="similarBelt"
        className={`similar-belt ${className} ${isChildBeltClass} ${bgColor}`}
        style={{
          ...style
        }}
      >
        <WorksTitle pids={likes} className={`${bgColor}`} />
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
