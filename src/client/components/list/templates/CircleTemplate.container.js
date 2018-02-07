import React from 'react';
import {connect} from 'react-redux';
import {getListById} from '../../../redux/list.reducer';
import BookCover from '../../general/BookCover.component';
import ProfileImage from '../../general/ProfileImage.component';
import {Comments, Likes, Share} from '../../general/Icons';

// const CIRCLE_HEIGHT = 1100;
const CIRCLE_WIDTH_PERCENTAGE = 0.9; // percentage of parent width
const CIRCLE_OFFSET = 45; // Offset in degrees (0-360) relative to center top of circle, at which first element occurs.
// const ELEMENT_HEIGHT = 180;
const ELEMENT_WIDTH = 140;

export class CircleTemplate extends React.Component {
  constructor() {
    super();
    this.state = {circleWidth: 0};
  }
  calcCoords(degree, coverHeight) {
    degree = Math.PI * degree / 180; // convert to radians.
    const radiusX = this.state.circleWidth / 2 - ELEMENT_WIDTH / 2;
    // const radiusY = CIRCLE_HEIGHT / 2 - ELEMENT_HEIGHT / 2;
    const radiusY = this.state.circleWidth / 2 - (coverHeight + 20) / 2;
    return {
      x: radiusX + radiusX * Math.cos(degree),
      y: radiusY + radiusY * Math.sin(degree)
    };
  }
  onResize = () => {
    this.setState({circleWidth: this.refs.wrapper.clientWidth * CIRCLE_WIDTH_PERCENTAGE});
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
        <div className="list-title text-left col-xs-offset-1 mb2 mt4">{this.props.list && this.props.list.data.title}</div>
        <div className="list col-xs-12">
          <img className="background-image" alt="" src="http://www.totalqualityphoto.com/images/700_Eldorado_Canyon_Fall_Colors_2382rw.jpg" />
          <div style={{width: this.state.circleWidth, height: this.state.circleWidth, margin: '0 auto', position: 'relative'}}>
            {this.props.list &&
              this.props.list.data.list.map((element, idx) => {
                const incrementBy = 360 / this.props.list.data.list.length;
                const coverHeight = this.state.circleWidth * 0.15;
                const {x, y} = this.calcCoords(idx * incrementBy + CIRCLE_OFFSET - 90, coverHeight);
                return (
                  <div key={element.book.pid} style={{top: y, left: x}} className="list-element">
                    <BookCover style={{height: coverHeight}} book={element.book} />
                    <div className="title">{element.book.title}</div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-xs-12 text-left mt4 mb4">
          <div className="col-xs-2 text-center">
            <ProfileImage src={profile.src} name={profile.name} />
          </div>
          <div className="list-description col-xs-5">{this.props.list && this.props.list.data.description}</div>
          <div className="social col-xs-5 col-md-4 text-right">
            <Likes value={14} />
            <span className="ml1">Like</span>
            <Comments className="ml2" />
            <span className="ml1">Kommentér</span>
            <Share className="ml2" />
            <span className="ml1">Del</span>
          </div>
        </div>
        <div className="comments" />
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
