import React from 'react';
import {isMobile} from 'react-device-detect';

import Button from '../../base/Button';
import Text from '../../base/Text';
import Title from '../../base/Title';
import Icon from '../../base/Icon';

import './Modal.css';

export default class Modal extends React.Component {
  render() {
    const {
      doneText = 'OK',
      cancelText,
      hideCancel = false,
      hideConfirm = false,
      doneDisabled,
      onError = false
    } = this.props;
    return (
      <div className="modal-container ">
        <div className="modal-backdrop" onClick={this.props.onClose} />
        <div className={'modal-window ' + this.props.className || ''}>
          <div className="top d-flex flex-row justify-content-start justify-content-sm-end">
            <Icon
              name="clear"
              className={
                'm-3 d-none d-sm-inline-block ' +
                (isMobile ? ' increase-touch-area-large' : '')
              }
              onClick={this.props.onClose}
              style={{cursor: 'pointer'}}
            />
            <Button
              size="medium"
              className="m-3 d-inline-block d-sm-none"
              type="link2"
              onClick={this.props.onClose}
            >
              <Icon name="chevron_left" className="align-middle" />
              <span className="align-middle">Tilbage</span>
            </Button>
          </div>

          <div data-cy="modal-content" className="content">
            {this.props.header && (
              <Title type="title4" variant="transform-uppercase--weight-bold">
                {this.props.header}
              </Title>
            )}
            {this.props.children}
            {!hideCancel && !hideConfirm && (
              <div className="modal-seperator mt-5 mb-4" />
            )}
            {
              <div className="bottom d-flex flex-row justify-content-end align-items-center pt-1">
                {onError && (
                  <div className="mr-3">
                    <Text type="body" variant="color-fersken">
                      {onError}
                    </Text>
                  </div>
                )}
                {!hideCancel && cancelText && (
                  <Button
                    size="medium"
                    className="mr-1"
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
                  >
                    <Button
                      disabled={onError}
                      size="medium"
                      className={'mr-0' + (doneDisabled ? ' disabled' : '')}
                      type="quaternary"
                      onClick={doneDisabled ? () => {} : this.props.onDone}
                    >
                      {doneText}
                    </Button>
                  </a>
                )}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
