import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {isEqual} from 'lodash';
import {filtersMapAll} from '../../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';
const {getFullRange} = require('../../../utils/taxonomy');
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
 * {
 * "type": "QUERY",
 * "query": "Rowan Williams"
 * },
 * {
 * "type": "TITLE",
 * "pid": "870970-basis:27073298"
 * },
 * {
 * "type": "TAG",
 * "id": 1234,
 * "title": "gættelege",
 * }
 * ]
 * Furthermore it generates a 'tagsMap' prop, which may be used for fast lookups.
 * {
 * "Rowan Williams": {
 * "type": "QUERY",
 * "query": "Rowan Williams"
 * }
 * }
 *
 *
 */
const withTagsFromUrl = WrappedComponent => {
  const Wrapped = class extends React.Component {
    toggleSelected = tag => {
      if (this.isSelected(tag)) {
        this.removeTag(tag);
      } else {
        this.addTag(tag);
      }
    };
    removeTag = tag => {
      if (this.isSelected(tag)) {
        const modified = removeTag(this.props.tags, tag);
        this.props.updateUrl(modified);
      }
    };
    addTag = tag => {
      if (!this.isSelected(tag)) {
        const modified = addTag(this.props.tags, this.props.filterCards, tag);
        this.props.updateUrl(modified);
      }
    };
    isSelected = tag => {
      return !!this.props.tagsMap[tag];
    };
    getMultiPids = () => {
      let multiPids = [];
      this.props.tags
        .filter(t => t.type === 'TITLES')
        .map(p =>
          p.pid.split(';').forEach((q, i) => {
            if (i !== 0) {
              multiPids.push(q);
            }
          })
        );
      return multiPids;
    };
    render() {
      return (
        <WrappedComponent
          {...this.props}
          toggleSelected={this.toggleSelected}
          isSelected={this.isSelected}
          removeTag={this.removeTag}
          addTag={this.addTag}
          getMultiPids={this.getMultiPids}
        />
      );
    }
  };
  const mapStateToProps = state => {
    const {tags, tagsMap} = tagsFromUrlSelector(state);
    return {
      tags,
      tagsMap,
      filterCards: state.filtercardReducer,
      filters: state.filterReducer.filters
    };
  };
  const mapDispatchToProps = dispatch => ({
    updateUrl: tags => {
      dispatch({
        type: HISTORY_REPLACE,
        path: '/find',
        params:
          tags.length > 0
            ? {
                tags: tags
                  .map(t =>
                    Array.isArray(t) ? t.join(':') : encodeURIComponent(t)
                  )
                  .join(',')
              }
            : {}
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
  [state => state.routerReducer.params.tags, state => state.filtercardReducer],
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
        if (decoded.length > 25) {
          return {type: 'TITLES', pid: decoded, match: decoded};
        }
        return {type: 'TITLE', pid: decoded, match: decoded};
      } else if (isTagRange(decoded)) {
        let [left, right] = decoded.split(':');
        left = filtersMapAll[parseInt(left, 10)];
        right = filtersMapAll[parseInt(right, 10)];
        const fullRange = getFullRange(left.id, filterCards, filtersMapAll);
        const inRange = fullRange
          .slice(fullRange.indexOf(left.id), fullRange.indexOf(right.id) + 1)
          .map(id => filtersMapAll[id]);
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
export const removeTag = (expandedTags, tag) => {
  return expandedTags.filter(t => !isEqual(t.match, tag)).map(t => t.match);
};
export const addTag = (expandedTags, filterCards, tag) => {
  const isRangeTag = getFullRange(tag, filterCards, filtersMapAll);
  if (isRangeTag) {
    let updated = false;
    const res = [];
    expandedTags.forEach(t => {
      if (
        t.type === 'TAG_RANGE' &&
        (t.fullRange.includes(tag) || t.fullRange.includes(tag[0]))
      ) {
        updated = true;
        if (typeof tag === 'number') {
          if (t.fullRange.indexOf(tag) < t.fullRange.indexOf(t.left.id)) {
            res.push([tag, t.right.id]);
          } else if (
            t.fullRange.indexOf(tag) > t.fullRange.indexOf(t.right.id)
          ) {
            res.push([t.left.id, tag]);
          } else {
            res.push(t.match);
          }
        } else {
          res.push(tag);
        }
      } else {
        res.push(t.match);
      }
    });
    if (!updated) {
      if (typeof tag === 'number') {
        res.push([tag, tag]);
      } else {
        res.push(tag);
      }
    }
    return res;
  }
  return [...expandedTags.map(t => t.match), tag];
};
const isPid = id => {
  return /.+-.+:.+/.test(id);
};
const isTagRange = id => {
  return /\d+:\d+/.test(id);
};
