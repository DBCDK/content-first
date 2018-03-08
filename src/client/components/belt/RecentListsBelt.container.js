import React from 'react';
import {connect} from 'react-redux';
import ListCard from '../list/ListCard.component';
import Slider from './Slider.component';
import {getPublicLists} from '../../redux/list.reducer';

export class RecentListsBelt extends React.Component {
  render() {
    return (
      <div className="row belt text-left">
        <div className="col-xs-12 header">
          <span className="belt-title">Seneste lister fra brugerne</span>
        </div>
        {this.props.recent && (
          <div className="row mb4">
            <div className="col-xs-12">
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
