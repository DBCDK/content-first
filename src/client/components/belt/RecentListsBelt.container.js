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
                  return <ListCard key={l.data.id} list={l} />;
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
    recent: getPublicLists(state.listReducer)
  };
};
export default connect(mapStateToProps)(RecentListsBelt);
