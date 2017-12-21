import React from 'react';

class ListView extends React.PureComponent {
  render() {
    const {list} = this.props;
    return (
      <div className="list">
        <h3 className="list-title">{list.title}</h3>
        <p className="list-title">{list.description}</p>
        <div className="list-wrapper" />
      </div>
    );
  }
}

export default ListView;
