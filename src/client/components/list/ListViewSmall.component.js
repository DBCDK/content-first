import React from 'react';
import TruncateMarkup from 'react-truncate-markup';
import BookCover from '../general/BookCover.component';

class ListViewSmall extends React.PureComponent {
  render() {
    const {list, style} = this.props;
    const elements = list.list;
    return (
      <div className="list-small" style={style}>
        <div className="list-small-covers">
          <div className="list-small-covers-wrapper">
            {elements.length > 0 &&
              elements.slice(0, 3).map(e => {
                return <BookCover className="list-small-cover" book={e} />;
              })}
          </div>
        </div>
        <div className="list-small-summary">
          <TruncateMarkup lines={2}>
            <h3 className="list-small-title h-tight">{list.title}</h3>
          </TruncateMarkup>
          <TruncateMarkup lines={3}>
            <div className="list-small-description">{list.description}</div>
          </TruncateMarkup>
        </div>
      </div>
    );
  }
}

export default ListViewSmall;
