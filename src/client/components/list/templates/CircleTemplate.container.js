import React from 'react';
import {connect} from 'react-redux';
import {getListById} from '../../../redux/list.reducer';
import BookCover from '../../general/BookCover.component';
import PopOver from '../../general/PopOver.component';
import SimpleList from './SimpleList.component';

const CIRCLE_WIDTH_PERCENTAGE = 0.9; // percentage of parent width
const CIRCLE_OFFSET = 90; // Offset in degrees (0-360) relative to center top of circle, at which first element occurs.
const ELEMENT_WIDTH = 140; // width is fixed, height is dynamic based on circle dimensions

export class CircleTemplate extends React.Component {
  constructor() {
    super();
    this.state = {circleWidth: 0, popOverPid: null};
  }
  calcCoords(degree, elementHeight, circleWidth) {
    degree = Math.PI * degree / 180; // convert to radians.
    const radiusX = circleWidth / 2 - ELEMENT_WIDTH / 2;
    const radiusY = circleWidth / 2 - elementHeight / 2;
    return {
      x: radiusX + radiusX * Math.cos(degree),
      y: radiusY + radiusY * Math.sin(degree)
    };
  }
  onResize = () => {
    this.setState({
      circleWidth: this.refs.wrapper.clientWidth * CIRCLE_WIDTH_PERCENTAGE
    });
  };
  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    const profile = {
      name: 'LæseLotte',
      src: 'http://p-hold.com/200/200',
      description: 'This is a dummy profile. Profiles needs to be implemented'
    };

    return (
      <div ref="wrapper" className="circle-template row">
        <div className="list-title text-left col-xs-offset-1 mb2 mt4">
          {this.props.list && this.props.list.data.title}
        </div>
        <div className="list col-xs-12">
          <img
            className="background-image"
            alt=""
            src="http://www.totalqualityphoto.com/images/700_Eldorado_Canyon_Fall_Colors_2382rw.jpg"
          />
          <div
            style={{
              width: this.state.circleWidth,
              height: this.state.circleWidth,
              margin: '0 auto',
              position: 'relative'
            }}
          >
            {this.props.list &&
              this.props.list.data.list.map((element, idx) => {
                const incrementBy = 360 / this.props.list.data.list.length;
                const coverHeight = this.state.circleWidth * 0.15; // element size is calculated based on circle dimensions
                const {x, y} = this.calcCoords(
                  idx * incrementBy + CIRCLE_OFFSET - 90,
                  coverHeight + 20,
                  this.state.circleWidth
                );
                const popOverPos =
                  this.state.circleWidth - x < 300 ? -170 : 120;
                return (
                  <div
                    key={element.book.pid}
                    style={{top: y, left: x}}
                    className="list-element"
                    onClick={() => {
                      this.setState({popOverPid: element.book.pid});
                    }}
                  >
                    <BookCover
                      style={{height: coverHeight}}
                      book={element.book}
                    />
                    <div className="title">{element.book.title}</div>
                    <PopOver
                      show={this.state.popOverPid === element.book.pid}
                      style={{left: popOverPos, width: 200}}
                      className={popOverPos < 0 ? 'left' : 'right'}
                    >
                      <h4>hest</h4>
                    </PopOver>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-xs-12 text-left mt4 mb4">
          <div className="row">
            <div className="col-xs-offset-1 col-xs-8">
              {this.props.list && (
                <SimpleList list={this.props.list} profile={profile} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    list: getListById(state.listReducer, ownProps.id)
  };
};
export default connect(mapStateToProps)(CircleTemplate);
