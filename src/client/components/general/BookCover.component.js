import React from 'react';
import Image from '../Image.component';

export default props => {
  return (
    <Image
      alt={props.book.title}
      className={props.className || ''}
      urls={[
        `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(
          props.book.pid
        )}`,
        `/v1/image/${encodeURIComponent(props.book.pid)}`,
        '/default-book-cover.png'
      ]}
    />
  );
};
