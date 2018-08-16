import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SpotItem from './SpotItem.component';
import './Spots.css';
const skeletonElements = [];
for (let i = 0; i < 20; i++) {
  skeletonElements.push(i);
}
export class SpotsBelt extends React.Component {
  constructor(props) {
    super(props);
  }

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
