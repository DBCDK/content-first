import React from 'react';
import Image from '../Image.component';

class WorkItem extends React.Component {
  render() {
    const tax_description = this.props.work.book.taxonomy_description || this.props.work.book.description;
    return (
      <div className='work' id={`work-${this.props.id}`}>
        <div className='cover-image-wrapper scale-on-hover' onClick={() => {
          this.props.onCoverClick(this.props.work.book.pid);
        }}>
          <div className='cover-image'>
            <Image urls={[
              `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(this.props.work.book.pid)}`,
              `/v1/image/${encodeURIComponent(this.props.work.book.pid)}`,
              '/default-book-cover.png'
            ]}/>
          </div>
        </div>
        <div className='metakompas-description'>
          {tax_description && tax_description.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
      </div>
    );
  }
}

export default WorkItem;
