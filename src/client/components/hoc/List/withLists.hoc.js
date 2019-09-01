import React from 'react';
import {connect} from 'react-redux';

export const withLists = WrappedComponent => {
  const Wrapper = class extends React.Component {
    getSystemLists = () => {
      const result = {didRead: {list: []}, willRead: {list: []}};
      if (!this.props.lists) {
        return result;
      }

      Object.values(this.props.lists)
        .filter(list => list.type === 'SYSTEM_LIST')
        .forEach(list => {
          if (list.title.toLowerCase() === 'vil læse') {
            result.willRead = list;
          } else if (list.title.toLowerCase() === 'har læst') {
            result.didRead = list;
          }
        });
      return result;
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          getSystemLists={this.getSystemLists}
        />
      );
    }
  };

  const mapStateToProps = state => {
    return {
      lists: state.listReducer.lists || []
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
