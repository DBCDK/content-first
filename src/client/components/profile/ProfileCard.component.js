import React from 'react';
import ProfileTooltip from './ProfileTooltip.component';
import Checkmark from '../svg/Checkmark';
import Info from '../svg/Info.svg';

export default class BeltElement extends React.Component {
  constructor() {
    super();
    this.state = {
      showTooltip: false
    };
  }
  toggleTooltip(e) {
    e.stopPropagation();
    this.setState({showTooltip: !this.state.showTooltip});
  }

  render() {
    const {
      element,
      isSelected,
      onAddElement,
      onRemoveElement,
      selectionType = 'border'
    } = this.props;
    return (
      <div
        className={`card ${selectionType}-select ${
          isSelected ? 'is-selected' : ''
        }`}
        onMouseLeave={() => this.setState({showTooltip: false})}
        onClick={() =>
          isSelected ? onRemoveElement(element) : onAddElement(element)
        }
      >
        <div className="card-container">
          <div className="card-background">
            <img src={element.image} alt={element.label} />
          </div>
          {this.props.children && (
            <span className="card-info" onClick={e => this.toggleTooltip(e)}>
              <Info />
            </span>
          )}
          <span className="card-checkmark">
            <Checkmark />
          </span>
          <span className="card-label raleway">{element.label}</span>
        </div>
        {this.props.children && (
          <ProfileTooltip isVisible={this.state.showTooltip}>
            {this.props.children}
          </ProfileTooltip>
        )}
      </div>
    );
  }
}
