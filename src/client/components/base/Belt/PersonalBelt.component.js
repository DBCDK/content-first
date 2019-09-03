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

const WorksTitle = withWork(({work, titlePrefix}) => (
  <Title
    Tag="h1"
    type="title4"
    variant="transform-uppercase"
    className={`mb-3 mb-0 px-0 px-sm-3 px-lg-5 pt-5`}
  >
    <strong>{titlePrefix}</strong>
    <span className="ml-2">{get(work, 'book.title')}</span>
  </Title>
));

const Slider = withWork(
  withPidsToPids(props => {
    const title = `${props.titlePrefix} ${get(props, 'work.book.title')}`;
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
 * randomly selected book from system list, custom lists
 * and interactions.
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
   * We select pid randomly,
   * and we do not select a pid that has
   * already been selected by another personal belt
   */
  selectDidReadPid() {
    const customLists = this.props.getCustomLists();
    const systemLists = this.props.getSystemLists();
    const shortlist = systemLists.shortlist
      .map(item => item.pid)
      .filter(pid => !picked[pid]);
    const didRead = systemLists.didRead.list
      .map(item => item.pid)
      .filter(pid => !picked[pid]);
    const willRead = systemLists.willRead.list
      .map(item => item.pid)
      .filter(pid => !picked[pid]);

    const onOtherLists = customLists.reduce((arr, list) => {
      return [...arr, ...list.list.map(entry => entry.pid)];
    }, []);
    const lists = [];

    if (didRead.length > 0) {
      lists.push({
        titlePrefix: 'Fordi du har læst',
        list: didRead
      });
    }
    if (willRead.length > 0) {
      lists.push({titlePrefix: 'Fordi du vil læse', list: willRead});
    }
    if (shortlist.length > 0) {
      lists.push({
        titlePrefix: 'Fordi du har husket',
        list: shortlist
      });
    }
    if (onOtherLists.length > 0) {
      lists.push({
        titlePrefix: 'Fordi du har gemt',
        list: onOtherLists
      });
    }
    if (lists.length === 0) {
      // nothing to use as basis for recommendations
      return;
    }

    // Pick a list randomly (current date is used as seed)
    const {list, titlePrefix} = lists[0];

    // Pick from list randomly (current date is used as seed)
    const seed = `${this.props.mount}-${moment().format('YYYY-MM-DD')}`;
    const pid = toColor(seed, list);

    // share with other Personal belts that this pid is selected
    picked[pid] = pid;

    this.props.updateMount({pid, titlePrefix});
  }
  render() {
    const {pid, titlePrefix} = this.props.mountedData;
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
        <WorksTitle {...this.props} pid={pid} titlePrefix={titlePrefix} />
        <Slider
          {...this.props}
          likes={[pid]}
          pid={pid}
          dislikes={dislikes}
          titlePrefix={titlePrefix}
        />
      </div>
    );
  }
}
export default withChildBelt(withIsVisible(withLists(PersonalBelt)));
