import React from 'react';
import Icon from '../Icon';
import './ContextMenu.css';

export const ContextMenuAction = ({title, icon, onClick = () => {}}) => (
  <div className="dropdown-item" onClick={onClick}>
    <Icon name={icon} className="align-middle mr-2" />
    <span className="align-middle">{title}</span>
  </div>
);
export const ContextMenuUploadAction = ({title, onClick = () => {}}) => (
  <div className="dropdown-item" onClick={onClick}>
    <label className="m-0">
      <Icon name="photo" className="align-middle mr-2" />
      <span className="align-middle">{title}</span>
      <input
        accept="image/png, image/jpeg"
        type="file"
        className="d-none"
        onChange={() => {}}
      />
    </label>
  </div>
);
export default ({title = '', className, children, style}) => (
  <div className={'ContextMenu dropdown ' + className || ''} style={style}>
    <div className="dropdown-toggle" data-toggle="dropdown">
      <Icon name="more_vert" className="align-middle" />
      <span className="align-middle">{title}</span>
    </div>
    <div className="dropdown-menu dropdown-menu-right">{children}</div>
  </div>
);
