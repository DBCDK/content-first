import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal.component';
import WorkItemSmall from '../work/WorkItemSmall.component';
import LineBehindText from '../general/LineBehindText.component';
import {SHORTLIST_APPROVE_MERGE} from '../../redux/shortlist.reducer';
import {CLOSE_MODAL} from '../../redux/modal.reducer';

const SHORT_LIST_MAX_LENGTH = 3;

class ShortListMergeModal extends React.Component {
  approveMerge = () => {
    this.props.dispatch({type: SHORTLIST_APPROVE_MERGE});
    this.props.dispatch({type: CLOSE_MODAL, modal: 'mergeShortList'});
  };
  render() {
    const {elements = [], pendingMerge} = this.props.shortListState;
    const numPending = pendingMerge ? pendingMerge.diff.length : 0;
    let merged = null;
    if (pendingMerge) {
      merged = [...pendingMerge.diff, ...elements];
    }
    return (
      <Modal
        className="short-list--merge-modal"
        header="HUSKELISTE"
        onClose={this.approveMerge}
        onDone={this.approveMerge}
      >
        <strong>
          {`Nu hvor du er logget ind, har vi gemt ${numPending} ${
            numPending > 1 ? 'bøger' : 'bog'
          }
          fra huskelisten på den huskeliste, der hører til din profil:`}
        </strong>
        <div className="work-list">
          {merged &&
            merged.slice(0, SHORT_LIST_MAX_LENGTH).map(e => {
              return <WorkItemSmall work={e} key={e.book.pid} />;
            })}
        </div>
        {merged &&
          merged.length > SHORT_LIST_MAX_LENGTH && (
            <div>
              <LineBehindText
                label={
                  merged.length - SHORT_LIST_MAX_LENGTH > 1
                    ? `og ${merged.length - SHORT_LIST_MAX_LENGTH} andre bøger`
                    : '1 anden bog'
                }
              />
            </div>
          )}
      </Modal>
    );
  }
}
export default connect(state => {
  return {
    shortListState: state.shortListReducer
  };
})(ShortListMergeModal);
