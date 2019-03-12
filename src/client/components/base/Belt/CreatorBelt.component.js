import React from 'react';
import withIsVisible from '../scroll/withIsVisible.hoc';
import withChildBelt from './withChildBelt.hoc';
import withQueryToPids from '../Recommender/withQueryToPids.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import withScrollToComponent from '../scroll/withScrollToComponent.hoc';

export class CreatorBelt extends React.Component {
  render() {
    return (
      <div className={'px-0 px-sm-3 px-lg-5 pt-5 ' + this.props.className}>
        <Title
          Tag="h1"
          type="title4"
          variant="transform-uppercase"
          className="ml-2 ml-sm-0 mb-4"
        >
          <strong className="mr-2">Skrevet af</strong>
          <span>{this.props.query}</span>
        </Title>
        <WorkSlider
          {...this.props}
          pids={this.props.pids}
          onMoreLikeThisClick={this.props.openSimilarBelt}
          onWorkClick={this.props.openWorkPreview}
          className=""
        />
      </div>
    );
  }
}
export default withChildBelt(
  withScrollToComponent(withIsVisible(withQueryToPids(CreatorBelt)))
);
