import React from 'react';
import {connect} from 'react-redux';

export const withLists = WrappedComponent => {
  const Wrapper = class extends React.Component {
    getSystemLists = () => {
      const result = {
        didRead: {list: []},
        willRead: {list: []},
        shortlist: this.props.shortlist || []
      };
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
    getCustomLists = () => {
      return Object.values(this.props.lists).filter(
        list =>
          list.type === 'CUSTOM_LIST' && list._owner === this.props.loggedInUser
      );
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          getSystemLists={this.getSystemLists}
          getCustomLists={this.getCustomLists}
        />
      );
    }
  };

  const mapStateToProps = state => {
    return {
      lists: state.listReducer.lists || {},
      shortlist: state.userReducer.shortlist,
      loggedInUser: state.userReducer.openplatformId
    };
  };

  return connect(mapStateToProps)(Wrapper);
};
