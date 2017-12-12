import React from 'react';
import {connect} from 'react-redux';
import Belt from './Belt.component';
import ScrollableBelt from '../general/ScrollableBelt.component';
import WorkItem from '../work/WorkItem.component';
import CreateProfile from '../profile/CreateProfile.component';
import {ON_TAG_TOGGLE, ON_BELT_REQUEST} from '../../redux/belts.reducer';
import {ON_RESET_FILTERS} from '../../redux/filter.reducer';
import {ON_SHORTLIST_TOGGLE_ELEMENT} from '../../redux/shortlist.reducer';
import {HISTORY_PUSH} from '../../redux/middleware';
import {beltNameToPath} from '../../utils/belt';
import {getLeaves} from '../../utils/filters';
import AddToListModal from '../lists/AddToListModal.component';

class FrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addToList: null
    };
  }

  componentDidMount() {
    // Fetch works for each belt
    this.props.beltsState.belts.forEach(belt => {
      this.props.dispatch({type: ON_RESET_FILTERS, beltName: belt.name});
      if (belt.onFrontPage) {
        this.props.dispatch({type: ON_BELT_REQUEST, beltName: belt.name});
      }
    });
    window.$('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    window.$('[data-toggle="tooltip"]').tooltip();
  }

  renderBelts() {
    return (
      <div className='belts col-xs-11 col-centered'>
        {this.props.beltsState.belts.map((belt, idx) => {
          if (!belt.onFrontPage) {
            return null;
          }

          const allFilters = getLeaves(this.props.filterState.filters);
          const selectedFilters = this.props.filterState.beltFilters[belt.name].map(id => allFilters.find(filter => filter.id === id));
          const links = belt.links.map(beltName => {
            return {
              title: beltName,
              filters: this.props.filterState.beltFilters[beltName].map(id => allFilters.find(filter => filter.id === id))
            };
          });

          const remembered = {};
          this.props.shortListState.elements.forEach(e => {
            remembered[e.book.pid] = true;
          });

          return <Belt
            key={idx}
            belt={belt}
            links={links}
            filters={selectedFilters}
            onTagClick={(tagId) => {
              this.props.dispatch({type: ON_TAG_TOGGLE, tagId, beltId: idx});
            }}
            onMoreClick={(beltName) => {
              this.props.dispatch({type: HISTORY_PUSH, path: beltNameToPath(beltName)});
            }}>
            {belt.requireLogin && <CreateProfile/>}
            {!belt.requireLogin && <ScrollableBelt works={belt.works} scrollInterval={3}>
              {belt.works && belt.works.map((work, workIdx) => {
                return <WorkItem
                  idx={workIdx}
                  id={`work-${workIdx}`}
                  key={work.book.pid}
                  work={work}
                  onCoverClick={(pid) => {
                    this.props.dispatch({type: HISTORY_PUSH, path: `/værk/${pid}`});
                  }}
                  onRememberClick={(element) => {
                    this.props.dispatch({type: ON_SHORTLIST_TOGGLE_ELEMENT, element, origin: `Fra "${belt.name}"`});
                  }}
                  marked={remembered[work.book.pid]}
                  onAddToList={() => this.setState({addToList: work})} />;
              })}
            </ScrollableBelt>}
          </Belt>;
        })}
        <AddToListModal
          show={this.state.addToList}
          work={this.state.addToList}
          onClose={() => this.setState({addToList: null})}
          onDone={(work, comment, list) => {
            console.log(work, comment, list);
            this.setState({addToList: null});
          }} />
      </div>
    );
  }

  render() {
    return (
      <div className='frontpage'>
        <div className='row frontpage-image'/>
        <div className='row frontpage-image-credits text-right'>
          <a href='https://www.flickr.com/people/fatseth/'>Foto ©G Morel</a>
        </div>
        {this.renderBelts()}
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {beltsState: state.beltsReducer, filterState: state.filterReducer, shortListState: state.shortListReducer};
  }
)(FrontPage);
