import React from 'react';
import {connect} from 'react-redux';

import Icon from '../../base/Icon';

import {OPEN_MODAL} from '../../../redux/modal.reducer';

import './CompareButton.css';

export class CompareButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {active: props.active || false};
  }

  toggleButton = () => {
    this.setState({active: !this.state.active});
  };

  componentDidUpdate() {
    if (this.state.active && !this.props.compareIsOpen) {
      this.toggleButton();
    }
  }

  render() {
    const {className, openModal, main, pid} = this.props;
    const active =
      typeof this.props.active !== 'undefined'
        ? this.props.active
        : this.state.active;

    if (!main) {
      return null;
    }

    const activeClass = active ? 'active' : '';
    return (
      <button
        className={`compare-button ${className} ${activeClass}`}
        data-cy={active ? 'compare-button-active' : 'compare-button-inactive'}
        onClick={e => {
          // Prevent opening workpreview on bookmark click
          e.preventDefault();
          e.stopPropagation();
          this.toggleButton();
          openModal('compare', {main, pids: [main, pid]});
        }}
      >
        <Icon name="compare_arrows" />
      </button>
    );
  }
}

const mapStateToProps = state => {
  return {
    compareIsOpen: state.modalReducer.compare.open
  };
};
export const mapDispatchToProps = dispatch => ({
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
