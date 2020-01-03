import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {isEqual} from 'lodash';
import {filtersMapAll} from '../../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';
import {getFullRange} from '../../../utils/taxonomy';

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

    toggleReq = tag => {
      // get state fo plus, minus from props (if neither exist, then add plus)
      console.log('this.props.plus', this.props.plus);

      // match tags, plusTags, MinusTags with the chosen tag
      // if tag===plusTag => remove from PlusTags add to MinusTags
      // if tag===MinusTag => remove from MinusTags add to tags
      // if tag===tag => remove from tags add to PlusTags

      console.log('this.props.filterCards', this.props.filterCards);
      let arrOfUpdtedTags = [];
      this.props.tags.map(t => {
        if (t.match === tag) {
          let tWReqArr = (t.id + '').split('|');
          let justTag = tWReqArr[0];
          let reqState = tWReqArr[1];
          let reqStateArr = ['', 'plus', 'minus'];
          let newTag = justTag;

          arrOfUpdtedTags.push(newTag);
        } else {
          arrOfUpdtedTags.push(t.id);
        }
      });

      //   this.props.updateUrl(arrOfUpdtedTags);
      // console.log('proptag after', newArr);

      // const reqStates = ['can', 'must', 'must-not'];
      //  let newPos = currentPos + 1 > 2 ? 0 : currentPos + 1;

      //  const modified = updateTag(this.props.tags, this.props.filterCards, tag);
      // this.props.updateUrl(modified);
      //   return newPos;
    };

    removeTag = tag => {
      if (this.isSelected(tag)) {
        console.log('this.props.tags', this.props.tags);
        const modified = removeTag(this.props.tags, tag);
        console.log('modified', modified);
        this.props.updateUrl(modified);
      }
    };
    addTag = tag => {
      if (!this.isSelected(tag)) {
        console.log('this.props.tags', this.props.tags);
        const modified = addTag(this.props.tags, this.props.filterCards, tag);
        console.log('modified', modified);
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
    flattenedTags = () =>
      this.props.tags.reduce((arr, tag) => {
        if (tag.type === 'TAG') {
          return [...arr, tag];
        } else if (tag.type === 'TAG_RANGE') {
          return [...arr, ...tag.inRange];
        }
        return arr;
      }, []);

    render() {
      return (
        <WrappedComponent
          {...this.props}
          toggleSelected={this.toggleSelected}
          isSelected={this.isSelected}
          removeTag={this.removeTag}
          toggleReq={this.toggleReq}
          addTag={this.addTag}
          getMultiPids={this.getMultiPids}
          flattenedTags={this.flattenedTags}
        />
      );
    }
  };
  const mapStateToProps = state => {
    const {tags, plus, tagsMap} = tagsFromUrlSelector(state);

    return {
      tags,
      plus,
      tagsMap,
      filterCards: state.filtercardReducer,
      filters: state.filterReducer.filters
    };
  };
  const mapDispatchToProps = dispatch => ({
    updateUrl: (tags, plus = [], minus = []) => {
      console.log('dipatch plus', plus);
      let params = {};
      if (tags.length > 0) {
        console.log('tags', tags);
        params.tags = tags
          .map(t => (Array.isArray(t) ? t.join(':') : encodeURIComponent(t)))
          .join(',');
      }
      console.log('plus', plus);
      params.plus = ['1234,2345'];

      if (minus.length > 0) {
        params.minus = minus;
      }
      console.log('params', params);
      dispatch({
        type: HISTORY_REPLACE,
        path: '',
        params: params
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
  [
    state => state.routerReducer.params.tags,
    state => state.routerReducer.params.plus,
    state => state.filtercardReducer
  ],
  (tags, plus, filterCards) => {
    const expandedTags = tagsFromURL(tags && tags[0], filterCards);
    const tagsMap = {};
    expandedTags.forEach(expanded => {
      tagsMap[expanded.match] = expanded;
    });

    return {tags: expandedTags, plus: plus, tagsMap};
  }
);

export const tagsFromURL = (urlTags, filterCards) => {
  if (!urlTags) {
    return [];
  }
  if (!Array.isArray(urlTags)) {
    urlTags = [urlTags];
  }
  let retvar = urlTags
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
  return retvar;
};

export const removeTag = (expandedTags, tag) => {
  return expandedTags.filter(t => !isEqual(t.match, tag)).map(t => t.match);
};

export const toggleReq = tag => {
  //return expandedTags.filter(t => !isEqual(t.match, tag)).map(t => t.match);
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
