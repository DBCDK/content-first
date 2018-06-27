import React from 'react';
import {connect} from 'react-redux';
import BookCover from '../general/BookCover.component';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Kryds from '../svg/Kryds.svg';
import LineBehindText from '../general/LineBehindText.component';
import Link from '../general/Link.component';
import {
  ON_SHORTLIST_EXPAND,
  ON_SHORTLIST_COLLAPSE,
  ON_SHORTLIST_REMOVE_ELEMENT
} from '../../redux/shortlist.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';

const SHORT_LIST_MAX_LENGTH = 3;

const ShortListElement = props => {
  const url = `/værk/${props.element.book.pid}`;

  return (
    <div className="short-list-element">
      <div className="short-list-element--cover-image">
        <Link href={url}>
          <BookCover book={props.element.book} />
        </Link>
      </div>
      <div className="short-list-element--text">
        <div className="short-list-element--header">
          <Link href={url}>{props.element.book.title}</Link>
        </div>
        <div className="short-list-element--taxonomy-description">
          {props.element.book.taxonomy_description}
        </div>
        <div className="short-list-element--origin">{props.element.origin}</div>
      </div>
      <img
        src={Kryds}
        alt="luk"
        className="short-list-element--close-btn"
        onClick={props.onClose}
      />
    </div>
  );
};

const ShortListContent = props => {
  const moreCount = props.elements.length - SHORT_LIST_MAX_LENGTH;
  let moreLabel = null;
  if (moreCount > 0) {
    if (moreCount === 1) {
      moreLabel = '1 bog mere på listen';
    } else {
      moreLabel = `${moreCount} bøger mere på listen`;
    }
  }
  return (
    <div
      className={`short-list--content text-left${
        props.expanded ? '' : ' slide-out'
      }`}
    >
      <img
        src={Kryds}
        alt="luk"
        className="short-list--close-btn"
        onClick={props.onClose}
      />
      <div className="short-list--header">HUSKELISTE</div>
      <div className="short-list--empty-text text-center">
        {props.elements.length === 0 && 'Din huskeliste er tom'}
      </div>
      {props.children &&
        props.children.length > 0 && (
          <div className="short-list--elements">
            <ReactCSSTransitionGroup
              transitionName="shortlist"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {props.children}
            </ReactCSSTransitionGroup>
          </div>
        )}
      {moreLabel && (
        <div className="short-list--more-elements">
          <LineBehindText label={moreLabel} backgroundColor="white" />
        </div>
      )}

      <div className="short-list--more-btn text-center">
        <span
          className="btn btn-default text-center"
          onClick={props.onViewShortList}
        >
          SE HELE LISTEN
        </span>
      </div>
    </div>
  );
};

class ShortListDropdown extends React.Component {
  render() {
    const {expanded, elements = []} = this.props.shortListState;

    return (
      <React.Fragment>
        <div
          className={this.props.className + ' short-list'}
          onClick={() => {
            this.props.dispatch({
              type: expanded ? ON_SHORTLIST_COLLAPSE : ON_SHORTLIST_EXPAND
            });
          }}
        >
          {this.props.children}
          <span className="short-badge">{'(' + elements.length + ')'}</span>
        </div>,
        <ShortListContent
          expanded={expanded}
          elements={elements}
          onClose={() => this.props.dispatch({type: ON_SHORTLIST_COLLAPSE})}
          onViewShortList={() => {
            this.props.dispatch({type: HISTORY_PUSH, path: '/huskeliste'});
            this.props.dispatch({type: ON_SHORTLIST_COLLAPSE});
          }}
        >
          {elements &&
            elements.slice(0, SHORT_LIST_MAX_LENGTH).map(element => {
              return (
                <ShortListElement
                  key={element.book.pid}
                  element={element}
                  onClose={() =>
                    this.props.dispatch({
                      type: ON_SHORTLIST_REMOVE_ELEMENT,
                      pid: element.book.pid
                    })
                  }
                />
              );
            })}
        </ShortListContent>
      </React.Fragment>
    );
  }
}
export default connect(
  // Map redux state to props
  state => {
    return {shortListState: state.shortListReducer};
  }
)(ShortListDropdown);
