import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {SCROLL_TO_COMPONENT_COMPLETE} from '../../../redux/scrollToComponent';
import {get} from 'lodash';

const withScrollToComponent = WrappedComponent => {
  const Wrapped = class extends React.Component {
    componentDidMount() {
      this.handleScroll();
    }

    componentDidUpdate() {
      this.handleScroll();
    }

    shouldComponentUpdate(nextProps) {
      return (
        (nextProps.router !== this.props.router && nextProps.hashMatch) ||
        nextProps.doScroll !== this.props.doScroll
      );
    }

    handleScroll() {
      if (this.props.doScroll) {
        scrollToComponent(this.componentRef, {
          align: 'middle',
          ease: 'inOutCube'
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
      doScroll: hashMatch || !!state.scrollToComponent[ownProps.mount]
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
