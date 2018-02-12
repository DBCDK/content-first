import React from 'react';
import {connect} from 'react-redux';
import Belt from './Belt.component';
import RecentListsBelt from '../belt/RecentListsBelt.container';
import WorkItem from '../work/WorkItemConnected.component';
import CreateProfile from '../profile/CreateProfile.component';
import {ON_TAG_TOGGLE, ON_BELT_REQUEST} from '../../redux/belts.reducer';
import {ON_RESET_FILTERS} from '../../redux/filter.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';
import Slider from '../belt/Slider.component';
import {getLeaves} from '../../utils/taxonomy';

class FrontPage extends React.Component {
  componentDidMount() {
    // Fetch works for each belt
    this.props.beltsState.belts.forEach(belt => {
      this.props.dispatch({type: ON_RESET_FILTERS, beltName: belt.name});
      if (belt.onFrontPage) {
        this.props.dispatch({type: ON_BELT_REQUEST, beltName: belt.name});
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
        {this.props.beltsState.belts.map((belt, idx) => {
          if (!belt.onFrontPage) {
            return null;
          }

          const allFilters = getLeaves(this.props.filterState.filters);
          const selectedFilters = this.props.filterState.beltFilters[
            belt.name
          ].map(id => allFilters.find(filter => filter.id === id));
          const links = belt.links.map(beltName => {
            return {
              title: beltName,
              filters: this.props.filterState.beltFilters[beltName].map(id =>
                allFilters.find(filter => filter.id === id)
              )
            };
          });

          const remembered = {};
          this.props.shortListState.elements.forEach(e => {
            remembered[e.book.pid] = true;
          });

          return (
            <Belt
              key={idx}
              belt={belt}
              links={links}
              filters={selectedFilters}
              onTagClick={tagId => {
                this.props.dispatch({type: ON_TAG_TOGGLE, tagId, beltId: idx});
              }}
              onMoreClick={beltName => {
                this.props.dispatch({
                  type: HISTORY_PUSH,
                  path: beltNameToPath(beltName)
                });
              }}
            >
              {belt.requireLogin && <CreateProfile />}
              {!belt.requireLogin && (
                <div className="row mb4">
                  <div className="col-xs-12">
                    <Slider>
                      {belt.works &&
                        belt.works.map(work => (
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
export default connect(
  // Map redux state to props
  state => {
    return {
      beltsState: state.beltsReducer,
      filterState: state.filterReducer,
      shortListState: state.shortListReducer,
      listState: state.listReducer,
      profileState: state.profileReducer
    };
  }
)(FrontPage);
