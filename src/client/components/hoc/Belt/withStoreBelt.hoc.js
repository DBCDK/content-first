import React from 'react';
import {connect} from 'react-redux';
import {storeBelt, removeBelt, updateBelt} from '../../../redux/belts.reducer';

const withBeltStore = WrappedComponent => {
  const Wrapped = class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = (state, ownProps) => ({
    belt: state.beltsReducer.belts[ownProps.id],
    isStored: !!state.beltsReducer.belts[ownProps.id]
  });
  const mapDispatchToProps = (dispatch, ownProps) => ({
    storeBelt: belt =>
      dispatch(
        storeBelt({
          ...belt,
          key: ownProps.id
        })
      ),
    updateBelt: belt =>
      dispatch(
        updateBelt({
          ...belt,
          key: ownProps.id
        })
      ),
    removeBelt: () =>
      dispatch(removeBelt({_id: ownProps._id, key: ownProps.id}))
  });
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withBeltStore;
