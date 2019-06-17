import React from 'react';
import Spinner from '../general/Spinner/Spinner.component';
import Title from '../base/Title';
import T from '../base/T';
import SimpleList from './templates/simple/SimpleList';
import BookcaseList from './templates/bookcase/BookcaseList';

import {withList} from '../hoc/List';

export class ListPage extends React.Component {
  // eslint-disable-next-line no-unused-vars
  getTemplate(list) {
    const template = list.template;

    switch (template) {
      case 'list':
        return SimpleList;
      case 'bookcase':
        return BookcaseList;
      default:
        return SimpleList;
    }
  }
  render() {
    const {list} = this.props;

    if (!list || list.isLoading) {
      // TODO make a skeleton view of list
      return (
        <div className="d-flex justify-content-center">
          <Spinner size="30px" className="mt-5" />
        </div>
      );
    }

    if (list.error) {
      return (
        <Title
          Tag="h1"
          type="title3"
          className="text-center mt-5"
          data-cy="list-error"
        >
          <T component="list" name="fetchListError" />
        </Title>
      );
    }
    if (!list._type) {
      return (
        <Title Tag="h1" type="title3" className="text-center mt-5">
          <T component="list" name="listNotAvailable" />
        </Title>
      );
    }

    const Template = this.getTemplate(list);

    return <Template _id={list._id} />;
  }
}

export default withList(ListPage);
