import React from 'react';
import Image from '../Image.component';
import CheckmarkMenu, {MenuItem} from '../general/CheckmarkMenu.component';
import TouchHover from '../general/TouchHover.component';

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
      <div className="work" id={`work-${this.props.id}`}>
        <TouchHover className='cover-image-wrapper'>
          <TouchHover
            className='cover-image'
            onClick={(touches) => {
              if (touches !== 1) {
                this.props.onCoverClick(this.props.work.book.pid);
              }
            }}>
            <Image urls={[
              `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(this.props.work.book.pid)}`,
              `/v1/image/${encodeURIComponent(this.props.work.book.pid)}`,
              '/default-book-cover.png'
            ]}/>
          </TouchHover>
          <CheckmarkMenu
            text="Husk"
            checked={this.props.marked}
            onClick={() => this.props.onRememberClick(this.props.work)}>
            {systemLists.map(l => (
              <MenuItem
                key={l.id}
                text={l.name}
                checked={l.elements.indexOf(this.props.work.book.pid) !== -1}
                onClick={() => {

                }}/>
            ))}
            <MenuItem
              key="addToList"
              text="Tilføj til liste"
              onClick={() => {

              }}/>
          </CheckmarkMenu>
        </TouchHover>


        <div className='metakompas-description'>
          {tax_description && tax_description.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
        </div>

      </div>
    );
  }
}

export default WorkItem;
