import React from 'react';
import Header from '../base/Header';
import Spinner from '../general/Spinner/Spinner.component';
import Title from '../base/Title';
import T from '../base/T';
import SimpleList from './templates/simple/SimpleList';
import BookcaseList from './templates/bookcase/BookcaseList';

import {withList} from '../hoc/List';
import {withWork} from '../hoc/Work';

// const TitleWithWork = withWork(work => {
//   console.log('work');
//   return work && work.book.title;
// });

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

  // buildTitleDescription(books) {
  //   books.forEach((b, i) => {
  //     if (i <= 2) {
  //       <TitleWithWork pid={b.pid} />;
  //     }
  //   });
  // }

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

    return (
      <React.Fragment>
        <Header
          key="list-header"
          title={list.title || 'Læsekompas'}
          description={
            list.description && list.description !== ''
              ? list.description
              : null
          }
          canonical={'/lister'}
          og={{
            'og:title': list.title,
            'og:description':
              list.description && list.description !== ''
                ? list.description
                : null,
            'og:url': `https://laesekompas.dk/list/${list.id}`,
            image: {
              'og:image': `/v1/image/${list.image}/1200/600`,
              'og:image:width': '1200',
              'og:image:height': '600'
            }
          }}
        />
        <Template _id={list._id} />
      </React.Fragment>
    );
  }
}

export default withList(ListPage);
