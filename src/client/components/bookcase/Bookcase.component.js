import React from 'react';
import {connect} from 'react-redux';

import BookcaseSlider from './BookcaseSlider.component';
import BookcaseItem from './BookcaseItem.component';

/*
  <Bookcase />
*/

export class Bookcase extends React.Component {
  render() {
    return (
      <div className="bookcase row">
        <BookcaseSlider celebs={this.props.celebs}>
          {this.props.celebs.map(c => {
            return <BookcaseItem celeb={c} key={'bookcase-' + c.id} />;
          })}
        </BookcaseSlider>
        <div className="bookcase-others">
          <span style={{width: this.props.celebs.length * 65 + 155 + 'px'}}>
            Se andre bogreoler
          </span>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    celebs: state.bookcaseReducer.celebs
  };
};

export default connect(mapStateToProps)(Bookcase);
