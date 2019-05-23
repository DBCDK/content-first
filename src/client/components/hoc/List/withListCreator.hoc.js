import React from 'react';
import {connect} from 'react-redux';

import T from '../../base/T';

import {ADD_LIST, CUSTOM_LIST} from '../../../redux/list.reducer';
import {saveList} from '../../../utils/requestLists';

/**
 *
 * withListCreator
 *
 **/

export const withListCreator = WrappedComponent => {
  const Wrapper = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {id: null, owner: null};
    }

    componentDidMount() {
      if (!this.props.id && this.props.openplatformId) {
        this.createList();
      }
    }

    componentDidUpdate(prevProps) {
      if (!this.props.id) {
        if (prevProps.openplatformId !== this.props.openplatformId) {
          this.createList();
        }
      }
    }

    /**
     * CreateList
     **/
    createList = async () => {
      const {openplatformId, works, onCreateList} = this.props;

      try {
        const list = await saveList(
          {
            type: CUSTOM_LIST,
            public: false,
            title: T({component: 'list', name: 'noTitleValue'}),
            description: '',
            dotColor: 'petroleum',
            // "Pre-add" works to the created list
            list: works || [],
            _created: Date.now()
          },
          openplatformId
        );

        this.setState({id: list._id});
        // saveList(list, openplatformId);
        onCreateList(list);
      } catch (e) {
        // ignored for now
        // ....
        return;
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          id={this.props.id ? this.props.id : this.state.id}
          justCreated={!!this.state.id}
        />
      );
    }
  };

  const mapStateToProps = state => {
    return {
      openplatformId: state.userReducer.openplatformId
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      onCreateList: async list => {
        await dispatch({type: ADD_LIST, list});
      }
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};
