import React from 'react';
import Kiosk from '../../base/Kiosk/Kiosk.js';
import {get} from 'lodash';

import {withIsVisible, withScrollToComponent} from '../../hoc/Scroll';
import {withChildBelt} from '../../hoc/Belt';
import {withQueryToPids} from '../../hoc/Recommender';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';

const Result = withQueryToPids(props => (
  <WorkSlider
    {...props}
    pids={props.pids}
    onMoreLikeThisClick={props.openSimilarBelt}
    onWorkClick={props.openWorkPreview}
    className=""
    origin={`Fra søgning på forfatter ${props.query}`}
  />
));

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
        <Kiosk
          render={({kiosk}) => (
            <Result
              {...this.props}
              branch={get(kiosk, 'configuration.branch')}
              agencyId={get(kiosk, 'configuration.agencyId')}
            />
          )}
        />
      </div>
    );
  }
}
export default withChildBelt(withScrollToComponent(withIsVisible(CreatorBelt)));
