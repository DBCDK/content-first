import React from 'react';
import Button from '../../base/Button/Button';
import Icon from '../../base/Icon/Icon';

import './FeedbackButton.css';

function FeedbackButton() {
  return (
    <div className="feedback-container">
      <Button
        className="Button__feedback"
        type="secondary"
        size="medium"
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          window.open('https://kundeservice.dbc.dk/lk', '_blank');
        }}
      >
        <Icon className="icon__feedback md-small" name="chat_bubble_outline" />
        <span className="feedback-text" />
      </Button>
    </div>
  );
}

export default FeedbackButton;
