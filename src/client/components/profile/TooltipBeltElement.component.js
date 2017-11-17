import React from 'react';
import '../../style/components/profileBelt.css';
import ProfileTooltip from './ProfileTooltip.component';

export default class TooltipBeltElement extends React.Component {

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
    const {element, isSelected, onAddElement, onRemoveElement} = this.props;
    return (
      <div className={`card card-blue-select scale-1 ${isSelected ? 'is-selected' : ''}`}
        onMouseLeave={() => this.setState({showTooltip: false})}
        onClick={() => isSelected ? onRemoveElement(element) : onAddElement(element)}
      >
        <div className="card-container">
          <div className="card-background">
            <img src={element.image} alt={element.label} />
          </div>
          <span className="card-info" onClick={(e) => this.toggleTooltip(e)} />
          <span className="card-label raleway">{element.label}</span>
        </div>
        <ProfileTooltip isVisible={this.state.showTooltip}>
          {this.props.children}
        </ProfileTooltip>

      </div>
    );
  }
}
