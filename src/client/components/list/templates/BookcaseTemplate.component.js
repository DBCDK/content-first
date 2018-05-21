import React from 'react';

import BookcaseItem from '../../bookcase/BookcaseItem.component';
import SimpleList from './SimpleList.component';

export default class BookcaseTemplate extends React.Component {
  constructor() {
    super();
    this.state = {clientWidth: 0, popOverPid: null};
  }

  render() {
    const {list, profile} = this.props;
    if (!list) {
      return null;
    }

    list.descriptionImage = true;

    return (
      <div className="bookcase-template">
        <BookcaseItem profile={profile} list={list} />
        <SimpleList
          key="simple-list"
          editButton={this.props.editButton}
          list={list}
          profile={profile}
          profiles={this.props.profiles}
        />
      </div>
    );
  }
}
