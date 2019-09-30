import React from 'react';
import './Notification.css';
import Title from '../../base/Title';
import Text from '../../base/Text';

export const INFO = 'info';
export const WARNING = 'warning';
export const ERROR = 'error';
export const FATAL = 'fatal';

/**
 * This class displays a notification
 */
export default class Notification extends React.Component {
  render() {
    const {notificationType, title, text, cause} = this.props;
    return (
      <div className="Notification__container" data-cy="notification-container">
        <Title Tag="h4" type="title4" className="Notification__container-title">
          {notificationType.toLowerCase().replace(/^\w/, c => c.toUpperCase())}{' '}
          - {title}
        </Title>
        <Text className="Notification__container-text">{text}</Text>
        {cause === '' || (
          <Text className="Notification__container-cause">{cause}</Text>
        )}
      </div>
    );
  }
}
