import React from 'react';
import Image from '../Image.component';

export default props => {
  return (
    <div className="book-cover">
      <Image
        urls={[
          `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(
            props.pid
          )}`,
          `/v1/image/${encodeURIComponent(props.pid)}`,
          '/default-book-cover.png'
        ]}
      />
    </div>
  );
};
