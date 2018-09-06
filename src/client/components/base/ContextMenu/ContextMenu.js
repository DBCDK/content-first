import React from 'react';
import Icon from '../Icon';
import './ContextMenu.css';

export const ContextMenuAction = ({title, icon, onClick = () => {}}) => (
  <div className="dropdown-item" onClick={onClick}>
    <Icon name={icon} className="align-middle mr-2" />
    <span className="align-middle">{title}</span>
  </div>
);
export default ({title = '', className, children}) => (
  <div className={'ContextMenu dropdown ' + className || ''}>
    <div className="dropdown-toggle" data-toggle="dropdown">
      <Icon name="more_vert" className="align-middle" />
      <span className="align-middle">{title}</span>
    </div>
    <div className="dropdown-menu dropdown-menu-right">{children}</div>
  </div>
);
