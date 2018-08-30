import React from 'react';
import {connect} from 'react-redux';
import BookcaseItem from './BookcaseItem.component';

/*
  <Bookcase />
*/

export class Bookcase extends React.Component {
  render() {
    if (!this.props.lists) {
      return null;
    }

    // TODO: the idea is that only one celeb will show at a time for a set period and then it will be switched out with a new one.
    // TODO:     // TODO: should be passed in here should be passed in here

    const celebnum = 0;
    return (
      <div className="row">
        <BookcaseItem
          profile={this.props.profiles[celebnum]}
          list={this.props.lists[celebnum]}
          key={'bookcase-' + celebnum}
        />
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
