import React from 'react';
import {connect} from 'react-redux';

import Icon from '../../base/Icon';
import Button from '../../base/Button';
import T from '../../base/T';

import {OPEN_MODAL} from '../../../redux/modal.reducer';

import './CompareButton.css';

export class CompareButton extends React.PureComponent {
  render() {
    const {className, openModal} = this.props;

    return (
      <button
        className={`CompareButton ${className}`}
        onClick={e => {
          // Prevent opening workpreview on bookmark click
          e.preventDefault();
          e.stopPropagation();
          openModal('compare', {});
        }}
      >
        <Icon name="compare_arrows" hex="&#xe915;" />
      </button>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: (modal, context) => {
    dispatch({
      type: OPEN_MODAL,
      modal: modal,
      context
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareButton);
