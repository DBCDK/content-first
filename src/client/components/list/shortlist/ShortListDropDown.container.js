import React from 'react';
import {connect} from 'react-redux';
import TruncateMarkup from 'react-truncate-markup';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  ON_SHORTLIST_EXPAND,
  ON_SHORTLIST_COLLAPSE,
  ON_SHORTLIST_REMOVE_ELEMENT
} from '../../../redux/shortlist.reducer';
import {ON_USERLISTS_COLLAPSE} from '../../../redux/list.reducer';
import {HISTORY_PUSH} from '../../../redux/middleware';
import {ORDER} from '../../../redux/order.reducer';
import BookCover from '../../general/BookCover/BookCover.component';
import Button from '../../base/Button/Button';
import Text from '../../base/Text';
import T from '../../base/T';
import Link from '../../general/Link.component';
import '../overview/dropdownList.css';
import Origin from '../../base/Origin';

const ShortListElement = props => {
  const url = `/værk/${props.element.book.pid}`;

  return (
    <div className="top-bar-dropdown-list-element">
      <div className="top-bar-dropdown-list-element--cover-image">
        <Link href={url}>
          <BookCover book={props.element.book} hideCoverText={true} />
        </Link>
      </div>
      <div className="top-bar-dropdown-list-element--text">
        <div className="top-bar-dropdown-list-element--header">
          <Link href={url}>
            <TruncateMarkup lines={1}>
              <span data-cy="shortlist-element-title">
                {props.element.book.title}
              </span>
            </TruncateMarkup>
          </Link>
        </div>
        <div className="top-bar-dropdown-list-element--taxonomy-description">
          {props.element.book.taxonomy_description}
        </div>
				<div className="top-bar-dropdown-list-element--origin">
					<Origin
						componentData={props.element.origin}
					/>
				</div>
      </div>
      {
        <i onClick={props.onClose} className="material-icons remove-btn">
          clear
        </i>
      }
    </div>
  );
};

const ShortListContent = props => {
  const emptyList = props.elements.length === 0 ? true : false;

  return (
    <div
      className={`top-bar-dropdown-list--content text-left
        ${props.expanded ? '' : ' slide-out'}
        ${emptyList ? ' empty-list' : ''}`}
    >
      <i
        onClick={props.onClose}
        className="material-icons top-bar-dropdown-list--close-btn"
      >
        clear
      </i>
      <Link href="/huskeliste">
        <Text
          type="body"
          variant="color-fersken--weight-semibold--transform-uppercase"
          className="tc"
          style={{marginBottom: '10px'}}
        >
          <T
            component="shortlist"
            name="titleWithBooks"
            vars={[`${props.elements && props.elements.length}`]}
          />
        </Text>
      </Link>
      <div
        className={
          'top-bar-dropdown-list--empty-text text-center ' +
          (emptyList ? '' : 'd-none')
        }
      >
        {emptyList && <T component="shortlist" name="emptyList" />}
      </div>
      {props.children &&
        props.children.length > 0 && (
          <div className="top-bar-dropdown-list--elements">
            <ReactCSSTransitionGroup
              transitionName="shortlist"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {props.children}
            </ReactCSSTransitionGroup>
          </div>
        )}
      <div className="top-bar-dropdown-list--footer">
        <div onClick={props.onViewShortList}>
          <Button
            size="medium"
            type="tertiary"
            dataCy="shortlist-dropdown-visit-shortlist"
          >
            <T component="shortlist" name="shortlistGo" />
          </Button>
        </div>
        <div
          onClick={() => props.elements.length > 0 && props - props.orderAll()}
        >
          <Button size="medium" type="tertiary">
            <T component="shortlist" name="shortlistOrder" />
          </Button>
        </div>
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
          className={this.props.className + ' top-bar-dropdown-list'}
          onClick={() => {
            this.props.dispatch({
              type: expanded ? ON_SHORTLIST_COLLAPSE : ON_SHORTLIST_EXPAND
            });
            if (this.props.listsOverviewExpanded) {
              // collapse listOverview if expanded
              this.props.dispatch({
                type: ON_USERLISTS_COLLAPSE
              });
            }
          }}
          data-cy={this.props.dataCy}
        >
          {this.props.children}
          <span className="short-badge">{'(' + elements.length + ')'}</span>
        </div>
        <ShortListContent
          expanded={expanded}
          elements={elements}
          onClose={() => this.props.dispatch({type: ON_SHORTLIST_COLLAPSE})}
          onViewShortList={() => {
            this.props.dispatch({type: HISTORY_PUSH, path: '/huskeliste'});
            this.props.dispatch({type: ON_SHORTLIST_COLLAPSE});
          }}
          orderAll={() =>
            elements.forEach(book => {
              this.props.dispatch({type: ORDER, book: book.book});
            })
          }
        >
          {elements &&
            elements.map(element => {
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
    return {
      shortListState: state.shortListReducer,
      listsOverviewExpanded: state.listReducer.expanded
    };
  }
)(ShortListDropdown);
