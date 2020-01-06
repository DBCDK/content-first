import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal.component';
import CompareBooks from '../work/CompareBooks/CompareBooks.component';

import {CLOSE_MODAL} from '../../redux/modal.reducer';

export class CompareBooksModal extends React.Component {
  render() {
    const {close, context} = this.props;

    return (
      <Modal
        header="SAMMENLIGNING"
        onClose={close}
        onDone={() => close()}
        doneText="Gem ændringer"
        hideConfirm={true}
        hideCancel={true}
      >
        <CompareBooks {...context} />
      </Modal>
    );
  }
}
const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  close: () => dispatch({type: CLOSE_MODAL, modal: 'compare'})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareBooksModal);
