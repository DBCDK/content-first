import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SpotItem from './SpotItem.component';
import './Spots.css';

export class SpotsBelt extends React.Component {
  render() {
    return (
      <div className="spots-container">
        {this.props.spots.map((spot, index) => {
          if (spot.show) {
            return (
              <SpotItem
                key={index}
                spotData={spot}
                className={index === 0 ? 'ml-0' : ''}
              />
            );
          }
          return null;
        })}
      </div>
    );
  }
}
SpotsBelt.propTypes = {
  spots: PropTypes.array
};
const mapStateToProps = state => {
  return {
    spots: state.spotsReducer.spots
  };
};

export default connect(mapStateToProps)(SpotsBelt);
