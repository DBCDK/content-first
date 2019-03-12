import React from 'react';
import withIsVisible from '../scroll/withIsVisible.hoc';
import withChildBelt from './withChildBelt.hoc';
import withInteractionsToPids from '../Recommender/withInteractionsToPids.hoc';
import withWork from '../Work/withWork.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import withUser from '../User/withUser.hoc';

export class InteractionsBelt extends React.Component {
  render() {
    const {user} = this.props;
    const {name, isLoggedIn} = user;
    if (!isLoggedIn) {
      return null;
    }
    return (
      <div
        className={'px-0 px-sm-3 px-lg-5 pt-5 ' + this.props.className}
        style={this.props.style}
      >
        <Title
          Tag="h1"
          type="title4"
          variant="transform-uppercase"
          className={
            ' inline border-right-xs-0 pr2 pb0 pt0 ml-2 ml-sm-0 mr-2 mr-sm-3 mb2'
          }
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
          className=""
        />
      </div>
    );
  }
}
export default withChildBelt(
  withUser(withIsVisible(withInteractionsToPids(InteractionsBelt)))
);
