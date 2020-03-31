import React from 'react';
import {connect} from 'react-redux';
import {isMobileOnly} from 'react-device-detect';
import {SCROLL_TO_COMPONENT} from '../../../redux/scrollToComponent';
import {UPDATE_MOUNT, REMOVE_MOUNT} from '../../../redux/mounts.reducer';
import {HISTORY_PUSH} from '../../../redux/middleware';
import scrollToComponent from 'react-scroll-to-component';

const withChildBelt = WrappedComponent => {
  const Wrapped = class extends React.Component {
    componentDidUpdate(prevProps) {
      if (prevProps.mount !== this.props.mount) {
        // this.closeChild();
      }
    }

    clearDuplicates = (m) => {
      let allmounts = this.props.mounts;
      Object.keys(allmounts).forEach((key) => {
        if (allmounts[key].parent === m.parent) {
          if (allmounts[key].type === "SIMILAR") {
            this.props.removeMount(key);
          }
        }
      });
    };

    closeChild = () => {
      this.props.updateMount({parent: null, child: null, type: null});
    };
    openSimilarBelt = (work, beltName = '', rid) => {
      this.clearDuplicates(this.props.mountedData);
      if (this.props.is_work_page) {
        const scrollToDiv = document.getElementsByClassName('similar-belt');
        scrollToComponent(scrollToDiv[0]);
      } else if (
        work.book.pid === this.props.mountedData.parent &&
        this.props.mountedData.type === 'SIMILAR'
      ) {
        this.closeChild();
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
              close={this.closeChild}
            />
          ),
          rid
        });
      }
    };
    openWorkPreview = (work, beltName = '', rid) => {
      // temporarily disable preview in kiosk mode
      // should be enabled again when new preview for kiosk is implemented
      if (this.props.kiosk.enabled) {
        this.props.historyPush(work.book.pid, {slide: 0});
      } else if (isMobileOnly) {
        this.props.historyPush(work.book.pid);
      } else if (
        work.book.pid === this.props.mountedData.parent &&
        this.props.mountedData.type === 'PREVIEW'
      ) {
        this.closeChild();
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
              className="preview light-grey"
              hideAppels={true}
              mount={mount}
              key={mount}
              pid={work.book.pid}
              dataCy="workpreviewCard"
              close={this.closeChild}
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
            closeChild={this.closeChild}
          />
          {this.props.mountedData.child}
        </React.Fragment>
      );
    }
  };

  const defaultData = {};
  const mapStateToProps = (state, ownProps) => ({
    mounts: state.mounts,
    mountedData: state.mounts[ownProps.mount] || defaultData,
    kiosk: state.kiosk
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
    removeMount: mount => {
      dispatch({
        type: REMOVE_MOUNT,
        mount: mount
      });
    },
    scrollToComponent: id =>
      dispatch({
        type: SCROLL_TO_COMPONENT,
        id
      }),
    historyPush: (pid, params) => {
      dispatch({type: HISTORY_PUSH, path: '/værk/' + pid, params});
    }
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withChildBelt;
