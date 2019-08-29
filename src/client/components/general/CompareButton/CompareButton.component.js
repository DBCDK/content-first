import React from 'react';
import {connect} from 'react-redux';

import Icon from '../../base/Icon';
import Button from '../../base/Button';
import T from '../../base/T';

import {OPEN_MODAL} from '../../../redux/modal.reducer';

import './CompareButton.css';

export class CompareButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {active: this.props.active || false};
  }

  toggleButton = () => {
    this.setState({active: !this.state.active});
  };

  render() {
    const {className, openModal, main, pids} = this.props;
    const {active} = this.state;

    if (!main) {
      return null;
    }

    const activeClass = active ? 'active' : '';

    return (
      <button
        className={`CompareButton ${className} ${activeClass}`}
        onClick={e => {
          // Prevent opening workpreview on bookmark click
          e.preventDefault();
          e.stopPropagation();
          this.toggleButton();
          openModal('compare', {main, pids});
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
      modal,
      context
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareButton);
