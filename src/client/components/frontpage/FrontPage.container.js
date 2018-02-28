import React from 'react';
import {connect} from 'react-redux';
import Belt from './Belt.component';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import WorkItem from '../work/WorkItemConnected.component';
import CreateProfile from '../profile/CreateProfile.component';
import {ON_TAG_TOGGLE} from '../../redux/belts.reducer';
import {ON_RESET_FILTERS} from '../../redux/filter.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';
import Slider from '../belt/Slider.component';
import {RECOMMEND_REQUEST} from '../../redux/recommend';
import {getRecommendedBooks} from '../../redux/selectors';
import {filtersMap} from '../../redux/filter.reducer';

class FrontPage extends React.Component {
  componentDidMount() {
    // Fetch works for each belt
    this.props.belts.forEach(belt => {
      if (belt.onFrontPage) {
        this.props.fetchBelt(belt, this.props.getBeltTagIdList(belt));
      }
    });
    if (window.$) {
      window.$('[data-toggle="tooltip"]').tooltip();
    }
  }

  componentDidUpdate() {
    if (window.$) {
      window.$('[data-toggle="tooltip"]').tooltip();
    }
  }

  renderBelts() {
    return (
      <div className="belts col-xs-11 col-centered">
        {this.props.belts.map((belt, idx) => {
          if (!belt.onFrontPage) {
            return null;
          }

          const selectedFilters = this.props.getBeltTags(belt.name);
          const links = belt.links.map(beltName => {
            return {
              title: beltName,
              filters: this.props.getBeltTags(beltName)
            };
          });

          const recommendedBooks = this.props.recommendedBooks(
            this.props.getBeltTagIdList(belt)
          );
          return (
            <Belt
              key={idx}
              belt={belt}
              links={links}
              filters={selectedFilters}
              onTagClick={tagId => {
                this.props.tagToggle(tagId, idx);
              }}
              onMoreClick={beltName => {
                this.props.historyPush(beltNameToPath(beltName));
              }}
            >
              {belt.requireLogin && <CreateProfile />}
              {!belt.requireLogin && (
                <div className="row mb4">
                  <div className="col-xs-12">
                    <Slider>
                      {!recommendedBooks.isLoading &&
                        recommendedBooks.books.map(work => (
                          <WorkItem
                            work={work}
                            key={work.book.pid}
                            origin={`Fra "${belt.name}"`}
                          />
                        ))}
                    </Slider>
                  </div>
                </div>
              )}
            </Belt>
          );
        })}
        <RecentListsBelt />
      </div>
    );
  }

  render() {
    return (
      <div className="frontpage">
        <div className="row frontpage-image" />
        <div className="row frontpage-image-credits text-right">
          <a href="https://www.flickr.com/people/fatseth/">Foto ©G Morel</a>
        </div>
        {this.renderBelts()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    belts: state.beltsReducer.belts,
    recommendedBooks: tags => {
      const b = getRecommendedBooks(state, tags, 40);
      return b;
    },
    getBeltTagIdList: belt => state.filterReducer.beltFilters[belt.name],
    getBeltTags: beltName =>
      state.filterReducer.beltFilters[beltName].map(id => filtersMap[id]),
    filterState: state.filterReducer,
    shortListState: state.shortListReducer,
    listState: state.listReducer
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchBelt: (belt, tags) => {
    dispatch({type: ON_RESET_FILTERS, beltName: belt.name});
    dispatch({
      type: RECOMMEND_REQUEST,
      tags,
      max: 100 // we ask for many recommendations, since client side filtering may reduce the actual result significantly
    });
  },
  historyPush: (path, params) => {
    dispatch({
      type: HISTORY_PUSH,
      path,
      params
    });
  },
  tagToggle: (tagId, beltId) => dispatch({type: ON_TAG_TOGGLE, tagId, beltId})
});

export default connect(mapStateToProps, mapDispatchToProps)(FrontPage);
