import React from 'react';
import {connect} from 'react-redux';
import Icon from '../base/Icon';
import Button from '../base/Button';

import {OPEN_MODAL} from '../../redux/modal.reducer';

import './AddToListButton.css';

export class AddToListButton extends React.Component {
  render() {
    return (
      <Button
        className="AddToListButton"
        type="tertiary"
        size="medium"
        onClick={e => {
          this.props.openModal(this.props.work);
          e.stopPropagation();
        }}
      >
        Tilføj til liste
        <Icon name={'more_vert'} />
      </Button>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export const mapDispatchToProps = dispatch => ({
  openModal: work => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'addToList',
      context: work
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddToListButton);
