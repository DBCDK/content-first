import React from 'react';
import Image from '../Image.component';

export default (props) => {

  return (
    <div className="work-item-small clearfix">
      <div className="col-xs-3">
        <div className="cover-image-wrapper">
          <Image urls={[
            `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(props.work.book.pid)}`,
            `/v1/image/${encodeURIComponent(props.work.book.pid)}`,
            '/default-book-cover.png'
          ]}/>
        </div>
      </div>
      <div className="col-xs-9 info">
        <div className="title">{props.work.book.title}</div>
        <div className="creator">{props.work.book.creator}</div>
      </div>
    </div>
  );
};
