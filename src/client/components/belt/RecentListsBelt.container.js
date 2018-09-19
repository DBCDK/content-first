import React from 'react';
import {connect} from 'react-redux';
import ListCard from '../list/card/ListCard.component';
import Heading from '../base/Heading';
import Slider from './Slider.component';
import {getPublicLists} from '../../redux/list.reducer';

export class RecentListsBelt extends React.Component {
  constructor() {
    super();
    this.state = {didSwipe: false};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.recent.length !== this.props.recent.length ||
      nextState.didSwipe !== this.state.didSwipe ||
      nextProps.profiles !== this.props.profiles
    );
  }

  render() {
    const startIndex = 8;
    let skeletons = [];
    if (this.props.recent && this.props.recent.length === 0) {
      for (let i = 0; i < 20; i++) {
        skeletons.push(
          <ListCard
            skeleton={true}
            style={{width: '250px'}}
            key={i}
            list={{id: i}}
          />
        );
      }
    }

    return (
      <div className=" belt text-left row">
        <div className="p-0 col-12">
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
              <div className=" mb4 mt2">
                <Slider>{skeletons}</Slider>
              </div>
            )}
          {this.props.recent && (
            <div className="row mb4 mt2">
              <Slider
                onSwipe={index => {
                  if (index > 0 && !this.state.didSwipe) {
                    this.setState({didSwipe: true});
                  }
                }}
              >
                {this.props.recent.map((l, i) => {
                  let skeleton = false;
                  if (i > startIndex - 1 && !this.state.didSwipe) {
                    skeleton = true;
                  }
                  return (
                    <ListCard
                      key={i}
                      skeleton={skeleton}
                      list={l}
                      profile={this.props.profiles[l.owner]}
                    />
                  );
                })}
              </Slider>
            </div>
          )}
        </div>
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
