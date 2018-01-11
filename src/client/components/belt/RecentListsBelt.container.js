import React from 'react';
import {connect} from 'react-redux';
import ListViewSmall from '../list/ListViewSmall.component';
import Slider from './Slider.component';

export class RecentListsBelt extends React.Component {
  render() {
    return (
      <div className="row belt text-left">
        <div className="col-xs-12 header">
          <span className="belt-title">Seneste lister fra brugerne</span>
        </div>
        {this.props.recent && (
          <div className="col-xs-12">
            <Slider>
              {this.props.recent.map(l => {
                return <ListViewSmall key={l.id} list={l} />;
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
    recent: state.listReducer.recent
  };
};
export default connect(mapStateToProps)(RecentListsBelt);
