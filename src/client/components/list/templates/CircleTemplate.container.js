import React from 'react';
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
const ELEMENT_MAX_SIZE = 200; // width or height

export default class CircleTemplate extends React.Component {
  constructor() {
    super();
    this.state = {clientWidth: 0, popOverPid: null};
  }
  calcCoords(degree, elementWidth, elementHeight, circleWidth, circleHeight) {
    degree = (Math.PI * degree) / 180; // convert to radians.
    const radiusX = circleWidth / 2 - elementWidth / 2;
    const radiusY = circleHeight / 2 - elementHeight / 2;
    return {
      x: radiusX + radiusX * Math.cos(degree),
      y: radiusY + radiusY * Math.sin(degree)
    };
  }
  onResize = () => {
    this.setState({
      clientWidth: this.refs.wrapper
        ? this.refs.wrapper.clientWidth
        : BACKGROUND_IMAGE_WIDTH
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
    if (!list) {
      return null;
    }

    const profile = this.props.profile || {};
    const profiles = this.props.profiles || {};

    const backgroundImageHeight = Math.min(
      this.state.clientWidth * BACKGROUND_IMAGE_HEIGHT_PERCENTAGE,
      BACKGROUND_IMAGE_MAX_HEIGHT
    );
    const incrementBy = 360 / list.list.length;
    const circleOffset = incrementBy / 2;
    const circleWidth = Math.min(
      this.state.clientWidth * CIRCLE_WIDTH_PERCENTAGE,
      CIRCLE_MAX_WIDTH
    );
    const circleHeight = backgroundImageHeight * 0.95;
    const rows = list.list.length / 1.5;
    const coverHeight = Math.min(circleHeight / rows, ELEMENT_MAX_SIZE);
    const elementWidth = Math.min(circleWidth / rows, ELEMENT_MAX_SIZE);
    const hideLabels = elementWidth < 120;
    return [
      <div key="circle-template" className="circle-template row b-dark">
        <div
          ref="wrapper"
          className="list col-12"
          style={{height: backgroundImageHeight}}
        >
          <img
            className="background-image cover"
            alt=""
            src={`/v1/image/${
              list.image
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
              list.list.map((element, idx) => {
                const degree = idx * incrementBy;
                const {x, y} = this.calcCoords(
                  degree + circleOffset - 90,
                  elementWidth,
                  coverHeight + 60,
                  circleWidth,
                  circleHeight
                );
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
                        user={profiles[element._owner]}
                        type="list"
                        namePosition={'bottom'}
                        className="mt1 mb1"
                      />
                      <p>{element.description}</p>
                      <hr />
                      <div className="text-right">
                        <CheckmarkConnected
                          book={{book: element.book}}
                          origin={`Fra ${list.title} lavet af ${profile.name}`}
                        />
                      </div>
                    </PopOver>
                  </div>
                );
              })}
          </div>
        </div>
      </div>,
      <SimpleList
        key="simple-list"
        editButton={this.props.editButton}
        list={list}
        profile={profile}
        profiles={this.props.profiles}
      />
    ];
  }
}
