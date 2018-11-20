import React from 'react';
import Button from '../base/Button';
import Text from '../base/Text';
import Icon from '../base/Icon';

import './Modal.css';

export default class Modal extends React.Component {
  render() {
    const {
      doneText = 'OK',
      cancelText,
      hideCancel = false,
      hideConfirm = false,
      doneDisabled
    } = this.props;

    return (
      <div className="modal-container ">
        <div className="modal-backdrop" onClick={this.props.onClose} />
        <div className={'modal-window ' + this.props.className || ''}>
          <div
            className="top d-flex flex-row justify-content-start justify-content-sm-end"
            style={{borderBottom: '1px solid var(--pistache)'}}
          >
            <Icon
              name="clear"
              className="m-3 d-none d-sm-inline-block"
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

          <div className="content p-4">
            <Text type="large">{this.props.header}</Text>
            {this.props.children}
            {!hideCancel && !hideConfirm && (
              <div className="bottom d-flex flex-row justify-content-end mb-5 mt-5">
                {!hideCancel && cancelText && (
                  <Button
                    size="medium"
                    className="mr-4"
                    type="link"
                    onClick={this.props.onClose}
                  >
                    {cancelText}
                  </Button>
                )}
                {!hideConfirm && (
                  <a href={this.props.url || null} target="_blank">
                    <Button
                      className={'mr-4 ' + (doneDisabled && 'disabled')}
                      type="quaternary"
                      onClick={doneDisabled || this.props.onDone}
                    >
                      {doneText}
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
