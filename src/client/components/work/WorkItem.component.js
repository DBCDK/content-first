import React from 'react';
import BookCover from '../general/BookCover.component';
import CheckmarkConnected from '../general/CheckmarkConnected.component';
import TouchHover from '../general/TouchHover.component';

class WorkItem extends React.Component {
  constructor() {
    super();
    this.state = {coverLoaded: false};
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.changeMap[this.props.work.book.pid] !==
        nextProps.changeMap[this.props.work.book.pid] ||
      this.props.marked !== nextProps.marked ||
      this.props.work !== nextProps.work ||
      this.props.systemLists.length !== nextProps.systemLists.length ||
      this.props.visibleInSlider !== nextProps.visibleInSlider ||
      this.state.coverLoaded !== nextState.coverLoaded
    );
  }

  render() {
    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.description;
    return (
      <div className={this.props.workClass}>
        <TouchHover
          className={`cover-image-wrapper ${
            this.state.coverLoaded ? 'loaded' : ''
          }`}
        >
          {this.props.visibleInSlider !== false && [
            <TouchHover
              key="cover"
              className="cover-image"
              onClick={touches => {
                if (touches !== 1) {
                  this.props.onCoverClick(this.props.work.book.pid);
                }
              }}
            >
              <BookCover
                book={this.props.work.book}
                onLoad={() => this.setState({coverLoaded: true})}
              />
            </TouchHover>,
            <CheckmarkConnected
              key="checkmarkmenu"
              book={this.props.work}
              origin={this.props.origin}
            />
          ]}
        </TouchHover>
        <div className="metakompas-description">
          {this.props.showTaxonomy &&
            tax_description &&
            tax_description
              .split('\n')
              .map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
      </div>
    );
  }
}

export default WorkItem;
