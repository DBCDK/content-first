import React from 'react';
import PropTypes from 'prop-types';
import './Spots.css';
import toColor from '../../utils/toColor';
import Link from '../general/Link.component';
import circle from '../svg/circle-shape-outline.svg';

export class SpotItem extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.handleBackground();
  }
  handleBackground() {
    if (this.props.spotData.image) {
      this.spot.style.backgroundImage = `url(${this.props.spotData.image})`;
      this.spot.classList.add('image-spot');
    } else if (this.props.spotData.color) {
      this.spot.style.backgroundColor = this.props.spotData.color;
    } else {
      this.spot.style.backgroundColor = toColor(
        Math.floor(Math.random() * 100 + 1)
      ); // change to spot_id
    }
  }
  renderTitle(spot) {
    if (spot.title.includes(spot.highlight)) {
      const titleSplitBeforeHighligt = spot.title.split(spot.highlight)[0];
      const titleSplitAfterHighligt = spot.title.split(spot.highlight)[1];
      return (
        <h1>
          {' '}
          {titleSplitBeforeHighligt}{' '}
          <span className="title-highlighted">{spot.highlight}</span>{' '}
          {titleSplitAfterHighligt}
        </h1>
      );
    }
    return <h1> {spot.title}</h1>;
  }
  render() {
    return (
      <div
        className={
          'spot-item-' +
          (this.props.spotData.type === 'wide'
            ? 'wide-container '
            : 'small-container ') +
          (this.props.className ? this.props.className : '')
        }
        ref={node => {
          if (node) {
            this.spot = node;
          }
        }}
      >
        <div className="spot-item-content">
          {this.props.spotData.title && this.renderTitle(this.props.spotData)}

          {!this.props.spotData.image && <img src={circle} />}
          <div className="tags">
            {this.props.spotData.tags &&
              this.props.spotData.tags.map(tag => <span>{tag}</span>)}
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
