import React from 'react';

import T from '../../base/T';
import Button from '../../base/Button';
import Text from '../../base/Text';
import Title from '../../base/Title';
import Icon from '../../base/Icon';

import './Modal.css';

export default class Modal extends React.Component {
  render() {
    const {
      className = '',
      doneText = T({component: 'general', name: 'ok'}),
      cancelText = T({component: 'general', name: 'cancel'}),
      hideCancel = false,
      hideConfirm = false,
      doneDisabled,
      onError = false
    } = this.props;
    return (
      <div className="modal-container">
        <div className="modal-backdrop" onClick={this.props.onClose} />
        <div className={`modal-window ${className}`}>
          <div className="top">
            <Icon
              name="clear"
              className="close-modal--X"
              onClick={this.props.onClose}
            />

            <span className="close-modal--back" onClick={this.props.onClose}>
              <Icon name="chevron_left" />
              <span>
                <T component="general" name="back" />
              </span>
            </span>
          </div>

          <div data-cy="modal-content" className="content">
            {this.props.header && (
              <Title type="title4" variant="transform-uppercase--weight-bold">
                {this.props.header}
              </Title>
            )}
            {this.props.children}
          </div>

          {!hideCancel && !hideConfirm && (
            <div className="bottom">
              {onError && (
                <div className="modal-error--txt">
                  <Text type="body" variant="color-fersken">
                    {onError}
                  </Text>
                </div>
              )}
              {!hideCancel && (
                <Button
                  size="medium"
                  className="modal-cancel--btn"
                  type="quaternary"
                  variant="bgcolor-porcelain--color-petroleum"
                  onClick={this.props.onClose}
                >
                  {cancelText}
                </Button>
              )}
              {!hideConfirm && (
                <a
                  data-cy="modal-done-btn"
                  href={this.props.url || null}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    disabled={doneDisabled || onError}
                    size="medium"
                    className={
                      'modal-done--btn' + (doneDisabled ? ' disabled' : '')
                    }
                    type="quaternary"
                    onClick={doneDisabled ? () => {} : this.props.onDone}
                  >
                    {doneText}
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
