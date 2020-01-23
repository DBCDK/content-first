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
import {withInteractions} from '../../hoc/Interaction';
import {withOrders} from '../../hoc/Order';
import toColor from '../../../utils/toColor';

import './PersonalBelt.css';

// shared between all did read belts
const picked = {};

const WorksTitle = withWork(({work, titlePrefix}) => (
  <Title
    Tag="h1"
    type="title4"
    variant="transform-uppercase"
    className={'belt-personal__title'}
  >
    <strong>{titlePrefix}</strong>
    <span>{get(work, 'book.title')}</span>
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
    this.selectDidReadPid();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.loggedInUser !== this.props.loggedInUser) {
      this.selectDidReadPid();
    }
  }

  /*
   * We select pid randomly,
   * and we do not select a pid that has
   * already been selected by another personal belt
   */
  selectDidReadPid() {
    if (this.props.mountedData.pid || !this.props.loggedInUser) {
      return;
    }
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
    const orders = Object.keys(this.props.orders).filter(pid => !picked[pid]);

    const onOtherLists = customLists.reduce((arr, list) => {
      return [
        ...arr,
        ...list.list.map(entry => entry.pid).filter(pid => !picked[pid])
      ];
    }, []);
    const visited = this.props.interactions
      .filter(
        interaction =>
          (interaction.interaction === 'NEW_LOCATION' ||
            interaction.interaction === 'PREVIEW') &&
          interaction.pid &&
          !picked[interaction.pid]
      )
      .map(interaction => interaction.pid);

    let list;
    let titlePrefix;

    if (didRead.length > 0) {
      titlePrefix = 'Fordi du har læst';
      list = didRead;
    } else if (willRead.length > 0) {
      titlePrefix = 'Fordi du vil læse';
      list = willRead;
    } else if (orders.length > 0) {
      titlePrefix = 'Fordi du har lånt';
      list = orders;
    } else if (shortlist.length > 0) {
      titlePrefix = 'Fordi du har husket';
      list = shortlist;
    } else if (onOtherLists.length > 0) {
      titlePrefix = 'Fordi du har gemt';
      list = onOtherLists;
    } else if (visited.length > 0) {
      titlePrefix = 'Fordi du kiggede på';
      list = visited;
    }

    if (!list) {
      // nothing to use as basis for recommendations
      return;
    }

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
        className={`belt belt-personal ${this.props.className}`}
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
export default withChildBelt(
  withIsVisible(withLists(withInteractions(withOrders(PersonalBelt))))
);
