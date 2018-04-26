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

    const bookcaseObj = {
      id: list.id,
      name: profile.name,
      img: '/v1/image/' + profile.image + '/150/150',
      description: list.description,
      descriptionImage: true,
      bookcase: '/v1/image/' + list.image + '/1200/600',
      books: []
    };
    bookcaseObj.books = list.list.map(e => {
      return {
        pid: e.book.pid,
        position: e.position,
        description: e.description
      };
    });

    return (
      <div className="bookcase-template">
        <BookcaseItem celeb={bookcaseObj} />
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
