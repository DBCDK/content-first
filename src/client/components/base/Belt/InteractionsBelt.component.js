import React from 'react';
import {withChildBelt} from '../../hoc/Belt';
import {withInteractionsToPids} from '../../hoc/Recommender';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
//
import {withUser} from '../../hoc/User';

export class InteractionsBelt extends React.Component {
  render() {
    const {user} = this.props;
    const {name, isLoggedIn} = user;
    if (!isLoggedIn || this.props.recommendations.length === 0) {
      return null;
    }

    return (
      <div className={this.props.className} style={this.props.style}>
        <Title
          Tag="h1"
          type="title4"
          variant="transform-uppercase"
          className="mb-3 mb-md-0 px-2 px-sm-3 px-lg-5 pb-0 pb-sm-3 pt-5"
        >
          <strong className="mr-2">Bedste forslag</strong>
          <span className="mr-2">til</span>
          <span>{name}</span>
        </Title>
        <WorkSlider
          {...this.props}
          pids={this.props.recommendations}
          onMoreLikeThisClick={this.props.openSimilarBelt}
          onWorkClick={this.props.openWorkPreview}
          origin={`Fra bedste forslag til ${name}`}
        />
      </div>
    );
  }
}
export default withChildBelt(
  withUser(withInteractionsToPids(InteractionsBelt))
);
