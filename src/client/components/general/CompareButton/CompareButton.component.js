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
        data-cy={'compare-button'}
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
    modals: {
      login: {
        context: {
          title: 'Sammenligning af bøger',
          reason:
            'Log ind for at finde ud af, om dit bibliotek abonnerer på Læsekompas.dk – og dermed giver mulighed for at sammenligne bøger.'
        }
      },
      premium: {
        context: {
          title: 'Sammenligning af bøger',
          reason:
            'Dit bibliotek abonnerer ikke på Læsekompas.dk, og du har derfor ikke adgang til sammenligning af bøger.',
          hideConfirm: false,
          hideCancel: true
        }
      }
    }
  })
);
