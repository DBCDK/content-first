import React from 'react';
import PropTypes from 'prop-types';
import './Spots.css';
import toColor from '../../utils/toColor';
import Link from '../general/Link.component';
import {getLeavesMap} from '../../utils/taxonomy';

const leavesMap = getLeavesMap();

export class SpotItem extends React.Component {
  componentDidMount() {}
  getStyle() {
    let style = '';
    if (this.props.spotData.image) {
      style = {backgroundImage: `url(${this.props.spotData.image})`};
    } else if (this.props.spotData.color) {
      style = {backgroundColor: this.props.spotData.color};
    } else {
      style = {backgroundColor: toColor(Math.floor(Math.random() * 100 + 1))};
    }
    return style;
  }
  renderTitle(spot) {
    if (spot.title.includes(spot.highlight)) {
      const titleSplitBeforeHighligt = spot.title.split(spot.highlight)[0];
      const titleSplitAfterHighligt = spot.title.split(spot.highlight)[1];
      return (
        <h1>
          {titleSplitBeforeHighligt}
          <span className="title-highlighted">{spot.highlight}</span>
          {titleSplitAfterHighligt}
        </h1>
      );
    }
    return <h1> {spot.title}</h1>;
  }

  getTags(tagIDs) {
    if (tagIDs) {
      return tagIDs.map(tagID => leavesMap[tagID]);
    }
    return;
  }
  render() {
    const tags = this.getTags(this.props.spotData.tags);
    return (
      <div
        className={
          'spot-item-' +
          (this.props.spotData.type === 'wide'
            ? 'wide-container '
            : 'small-container ') +
          (this.props.className ? this.props.className : '') +
          (this.props.spotData.image ? 'image-spot' : '')
        }
        style={this.getStyle()}
      >
        <div className="spot-item-content">
          {this.props.spotData.title && this.renderTitle(this.props.spotData)}
          {!this.props.spotData.image && <div className="spot-item-circle" />}
          <div className="tags">
            {tags &&
              tags.map(tag => {
                return (
                  <Link key={tag.id} href="/find" params={{tags: tag.id}}>
                    <span>{tag.title}</span>
                  </Link>
                );
              })}
          </div>
          <Link
            href={this.props.spotData.listLink.url}
            className={
              this.props.spotData.image
                ? 'spot-item-link-image-background'
                : 'spot-item-link-color-background'
            }
          >
            {this.props.spotData.listLink.title}
          </Link>
        </div>
      </div>
    );
  }
}
SpotItem.propTypes = {
  spotData: PropTypes.object
};
export default SpotItem;
