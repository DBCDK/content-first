import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {isEqual, flatten} from 'lodash';
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
      let plusStrArr = formatArr(this.props.plus);
      let minusStrArr = formatArr(this.props.minus);

      let objArrs = getPlusMinusArrays(tag, plusStrArr, minusStrArr);
      let tagArr = this.props.tags.map(t => {
        if (typeof t.match === 'object') {
          return t.match.toString().replace(',', ':');
        }
        return t.match.toString();
      });
      this.props.updateUrl(
        tagArr,
        objArrs.plusArr,
        objArrs.minusArr,
        this.props.types
      );
    };

    removeTag = tag => {
      if (this.isSelected(tag)) {
        let plusStrArr = formatArr(this.props.plus);
        let minusStrArr = formatArr(this.props.minus);
        let objArrs = getPlusMinusArrays(tag, plusStrArr, minusStrArr, true);

        const modified = removeTag(this.props.tags, tag);
        this.props.updateUrl(
          modified,
          objArrs.plusArr,
          objArrs.minusArr,
          this.props.types
        );
      }
    };

    addTag = tag => {
      if (!this.isSelected(tag)) {
        let plusStrArr = formatArr(this.props.plus);
        let minusStrArr = formatArr(this.props.minus);
        let objArrs = getPlusMinusArrays(tag, plusStrArr, minusStrArr, true);
        const modified = addTag(this.props.tags, this.props.filterCards, tag);
        this.props.updateUrl(
          modified,
          objArrs.plusArr,
          objArrs.minusArr,
          this.props.types
        );
      }
    };

    updateType = type => {
      const {tags, plus = '', minus = ''} = this.getUrlVars();
      let sendTags = tags === '' ? [] : [decodeURIComponent(tags)];
      let sendPlus = plus === '' ? [] : [decodeURIComponent(plus)];
      let sendMinus = minus === '' ? [] : [decodeURIComponent(minus)];
      if (tags) {
        this.props.updateUrl(sendTags, sendPlus, sendMinus, type);
      }
    };
    getUrlVars = () => {
      var vars = {};
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
        m,
        key,
        value
      ) {
        vars[key] = value;
      });
      return vars;
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
          updateType={this.updateType}
        />
      );
    }
  };
  const mapStateToProps = state => {
    const {tags, tagsMap, plus, minus, types} = tagsFromUrlSelector(state);
    return {
      tags,
      plus,
      minus,
      tagsMap,
      types,
      isPremium: state.userReducer.isPremium,
      filterCards: state.filtercardReducer,
      filters: state.filterReducer.filters
    };
  };
  const mapDispatchToProps = dispatch => ({
    updateUrl: (tags, plus = [], minus = [], types) => {
      let params = {};
      if (tags.length > 0) {
        params.tags = tags
          .map(t => (Array.isArray(t) ? t.join(':') : encodeURIComponent(t)))
          .join(',');
      }
      if (plus.length > 0) {
        params.plus = plus
          .map(p => (Array.isArray(p) ? p.join(':') : encodeURIComponent(p)))
          .join(',');
      }
      if (minus.length > 0) {
        params.minus = minus
          .map(m => (Array.isArray(m) ? m.join(':') : encodeURIComponent(m)))
          .join(',');
      }
      if (tags.length > 0 && types) {
        params.types = types;
      }
      dispatch({
        type: HISTORY_REPLACE,
        path: '',
        params: params
      });
    },
    updateType: (path, type) => {
      let params = {};
      params.types = type;
      dispatch({
        type: HISTORY_REPLACE,
        path: path,
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

const formatArr = allEl => {
  return flatten(allEl).map(el => el.toString());
};

export const getReqState = (s, plus, minus) => {
  let res = 'none';
  if (plus.includes(s.id)) {
    res = 'underline';
  } else if (minus.includes(s.id)) {
    res = 'line-through';
  }
  return res;
};

export const getPlusMinusArrays = (
  tag,
  plusStrArr,
  minusStrArr,
  remove = false
) => {
  let retObj = {};

  let strTag = tag.toString();
  let isPlus = plusStrArr.includes(strTag);
  let isMinus = minusStrArr.includes(strTag);
  let retMinusArr = minusStrArr.filter(p => p !== strTag);
  let retPlusArr = plusStrArr.filter(p => p !== strTag);

  if (!remove) {
    if (isPlus) {
      retMinusArr.push(strTag);
    }
    if (!isPlus && !isMinus) {
      retPlusArr.push(strTag);
    }
  } else {
    retMinusArr.filter(p => p !== strTag);
    retPlusArr.filter(p => p !== strTag);
  }

  retObj.plusArr = retPlusArr;
  retObj.minusArr = retMinusArr;

  return retObj;
};

const tagsFromUrlSelector = createSelector(
  [
    state => state.routerReducer.params.tags,
    state => state.routerReducer.params.plus,
    state => state.routerReducer.params.minus,
    state => state.routerReducer.params.types,
    state => state.filtercardReducer
  ],
  (tags, plus, minus, types, filterCards) => {
    const expandedTags = tagsFromURL(tags && tags[0], filterCards);
    plus = Array.isArray(plus) ? flatten(plus).map(el => parseInt(el, 10)) : [];
    minus = Array.isArray(minus)
      ? flatten(minus).map(el => parseInt(el, 10))
      : [];

    const tagsMap = {};
    expandedTags.forEach(expanded => {
      tagsMap[expanded.match] = expanded;
    });
    let typeStr;
    if (types) {
      typeStr = types.toString();
    }
    return {
      tags: expandedTags,
      plus: plus,
      minus: minus,
      tagsMap,
      types: typeStr
    };
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
