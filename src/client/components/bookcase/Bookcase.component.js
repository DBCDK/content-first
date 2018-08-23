import React from 'react';
import {connect} from 'react-redux';

import BookcaseSlider from './BookcaseSlider.component';
import BookcaseItem from './BookcaseItem.component';

/*
  <Bookcase />
*/

export class Bookcase extends React.Component {
  render() {
    if (!this.props.lists) {
      return null;
    }
    return (
      <div className="bookcase row d-block">
        <BookcaseSlider profiles={this.props.profiles}>
          {this.props.lists.map((l, i) => {
            return (
              <BookcaseItem
                profile={this.props.profiles[i]}
                list={l}
                key={'bookcase-' + i}
              />
            );
          })}
        </BookcaseSlider>
        <div className="bookcase-others">
          <span style={{width: this.props.profiles.length * 65 + 160 + 'px'}}>
            Se andre bogreoler
          </span>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    lists: state.bookcaseReducer.lists,
    profiles: state.bookcaseReducer.profiles
  };
};

export default connect(mapStateToProps)(Bookcase);
