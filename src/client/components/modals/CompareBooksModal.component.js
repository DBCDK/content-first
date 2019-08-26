import React from 'react';
import {connect} from 'react-redux';
import {isMobile} from 'react-device-detect';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';

import Modal from './Modal/Modal.component';
import Text from '../base/Text';
import Icon from '../base/Icon';
import {withList} from '../hoc/List';
import withWork from '../hoc/Work/withWork.hoc';

import {CLOSE_MODAL} from '../../redux/modal.reducer';

export class CompareBooksModal extends React.Component {
  render() {
    const {close} = this.props;

    return (
      <Modal
        header="SAMMENLIGNING"
        onClose={close}
        onDone={() => {
          close();
        }}
        doneText="Gem ændringer"
        hideConfirm={true}
        hideCancel={true}
        className="reorder-list-modal-window"
      >
        hej
      </Modal>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({});
const mapDispatchToProps = dispatch => ({
  close: () => dispatch({type: CLOSE_MODAL, modal: 'compare'})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWork(CompareBooksModal));
