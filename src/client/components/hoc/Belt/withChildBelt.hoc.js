import React from 'react';
import {connect} from 'react-redux';
import {isMobileOnly} from 'react-device-detect';
import {SCROLL_TO_COMPONENT} from '../../../redux/scrollToComponent';
import {UPDATE_MOUNT} from '../../../redux/mounts.reducer';
import {HISTORY_PUSH} from '../../../redux/middleware';

const withChildBelt = WrappedComponent => {
  const Wrapped = class extends React.Component {
    componentDidUpdate(prevProps) {
      if (prevProps.mount !== this.props.mount) {
        // this.props.updateMount({parent: null, child: null, type: null});
      }
    }
    openSimilarBelt = (work, beltName = '', rid) => {
      if (isMobileOnly) {
        this.props.historyPush(work.book.pid);
      } else if (
        work.book.pid === this.props.mountedData.parent &&
        this.props.mountedData.type === 'SIMILAR'
      ) {
        this.props.updateMount({parent: null, child: null, type: null});
      } else {
        const mount = this.props.mount + work.book.pid;
        this.props.scrollToComponent(mount);
        const SimilarBelt = require('../../base/Belt/SimilarBelt.component')
          .default;
        this.props.updateMount({
          type: 'SIMILAR',
          beltName,
          parent: work.book.pid,
          child: (
            <SimilarBelt
              key={mount}
              mount={mount}
              isChildBelt={true}
              likes={[work.book.pid]}
            />
          ),
          rid
        });
      }
    };
    openWorkPreview = (work, beltName = '', rid) => {
      if (isMobileOnly) {
        this.props.historyPush(work.book.pid);
      } else if (
        work.book.pid === this.props.mountedData.parent &&
        this.props.mountedData.type === 'PREVIEW'
      ) {
        this.props.updateMount({parent: null, child: null, type: null});
      } else {
        const mount = this.props.mount + work.book.pid;
        this.props.scrollToComponent(mount);
        const WorkPreview = require('../../work/WorkPreview/WorkPreview.component')
          .default;
        this.props.updateMount({
          type: 'PREVIEW',
          beltName,
          parent: work.book.pid,
          child: (
            <WorkPreview
              mount={mount}
              key={mount}
              pid={work.book.pid}
              dataCy="workpreviewCard"
            />
          ),
          rid
        });
      }
    };

    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            {...this.props}
            selected={this.props.mountedData.parent}
            openSimilarBelt={this.openSimilarBelt}
            openWorkPreview={this.openWorkPreview}
            hasChildBelt={!!this.props.mountedData.child}
          />
          {this.props.mountedData.child}
        </React.Fragment>
      );
    }
  };

  const defaultData = {};
  const mapStateToProps = (state, ownProps) => ({
    mountedData: state.mounts[ownProps.mount] || defaultData
  });
  const mapDispatchToProps = (dispatch, ownProps) => ({
    updateMount: data => {
      dispatch({
        type: UPDATE_MOUNT,
        data,
        mount: ownProps.mount,
        ctx: ownProps.belt
      });
    },
    scrollToComponent: id =>
      dispatch({
        type: SCROLL_TO_COMPONENT,
        id
      }),
    historyPush: pid => {
      dispatch({type: HISTORY_PUSH, path: '/værk/' + pid});
    }
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withChildBelt;
