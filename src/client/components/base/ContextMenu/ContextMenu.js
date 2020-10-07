import React from 'react';
import Icon from '../Icon';
import './ContextMenu.css';

export const ContextMenuAction = ({
  title,
  icon,
  onClick = () => {},
  ...props
}) => (
  <div
    className="dropdown-item"
    onClick={onClick}
    data-cy={props['data-cy'] || 'context-menu-action'}
  >
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

export default class ContextMenu extends React.Component {
  componentDidMount() {
    document.addEventListener('mouseup', this.hideDropdown);
    document.addEventListener('scroll', this.dropdownDirection);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.hideDropdown);
    window.removeEventListener('scroll', this.dropdownDirection);
  }

  showDropdown = () => {
    if (this.dropdown) {
      this.dropdown.classList.add('show');
    }
  };

  hideDropdown = () => {
    if (this.dropdown) {
      this.dropdown.classList.remove('show');
    }
  };

  dropdownDirection = () => {
    if (this.dropdown && this.button) {
      const oButton = this.button.getBoundingClientRect();
      const dropdown = this.dropdown.getBoundingClientRect();
      const bottomSpace = window.innerHeight - oButton.bottom;
      const offset = 50;

      if (dropdown.height + offset < bottomSpace) {
        this.dropdown.classList.add('drop-down');
        this.dropdown.classList.remove('drop-up');
      } else {
        this.dropdown.classList.add('drop-up');
        this.dropdown.classList.remove('drop-down');
      }
    }
  };

  render() {
    const {
      title = '',
      className = '',
      children,
      style,
      dataCy,
      ...props
    } = this.props;

    return (
      <div
        className={'ContextMenu ' + className}
        style={style}
        data-cy={dataCy || props['data-cy']}
      >
        <div
          className="dropdown-toggle"
          ref={e => (this.button = e)}
          onClick={() => {
            this.dropdownDirection();
            this.showDropdown();
          }}
        >
          <Icon
            name="more_vert"
            aria-label="Rediger"
            tabindex="0"
            className="align-middle"
            role="button"
          />
          {title && <span className="align-middle ml-2">{title}</span>}
        </div>
        <div ref={e => (this.dropdown = e)} className="dropdown dropdown-right">
          {children}
        </div>
      </div>
    );
  }
}
