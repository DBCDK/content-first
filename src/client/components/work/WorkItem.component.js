import React from 'react';

class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cover: props.work.links.cover};
  }

  render() {
    const tax_description = this.props.work.book.taxonomy_description || this.props.work.book.description;
    return (
      <div className='work' id={`work-${this.props.id}`}>
        <div className='cover-image-wrapper scale-on-hover' onClick={() => {
          this.props.onCoverClick(this.props.work.book.pid);
        }}>
          {this.props.work.links && <img
            alt=""
            className='cover-image'
            src={this.state.cover}
            onError={() => {
              this.setState({cover: '/default-book-cover.png'});
            }}/>}
        </div>
        <div className='metakompas-description'>
          {tax_description && tax_description.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
      </div>
    );
  }
}

export default WorkItem;
