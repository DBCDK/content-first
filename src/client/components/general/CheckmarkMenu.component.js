import React from 'react';

export const MenuItem = (props) => (
  <div className={`list-group-item menu-item${props.checked ? ' checked' : ''}`} onClick={props.onClick}>
    {props.text && <span className="menu-item-text">{props.text}</span>}
    {props.checked && <span className="glyphicon glyphicon-ok"/>}
  </div>
);

export default class CheckmarkMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }
  render() {
    return (
      <div className="checkmark-menu" tabIndex="1" onBlur={() => this.setState({expanded: false})}>
        <div>
          <span className={`checkmark-menu--expand-btn${this.props.checked ? ' checked' : ''}`}>
            <span className="btn btn-default" onClick={this.props.onClick}>
              {this.props.text}
              {this.props.checked && <span className="glyphicon glyphicon-ok"/>}
            </span>
            <span className="btn btn-default" onClick={() => {
              this.setState({expanded: !this.state.expanded});
            }}>
              <span className="glyphicon glyphicon-option-vertical"/>
            </span>
          </span>
        </div>
        <div className="checkmark-menu--content list-group">
          {this.state.expanded && this.props.children}
        </div>
      </div>
    );
  }
}
