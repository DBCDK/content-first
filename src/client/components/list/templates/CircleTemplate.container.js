import React from 'react';
import {getListById} from '../../../redux/list.reducer';
import BookCover from '../../general/BookCover.component';
import PopOver from '../../general/PopOver.component';
import SimpleList from './SimpleList.component';
import ProfileImage from '../../general/ProfileImage.component';
import CheckmarkConnected from '../../general/CheckmarkConnected.component';

const BACKGROUND_IMAGE_WIDTH = 1200;
const BACKGROUND_IMAGE_HEIGHT_PERCENTAGE = 0.85; // percentage of width
const BACKGROUND_IMAGE_MAX_HEIGHT = 800;
const CIRCLE_WIDTH_PERCENTAGE = 0.95; // percentage of parent width
const CIRCLE_MAX_WIDTH = 900;
const POPOVER_WIDTH = 300;

export default class CircleTemplate extends React.Component {
  constructor() {
    super();
    this.state = {clientWidth: 0, popOverPid: null};
  }
  calcCoords(degree, elementWidth, elementHeight, circleWidth, circleHeight) {
    degree = Math.PI * degree / 180; // convert to radians.
    const radiusX = circleWidth / 2 - elementWidth / 2;
    const radiusY = circleHeight / 2 - elementHeight / 2;
    return {
      x: radiusX + radiusX * Math.cos(degree),
      y: radiusY + radiusY * Math.sin(degree)
    };
  }
  onResize = () => {
    this.setState({
      clientWidth: this.refs.wrapper.clientWidth
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
    const {list} = this.props;
    const profile = {
      name: 'LæseLotte',
      src: 'http://p-hold.com/200/200',
      description: 'This is a dummy profile. Profiles needs to be implemented'
    };

    if (!list) {
      return null;
    }
    const backgroundImageHeight = Math.min(
      this.state.clientWidth * BACKGROUND_IMAGE_HEIGHT_PERCENTAGE,
      BACKGROUND_IMAGE_MAX_HEIGHT
    );
    const incrementBy = 360 / list.data.list.length;
    const circleOffset = incrementBy / 2;
    const circleWidth = Math.min(
      this.state.clientWidth * CIRCLE_WIDTH_PERCENTAGE,
      CIRCLE_MAX_WIDTH
    );
    const circleHeight = backgroundImageHeight * 0.95;
    const rows = list.data.list.length / 1.5;
    const coverHeight = circleHeight / rows;
    const elementWidth = circleWidth / rows;
    const hideLabels = elementWidth < 120;
    return (
      <div className="circle-template row">
        <div
          ref="wrapper"
          className="list col-xs-12"
          style={{height: backgroundImageHeight}}
        >
          <img
            className="background-image cover"
            alt=""
            src={`/v1/image/${
              list.data.image
            }/${BACKGROUND_IMAGE_WIDTH}/${BACKGROUND_IMAGE_WIDTH *
              BACKGROUND_IMAGE_HEIGHT_PERCENTAGE}`}
          />
          <div
            style={{
              width: circleWidth,
              height: circleHeight,
              margin: '0 auto',
              position: 'relative'
            }}
          >
            {list &&
              list.data.list.map((element, idx) => {
                const degree = idx * incrementBy;
                const {x, y} = this.calcCoords(
                  degree + circleOffset - 90,
                  elementWidth,
                  coverHeight + 60,
                  circleWidth,
                  circleHeight
                );
                console.log(degree);
                const popOverPos =
                  degree < 180 ? -POPOVER_WIDTH + 40 : elementWidth - 15;
                return (
                  <div
                    key={element.book.pid}
                    style={{top: y, left: x, width: elementWidth}}
                    className="list-element text-center"
                    onClick={() => {
                      this.setState({
                        popOverPid:
                          this.state.popOverPid === element.book.pid
                            ? null
                            : element.book.pid
                      });
                    }}
                  >
                    <BookCover
                      style={{height: coverHeight}}
                      book={element.book}
                    />
                    {!hideLabels && (
                      <div className="title">{element.book.title}</div>
                    )}
                    <PopOver
                      show={this.state.popOverPid === element.book.pid}
                      style={{left: popOverPos, width: POPOVER_WIDTH}}
                      className={popOverPos < 0 ? 'left' : 'right'}
                    >
                      <h4 className="w-title h-tight">{element.book.title}</h4>
                      <h5 className="w-creator h-tight">
                        {element.book.creator}
                      </h5>
                      <ProfileImage
                        src={profile.src}
                        name={profile.name}
                        type="list"
                        className="mt1 mb1"
                      />
                      <p>{element.description}</p>
                      <hr />
                      <div className="text-right">
                        <CheckmarkConnected
                          book={{book: element.book}}
                          origin={`Fra ${list.data.title} lavet af ${
                            profile.name
                          }`}
                        />
                      </div>
                    </PopOver>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-xs-12 mt4 mb4">
          {list && <SimpleList list={list} profile={profile} />}
        </div>
      </div>
    );
  }
}
