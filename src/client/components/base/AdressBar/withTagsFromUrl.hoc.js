import React from 'react';
import {connect} from 'react-redux';
import {filtersMapAll} from '../../../redux/filter.reducer';
import {HISTORY_REPLACE} from '../../../redux/middleware';

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
 *
 */
const withTagsFromUrl = WrappedComponent => {
  const Wrapped = class extends React.Component {
    toggleSelected = tag => {
      const expanded = tagsFromURL(this.props.tags && this.props.tags[0]);
      const modified = toggleTag(expanded, tag);
      this.props.updateUrl(modified);
    };
    render() {
      const tags = tagsFromURL(this.props.tags && this.props.tags[0]);
      console.log(JSON.stringify(tags, null, 2));
      return (
        <WrappedComponent
          {...this.props}
          tags={tags}
          toggleSelected={this.toggleSelected}
        />
      );
    }
  };

  const mapStateToProps = state => {
    return {
      tags: state.routerReducer.params.tagss
    };
  };
  const mapDispatchToProps = (dispatch, ownProps) => ({
    updateUrl: tags => {
      dispatch({
        type: HISTORY_REPLACE,
        path: '/find',
        params: {tagss: tags.map(t => encodeURIComponent(t)).join(',')}
      });
    }
  });
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapped);
};

export default withTagsFromUrl;

export const tagsFromURL = urlTags => {
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
      }
      const tagObj = filtersMapAll[parseInt(decoded, 10)];
      if (tagObj) {
        return {...tagObj, type: 'TAG', match: decoded};
      }
      return {
        type: 'QUERY',
        query: decoded,
        match: decoded
      };
    })
    .filter(t => t);
};

export const toggleTag = (expandedTags, tag) => {
  const tags = expandedTags.map(s => s.match);
  const nextTags = tags.filter(s => s !== tag);
  if (nextTags.length === tags.length) {
    // nothing removed, add
    nextTags.push(tag);
  }
  return nextTags;
};

const isPid = id => {
  return /.+-.+:.+/.test(id);
};
