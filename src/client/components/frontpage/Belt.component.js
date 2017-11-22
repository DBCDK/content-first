import React from 'react';
import ScrollableBelt from './ScrollableBelt.component';

export default class Belt extends React.Component {

  constructor() {
    super();
    this.state = {showDetails: false};
  }

  getTooltipText(filters) {
    return filters.length > 0 ? filters.map(filter => {
      return `<span>${filter.title}</span>`;
    }).join(' ') : '<span>Ingen filtre</span>';
  }

  render() {

    // Create the html to go into
    const tooltipText = this.getTooltipText(this.props.filters);

    return (
      <div className='row belt text-left'>
        <div className='col-xs-12 header'>
          <span
            onClick={() => this.props.onMoreClick(this.props.belt.name)}
            className='belt-title'
            data-html='true'
            data-toggle='tooltip'
            data-original-title={tooltipText}>
            {this.props.belt.name}</span>
        </div>
        <div className='col-xs-12 belt-links'>
          {this.props.links.length > 0 && <span>Se også:</span>}
          {this.props.links.map(link => {
            return <span
              key={link.title}
              className='belt-link'
              data-html='true'
              data-toggle='tooltip'
              data-original-title={this.getTooltipText(link.filters)}
              onClick={() => this.props.onMoreClick(link.title)}>
              {link.title}
            </span>;
          })}
        </div>
        {this.props.custom}
        {!this.props.belt.requireLogin && <ScrollableBelt
          works={this.props.belt.works}
          scrollInterval={3}
          onCoverClick={this.props.onCoverClick}
        />}
      </div>
    );
  }
}
