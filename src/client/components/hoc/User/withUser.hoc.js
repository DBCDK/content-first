import React from 'react';
import {connect} from 'react-redux';
import {REQUEST_USER, RECEIVE_USER} from '../../../redux/users';

const withUser = WrappedComponent => {
  const Wrapper = class extends React.Component {
    componentDidMount() {
      this.doFetch();
    }
    componentDidUpdate() {
      this.doFetch();
    }
    doFetch() {
      if (this.props.id && !this.props.user && this.fetched !== this.props.id) {
        this.props.fetch();
        this.fetched = this.props.id;
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = (state, ownProps) => ({
    user: state.users[ownProps.id]
  });
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      fetch: () =>
        dispatch({
          type: REQUEST_USER,
          id: ownProps.id
        })
    };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper);
};

export default withUser;
