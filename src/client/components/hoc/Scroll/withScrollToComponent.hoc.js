import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {SCROLL_TO_COMPONENT_COMPLETE} from '../../../redux/scrollToComponent';
import {get} from 'lodash';

const withScrollToComponent = (WrappedComponent, options = {}) => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.handleScroll();
    }

    componentDidUpdate(prevProps) {
      this.handleScroll(prevProps);
    }

    handleScroll(prevProps = {}) {
      if (
        (prevProps.router !== this.props.router && this.props.hashMatch) ||
        this.props.doScroll
      ) {
        scrollToComponent(this.componentRef, {
          align: 'middle',
          ease: 'inOutCube',
          ...options
        });
        this.props.complete();
      }
    }

    render() {
      return (
        <div
          className="scroll-to-component"
          ref={ref => (this.componentRef = ref)}
        >
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };

  const mapStateToProps = (state, ownProps) => {
    const hashMatch =
      ownProps.id && get(state, 'routerReducer.hash', '') === `#${ownProps.id}`;

    return {
      router: state.routerReducer,
      hashMatch,
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
  return connect(mapStateToProps, mapDispatchToProps)(Wrapped);
};

export default withScrollToComponent;
