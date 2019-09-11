import React from 'react';
import {withIsVisible, withScrollToComponent} from '../../hoc/Scroll';
import {withChildBelt} from '../../hoc/Belt';
import {withQueryToPids} from '../../hoc/Recommender';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';

export class CreatorBelt extends React.Component {
  render() {
    return (
      <div className={this.props.className} data-cy="creator-belt">
        <Title
          Tag="h1"
          type="title4"
          variant="transform-uppercase"
          className="mb-3 mb-md-0 px-2 px-sm-3 px-lg-5 pb-0 pb-sm-3 pt-5"
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
          origin={`Fra søgning på forfatter ${this.props.query}`}
        />
      </div>
    );
  }
}
export default withChildBelt(
  withScrollToComponent(withIsVisible(withQueryToPids(CreatorBelt)))
);
