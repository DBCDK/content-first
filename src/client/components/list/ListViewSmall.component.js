import React from 'react';
import TruncateMarkup from 'react-truncate-markup';

class ListViewSmall extends React.PureComponent {
  render() {
    const {list, style} = this.props;
    return (
      <div className="list-small" style={style}>
        <div className="list-small-cover-preview" />
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
