import React from 'react';
import {connect} from 'react-redux';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../../redux/shortlist.reducer';
import Icon from '../../base/Icon';
import Button from '../../base/Button';
import T from '../../base/T';
import PropTypes from 'prop-types';

import './BookmarkButton.css';

export class BookmarkButton extends React.PureComponent {
  render() {
    // TODO store elements in a map in short list for faster look up
    const remembered = this.props.shortListState.elements.reduce((map, e) => {
      map[e.book.pid] = e;
      return map;
    }, {});
    const marked = remembered[this.props.work.book.pid];
    let layout = this.props.layout;
    const size = this.props.size || 'default';
    if (layout === 'teardrop') {
      layout = 'BookmarkButtonCircle BookmarkButtonTeardrop';
    } else if (layout === 'circle') {
      layout = 'BookmarkButtonCircle';
    }

    return (
      <Button
        className={
          'BookmarkButton ' +
          layout +
          (marked ? ' marked' : '') +
          (' BookmarkButton-size-' + size) +
          ' ' +
          this.props.className
        }
        style={this.props.style}
        onClick={e => {
          // Prevent opening workpreview on bookmark click
          e.preventDefault();
          e.stopPropagation();
          this.props.toggle(this.props.origin, this.props.work);
        }}
        type="quinary"
        size="medium"
        dataCy={this.props.dataCy}
        onTouchStart={() => {}}
      >
        <Icon name="&#xe867;" />
        {!layout ? (
          <span className="ml-1">
            <T component="shortlist" name="buttonLabel" />
          </span>
        ) : (
          ''
        )}
      </Button>
    );
  }
}
BookmarkButton.propTypes = {
  size: PropTypes.oneOf(['default', 'large'])
};

const mapStateToProps = state => {
  return {
    shortListState: state.shortListReducer
  };
};
export const mapDispatchToProps = (dispatch, ownProps) => ({
  toggle: (origin, element) =>
    dispatch({
      type: ON_SHORTLIST_TOGGLE_ELEMENT,
      element,
      origin,
      rid: ownProps.rid
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkButton);
