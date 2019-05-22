import React from 'react';
import {connect} from 'react-redux';

import {
  OWNED_LISTS_REQUEST,
  OWNED_LISTS_RESPONSE,
  LIST_LOAD_RESPONSE
} from '../../../redux/list.reducer';
import {loadLists} from '../../../utils/requestLists';

export const withLists = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentDidMount() {
      this.loadLists();
    }

    /**
     * LoadLists
     **/
    loadLists = async () => {
      const {
        onLoadListsRequest,
        onLoadListsResponse,
        listLoadResponse,
        openplatformId
      } = this.props;

      try {
        onLoadListsRequest();
        const lists = await loadLists({openplatformId});

        // Add all fetched lists to the listReducer
        const allLists = [...lists];
        allLists.forEach(list => {
          listLoadResponse(list);
        });

        onLoadListsResponse(lists);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = state => {
    return {
      lists: state.listReducer.lists || [],
      openplatformId: state.userReducer.openplatformId
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      onLoadListsRequest: () => {
        dispatch({type: OWNED_LISTS_REQUEST});
      },
      onLoadListsResponse: lists => {
        dispatch({type: OWNED_LISTS_RESPONSE, lists});
      },
      listLoadResponse: list => {
        dispatch({type: LIST_LOAD_RESPONSE, list});
      }
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};
