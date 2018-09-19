import React from 'react';
import './FeedbackButton.css';
import Button from '../base/Button/Button';
import Icon from '../base/Icon/Icon';

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
          window.open(
            'https://docs.google.com/forms/d/e/1FAIpQLSed2LP_swf0juMqNxYdfn9HKepjxj3USxSwR2XfjEW8SlaiAw/viewform',
            '_blank'
          );
        }}
      >
        <Icon className="icon__feedback md-small" name="chat_bubble_outline" />
        <span />
      </Button>
    </div>
  );
}

export default FeedbackButton;
