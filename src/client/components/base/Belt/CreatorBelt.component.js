import React from 'react';
import {withIsVisible, withScrollToComponent} from '../../hoc/Scroll';
import {withChildBelt} from '../../hoc/Belt';
import {withQueryToPids} from '../../hoc/Recommender';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';

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
          origin={`Fra søgning på forfatter ${this.props.query}`}
        />
      </div>
    );
  }
}
export default withChildBelt(
  withScrollToComponent(withIsVisible(withQueryToPids(CreatorBelt)))
);
