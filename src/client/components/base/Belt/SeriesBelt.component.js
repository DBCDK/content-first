import React from 'react';
import {withIsVisible, withScrollToComponent} from '../../hoc/Scroll';
import {withChildBelt} from '../../hoc/Belt';
import withWork from '../../hoc/Work/withWork.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';

import './SeriesBelt.css';

const Slider = ({work, ...props}) => (
  <WorkSlider
    {...props}
    pids={work.book.series && work.book.series.data.map(entry => entry.pid)}
    onMoreLikeThisClick={(wrk, bName, rid) =>
      props.openSimilarBelt(wrk, 'Bøger i samme serie', rid)
    }
    onWorkClick={(wrk, bName, rid) =>
      props.openWorkPreview(wrk, 'Bøger i samme serie', rid)
    }
    origin={{
      type: 'series',
      parent: props.pid,
      titleSeries: work.book.titleSeries
    }}
    series={work.book.series && work.book.series.data}
  />
);

export const SeriesBelt = props => {
  const {work} = props;
  if (
    !work ||
    !work.book ||
    !work.book.isSeries ||
    (work.book.series && !work.book.series.isSeries)
  ) {
    return <div />;
  }

  return (
    <div data-cy="seriesBelt" className="series-belt">
      <Title Tag="h1" type="title4" variant="transform-uppercase">
        <strong>Bøger</strong>
        <span>i samme serie</span>
      </Title>
      <Slider {...props} />
    </div>
  );
};

export default withChildBelt(
  withScrollToComponent(
    withIsVisible(
      withWork(SeriesBelt, {includeSeries: true, includeCollection: true})
    )
  )
);
