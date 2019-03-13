import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {SCROLL_TO_COMPONENT_COMPLETE} from '../../../redux/scrollToComponent';

const withScrollToComponent = WrappedComponent => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.handleScroll();
    }

    componentDidUpdate() {
      this.handleScroll();
    }

    handleScroll() {
      if (this.props.doScroll) {
        scrollToComponent(this.componentRef, {
          align: 'bottom',
          ease: 'inOutCube'
        });
        this.props.complete();
      }
    }

    render() {
      return (
        <div ref={ref => (this.componentRef = ref)}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };

  const mapStateToProps = (state, ownProps) => {
    return {
      doScroll: !!state.scrollToComponent[ownProps.mount]
    };
  };
  const mapDispatchToProps = (dispatch, ownProps) => ({
    complete: () =>
      dispatch({
        type: SCROLL_TO_COMPONENT_COMPLETE,
        id: ownProps.mount
      })
  });
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withScrollToComponent;
