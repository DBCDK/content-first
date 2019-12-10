import React from 'react';
import {connect} from 'react-redux';

import Icon from '../../base/Icon';

import withPermissions from '../../hoc/Permissions';

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
    const {className, openModal, main, pid, onClick = false} = this.props;
    const {active} = this.state;

    if (!main) {
      return null;
    }

    const activeClass = active ? 'active' : '';

    return (
      <button
        className={`compare-button ${className} ${activeClass}`}
        onClick={e => {
          // Prevent opening workpreview on bookmark click
          e.preventDefault();
          e.stopPropagation();

          if (onClick) {
            onClick(e);
          } else {
            this.toggleButton();
            openModal('compare', {main, pids: [main, pid]});
          }
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
)(
  withPermissions(CompareButton, {
    name: 'CompareButton',
    context: {
      title: 'Sammenligning af bøger'
    }
  })
);
