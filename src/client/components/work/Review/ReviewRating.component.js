import React from 'react';

/**
 * This class displays a list of reviews
 */
class ReviewRating extends React.Component {
  render() {
    const rating = this.props.rating;
    const maxRating = this.props.maxRating;
    const filledShape = this.props.type;
    const emptyShape = this.props.type + '_border';

    let ratingShapes = [];
    for (let i = 0; i < maxRating; i++) {
      const elmStyle = {
        fontSize: '1.2em',
        color:
          rating > i
            ? this.props.type === 'star'
              ? 'var(--korn)'
              : 'var(--fersken)'
            : ' grey'
      };
      ratingShapes.push(
        <i key={i} className="material-icons" style={elmStyle}>
          {rating > i ? filledShape : emptyShape}
        </i>
      );
    }
    return <div className="d-flex">{ratingShapes}</div>;
  }
}

export default ReviewRating;
