import React from 'react';
import {connect} from 'react-redux';
import {SCROLL_TO_COMPONENT} from '../../../redux/scrollToComponent';

const withChildBelt = WrappedComponent => {
  const Wrapped = class extends React.Component {
    constructor() {
      super();
      this.state = {parent: null, child: null, type: null};
    }
    componentDidUpdate(prevProps) {
      if (prevProps.mount !== this.props.mount) {
        this.setState({child: null});
      }
    }
    openSimilarBelt = work => {
      if (
        work.book.pid === this.state.parent &&
        this.state.type === 'SIMILAR'
      ) {
        this.setState({parent: null, child: null, type: null});
      } else {
        const mount = this.props.mount + work.book.pid;
        this.props.scrollToComponent(mount);
        const SimilarBelt = require('./SimilarBelt.component').default;
        this.setState({
          type: 'SIMILAR',
          parent: work.book.pid,
          child: (
            <SimilarBelt key={mount} mount={mount} likes={[work.book.pid]} />
          )
        });
      }
    };
    openWorkPreview = work => {
      if (
        work.book.pid === this.state.parent &&
        this.state.type === 'PREVIEW'
      ) {
        this.setState({parent: null, child: null, type: null});
      } else {
        const mount = this.props.mount + work.book.pid;
        this.props.scrollToComponent(mount);
        const WorkPreview = require('../../work/WorkPreview.component').default;
        this.setState({
          type: 'PREVIEW',
          parent: work.book.pid,
          child: <WorkPreview mount={mount} key={mount} pid={work.book.pid} />
        });
      }
    };

    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            {...this.props}
            selected={this.state.parent}
            openSimilarBelt={this.openSimilarBelt}
            openWorkPreview={this.openWorkPreview}
          />
          {this.state.child}
        </React.Fragment>
      );
    }
  };

  const mapDispatchToProps = dispatch => ({
    scrollToComponent: id =>
      dispatch({
        type: SCROLL_TO_COMPONENT,
        id
      })
  });

  return connect(
    null,
    mapDispatchToProps
  )(Wrapped);
};

export default withChildBelt;
