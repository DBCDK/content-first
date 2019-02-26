import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {isEqual} from 'lodash';
import {filtersMapAll} from '../../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import {
  isRange,
  getFullRange,
  isSameRange,
  isFullRange,
  getSelectedRange
} from '../../../utils/taxonomy';

/**
 * A HOC that enhance the wrapped component with a list of tags (pids, creators, tags)
 * based on the 'tags' query paramter from the browser address bar.
 *
 *
 * @param {React.Component} WrappedComponent The component to be enhanced
 * @returns {React.Component} The enhanced component
 *
 * @example
 * // create a pure component and enhance it
 * const Tags = ({tags}) => <div>{tags.map(t => <div>t.type</div>)}</div>;
 * export default withTagsFromUrl(Tags)
 *
 * @example
 * When the address bar contains: '?tags=Rowan%20Williams,870970-basis:27073298,1234'
 * It will generate the following 'tags' prop:
 * [
 *   {
 *    "type": "QUERY",
 *     "query": "Rowan Williams"
 *   },
 *   {
 *     "type": "TITLE",
 *     "pid": "870970-basis:27073298"
 *   },
 *   {
 *     "type": "TAG",
 *     "id": 1234,
 *     "title": "gættelege",
 *   }
 * ]
 * Furthermore it generates a 'tagsMap' prop, which may be used for fast lookups.
 * {
 *  "Rowan Williams": {
 *    "type": "QUERY",
 *     "query": "Rowan Williams"
 *   }
 * }
 *
 *
 */
const withTagsFromUrl = WrappedComponent => {
  const Wrapped = class extends React.Component {
    toggleSelected = tag => {
      const modified = toggleTag(this.props.tags, this.props.filterCards, tag);
      this.props.updateUrl(modified);
    };
    isSelected = tag => {
      return !!this.props.tagsMap[tag];
    };
    render() {
      return (
        <WrappedComponent
          {...this.props}
          toggleSelected={this.toggleSelected}
          isSelected={this.isSelected}
        />
      );
    }
  };

  const mapStateToProps = state => {
    const {tags, tagsMap} = tagsFromUrlSelector(state);
    return {
      tags,
      tagsMap,
      filterCards: state.filtercardReducer
    };
  };
  const mapDispatchToProps = (dispatch, ownProps) => ({
    updateUrl: tags => {
      dispatch({
        type: HISTORY_REPLACE,
        path: '/find',
        params: {
          tagss: tags
            .map(t => (Array.isArray(t) ? t.join(':') : encodeURIComponent(t)))
            .join(',')
        }
      });
    }
  });
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withTagsFromUrl;

const tagsFromUrlSelector = createSelector(
  [state => state.routerReducer.params.tagss, state => state.filtercardReducer],
  (tags, filterCards) => {
    const expandedTags = tagsFromURL(tags && tags[0], filterCards);
    const tagsMap = {};
    expandedTags.forEach(expanded => {
      tagsMap[expanded.match] = expanded;
    });
    return {tags: expandedTags, tagsMap};
  }
);

export const tagsFromURL = (urlTags, filterCards) => {
  if (!urlTags) {
    return [];
  }
  if (!Array.isArray(urlTags)) {
    urlTags = [urlTags];
  }
  return urlTags
    .map(tag => {
      const decoded = decodeURIComponent(tag);
      if (isPid(decoded)) {
        return {type: 'TITLE', pid: decoded, match: decoded};
      } else if (isTagRange(decoded)) {
        let [left, right] = decoded.split(':');
        left = filtersMapAll[parseInt(left, 10)];
        right = filtersMapAll[parseInt(right, 10)];
        const fullRange = getFullRange(left.id, filterCards, filtersMapAll);
        const inRange = fullRange.slice(
          fullRange.indexOf(left.id),
          fullRange.indexOf(right.id) + 1
        );
        return {
          type: 'TAG_RANGE',
          left,
          right,
          match: [left.id, right.id],
          inRange,
          fullRange
        };
      }
      const parsedAsInt = parseInt(decoded, 10);
      const tagObj = filtersMapAll[parseInt(decoded, 10)];
      if (tagObj) {
        return {...tagObj, type: 'TAG', match: parsedAsInt};
      }
      return {
        type: 'QUERY',
        query: decoded,
        match: decoded
      };
    })
    .filter(t => t);
};

export const toggleTag = (expandedTags, filterCards, tag) => {
  const isRangeTag = getFullRange(tag, filterCards, filtersMapAll);
  if (isRangeTag) {
    let add = true;
    const nextTags = expandedTags.map(s => {
      if (
        s.type === 'TAG_RANGE' &&
        (s.fullRange.includes(tag) || s.fullRange.includes(tag[0]))
      ) {
        /* tag is part of this range */
        add = false;
        if (isFullRange(tag, s.fullRange) || isEqual(s.match, tag)) {
          /* delete when tag is the full range or an exact match to already selected */
          return null;
        } else {
          if (typeof tag === 'number') {
            /* Update range */
            const prevSelectedRange = [s.left.id, s.right.id];
            const newSelectedRange = getSelectedRange(
              tag,
              prevSelectedRange,
              s.fullRange
            );
            return newSelectedRange;
          } else {
            /* Replace range */
            return tag;
          }
        }
      }
      return s.match;
    });

    if (add) {
      nextTags.push(tag);
    }
    return nextTags.filter(t => t);
  } else {
    const nextTags = expandedTags.map(s => s.match).filter(s => s !== tag);
    if (nextTags.length === expandedTags.length) {
      // nothing removed, add
      nextTags.push(tag);
    }
    return nextTags;
  }
};

const isPid = id => {
  return /.+-.+:.+/.test(id);
};
const isTagRange = id => {
  return /\d+:\d+/.test(id);
};
