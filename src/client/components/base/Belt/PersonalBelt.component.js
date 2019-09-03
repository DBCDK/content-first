import React from 'react';
import {get} from 'lodash';
import moment from 'moment';
import {withChildBelt} from '../../hoc/Belt';
import withWork from '../../hoc/Work/withWork.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import {withPidsToPids} from '../../hoc/Recommender';
import {withLists} from '../../hoc/List';
import {withIsVisible} from '../../hoc/Scroll';
import toColor from '../../../utils/toColor';

// shared between all did read belts
const picked = {};

const WorksTitle = withWork(({work}) => (
  <Title
    Tag="h1"
    type="title4"
    variant="transform-uppercase"
    className={`mb-3 mb-0 px-0 px-sm-3 px-lg-5 pt-5`}
  >
    <strong>Fordi du har læst</strong>
    <span className="ml-2">{get(work, 'book.title')}</span>
  </Title>
));

const Slider = withWork(
  withPidsToPids(props => {
    const title = `Fordi du har læst ${get(props, 'work.book.title')}`;
    return (
      <WorkSlider
        {...props}
        pids={props.recommendations}
        onMoreLikeThisClick={(wrk, bName, rid) =>
          props.openSimilarBelt(wrk, title, rid)
        }
        onWorkClick={(wrk, bName, rid) =>
          props.openWorkPreview(wrk, title, rid)
        }
        origin={title}
      />
    );
  })
);
/*
 * The PersonalBelt shows recommendations based on a
 * randomly selected book from system list.
 *
 * It will not be shown if
 *  - no books are in the didRead list
 *  - books in the didRead list are already used
 *    in other didRead belts
 *
 * usage:
 * <PersonalBelt mount="some-unique-key" />
 *
 */
export class PersonalBelt extends React.Component {
  componentDidMount() {
    if (!this.props.mountedData.pid) {
      this.selectDidReadPid();
    }
  }

  /*
   * We select pid from didRead list randomly,
   * and we do not select a pid that has
   * already been selected by another didRead belt
   */
  selectDidReadPid() {
    const didRead = this.props
      .getSystemLists()
      .didRead.list.map(item => item.pid)
      .filter(pid => !picked[pid]);

    // Pick from list randomly (current date is used as seed)
    const pid = toColor(moment().format('YYYY-MM-DD'), didRead);

    // share with other DidRead belts that this pid is selected
    picked[pid] = pid;

    this.props.updateMount({pid});
  }
  render() {
    const pid = this.props.mountedData.pid;
    if (!pid) {
      return null;
    }

    // do not recommend stuff already read
    const dislikes = this.props
      .getSystemLists()
      .didRead.list.map(item => item.pid);

    return (
      <div
        className={this.props.className}
        style={this.props.style}
        data-cy="did-read-belt"
      >
        <WorksTitle {...this.props} pid={pid} />
        <Slider {...this.props} likes={[pid]} pid={pid} dislikes={dislikes} />
      </div>
    );
  }
}
export default withChildBelt(withIsVisible(withLists(PersonalBelt)));
