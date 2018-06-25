import React from 'react';
import {connect} from 'react-redux';
import ListCard from '../list/ListCard.component';
import Heading from '../base/Heading';
import Slider from './Slider.component';
import {getPublicLists} from '../../redux/list.reducer';

export class RecentListsBelt extends React.Component {
  render() {
    let skeletons = [];
    if (this.props.recent && this.props.recent.length === 0) {
      for (let i = 0; i < 20; i++) {
        skeletons.push(<ListCard style={{width: '250px'}} key={i} list={{}} />);
      }
    }

    return (
      <div className="row belt text-left">
        <div className="row header">
          <Heading
            className="inline pr2 pb0 pt0 pb-sm-1 pt-sm-1 ml1 mr1 mb0"
            Tag="h1"
            type="section"
          >
            <strong>Ugens</strong> Lister
          </Heading>
        </div>
        {this.props.recent &&
          this.props.recent.length === 0 && (
            <div className="row mb4 mt2">
              <Slider>{skeletons}</Slider>
            </div>
          )}
        {this.props.recent && (
          <div className="row mb4 mt2">
            <Slider>
              {this.props.recent.map(l => {
                return (
                  <ListCard
                    key={l.id}
                    list={l}
                    profile={this.props.profiles[l.owner]}
                  />
                );
              })}
            </Slider>
          </div>
        )}
      </div>
    );
  }
}
export const mapStateToProps = state => {
  return {
    recent: getPublicLists(state.listReducer),
    profiles: state.users.toJS()
  };
};
export default connect(mapStateToProps)(RecentListsBelt);
