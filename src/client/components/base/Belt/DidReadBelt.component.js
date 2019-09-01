import React from 'react';
import {get} from 'lodash';
import {withChildBelt} from '../../hoc/Belt';
import withWork from '../../hoc/Work/withWork.hoc';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import {withPidsToPids} from '../../hoc/Recommender';
import {withLists} from '../../hoc/List';
import {withIsVisible} from '../../hoc/Scroll';

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
        origin={`Fra '${title}'`}
      />
    );
  })
);
/*
 * The DidReadBelt shows recommendations based on a
 * randomly selected book from the didRead system list.
 *
 * It will not be shown if
 *  - no books are in the didRead list
 *  - books in the didRead list are already used
 *    in other didRead belts
 *
 * usage:
 * <DidReadBelt mount="some-unique-key" />
 *
 */
export class DidReadBelt extends React.Component {
  componentDidMount() {
    if (!this.props.mountedData.pid) {
      this.selectDidReadPid();
    }
  }

  componentWillUnmount() {
    delete picked[this.props.mountedData.pid];
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
    const idx = Math.floor(Math.random() * didRead.length);
    const pid = didRead[idx];

    // share with other DidRead belts that this pid is selected
    picked[pid] = pid;

    this.props.updateMount({pid});
  }
  render() {
    const pid = this.props.mountedData.pid;
    if (!pid) {
      return null;
    }
    return (
      <div
        className={this.props.className}
        style={this.props.style}
        data-cy="interactions-belt"
      >
        <WorksTitle {...this.props} pid={pid} />
        <Slider {...this.props} likes={[pid]} />
      </div>
    );
  }
}
export default withChildBelt(withIsVisible(withLists(DidReadBelt)));
