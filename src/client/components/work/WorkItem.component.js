import React from 'react';
import Image from '../Image.component';
import CheckmarkMenu, {MenuItem} from '../general/CheckmarkMenu.component';

class WorkItem extends React.Component {
  render() {
    const systemLists = [
      {
        id: 'blah',
        name: 'Har læst',
        elements: ['870970-basis:51772679', 'somepid2']
      },
      {
        id: 'blah2',
        name: 'Vil læse',
        elements: ['somepid1', 'somepid2']
      }
    ];

    const tax_description = this.props.work.book.taxonomy_description || this.props.work.book.description;
    return (
      <div className='work' id={`work-${this.props.id}`}>
        <div className='cover-image-wrapper'>
          <div className='cover-image' onClick={() => {
            this.props.onCoverClick(this.props.work.book.pid);
          }}>
            <Image urls={[
              `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(this.props.work.book.pid)}`,
              `/v1/image/${encodeURIComponent(this.props.work.book.pid)}`,
              '/default-book-cover.png'
            ]}/>
          </div>
          <CheckmarkMenu
            text="Husk"
            checked={true}
            onClick={() => (console.log('header click'))}>
            {systemLists.map(l => (
              <MenuItem
                key={l.id}
                text={l.name}
                checked={l.elements.indexOf(this.props.work.book.pid) !== -1}
                onClick={() => (console.log(this.props.work.book, l))}/>
            ))}
            <MenuItem
              key="addToList"
              text="Tilføj til liste"
              onClick={() => (console.log(this.props.work.book, 'tilføj'))}/>
          </CheckmarkMenu>
        </div>
        <div className='metakompas-description'>
          {tax_description && tax_description.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
      </div>
    );
  }
}

export default WorkItem;
