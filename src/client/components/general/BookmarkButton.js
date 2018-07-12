import React from 'react';
import {connect} from 'react-redux';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import Icon from '../base/Icon';
import Button from '../base/Button';

import './BookmarkButton.css';

export class BookmarkButton extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.shortListState !== this.props.shortListState;
  }
  render() {
    // TODO store elements in a map in short list for faster look up
    const remembered = this.props.shortListState.elements.reduce((map, e) => {
      map[e.book.pid] = e;
      return map;
    }, {});
    const marked = remembered[this.props.work.book.pid];
    const layout = this.props.layout === 'circle' ? 'Circle' : '';

    return (
      <Button
        className={
          'BookmarkButton' +
          layout +
          (marked ? ' marked' : '') +
          ' ' +
          this.props.className
        }
        style={this.props.style}
        onClick={() => this.props.toggle(this.props.origin, this.props.work)}
        type="tertiary"
        size="medium"
      >
        <Icon name="bookmark_border" className="md-small" />
        {layout !== 'Circle' ? 'Husk' : ''}
      </Button>
    );
  }
}

const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer
  };
};
export const mapDispatchToProps = dispatch => ({
  toggle: (origin, element) =>
    dispatch({
      type: ON_SHORTLIST_TOGGLE_ELEMENT,
      element,
      origin
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkButton);
