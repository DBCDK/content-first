import React from 'react';
import {connect} from 'react-redux';
import Pulse from '../pulse/Pulse.component';
import CarouselSlider from './CarouselSlider.component';
import ConciseWork from '../work/ConciseWork.container';
import Title from '../base/Title';
import Text from '../base/Text';
import Spinner from '../general/Spinner.component';
import textParser from '../../utils/textParser';
import {getListByIdSelector} from '../../redux/list.reducer';
import {LIST_LOAD_REQUEST} from '../../redux/list.reducer';

const getListById = getListByIdSelector();

function percentageObjToPixel(e, pos) {
  const x = (pos.x * e.width) / 100;
  const y = (pos.y * e.height) / 100;
  return {x, y};
}

export class BookcaseItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      slideIndex: null,
      carousel: false,
      pulse: '',
      bookswrap: null
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.gotoListPage = this.gotoListPage.bind(this);
  }

  componentWillMount() {
    this.updateDimensions();
  }

  //
  // TODO: find a way to get rid of resize listener by using css media query instead.
  //
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.props.loadList(this.props.id);
  }

  componentDidUpdate() {
    if (this.state.bookswrap && this.state.bookswrap !== this.refs.bookswrap) {
      this.setState({bookswrap: this.refs.bookswrap});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  getWindowWidth() {
    let w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    return width;
  }

  handleResize = () => {
    const windowWidth = window.innerWidth;

    if (this.state.windowWidth !== windowWidth) {
      this.setState({windowWidth});
    }
  };

  updateDimensions() {
    this.getWindowWidth();
    this.handleResize();

    if (this.getWindowWidth() <= 500) {
      this.hideCarousel();
    }
  }

  hideCarousel() {
    this.setState({carousel: false, pulse: ''});
  }

  nextBook = pos => {
    if (this.state.carousel) {
      this.setState({
        pid: this.props.list.list[pos].book.pid,
        slideIndex: pos,
        pulse: this.props.list.list[pos].book.pid
      });
    }
  };

  carouselTrigger = (pid, i) => {
    this.setState({
      pid: pid,
      slideIndex: i,
      carousel: true,
      pulse: pid
    });
  };

  gotoListPage() {
    const listurl = '/lister/a2d7b450-c7ba-11e8-a4c7-c500cfdf0018';
    if (this.getWindowWidth() <= 500) {
      window.open(listurl, '_self');
    }
  }

  getBookswrapInfo = () => {
    const bookswrap = this.refs.bookswrap;

    return {
      height: bookswrap ? bookswrap.offsetHeight : 0,
      width: bookswrap ? bookswrap.offsetWidth : 0
    };
  };

  render() {
    const {list} = this.props;

    // When list is loading
    if (!list || list.isLoading) {
      // TODO make a skeleton view of list
      return (
        <div className="d-flex bookcase-skeleton position-relative justify-content-center lys-graa">
          <Spinner size="30px" className="mt-5" />
        </div>
      );
    }

    // If list is not reachable or list settings is set to private
    if (!list.list && (!list.isLoading && list.error)) {
      return (
        <div className="d-flex bookcase-skeleton position-relative justify-content-center lys-graa">
          <Text className="bookcase-error" type="body" variant="color-fersken">
            Listen kunne ikke indlæses
          </Text>
        </div>
      );
    }

    const imageStyle = {
      backgroundImage: `url(/v1/image/${list.image}/719/400)`
    };

    return (
      <section className={`${this.state.carousel ? 'section-active' : ''}  `}>
        <div className="caroContainer" onClick={this.gotoListPage}>
          <div
            className="bookswrap position-relative"
            style={imageStyle}
            ref={bookswrap => {
              this.refs = {...this.refs, bookswrap};
            }}
          >
            {list.list.map((work, i) => {
              const active = this.state.pulse === work.book.pid ? true : false;
              const position = percentageObjToPixel(
                this.getBookswrapInfo(),
                work.position
              );

              return (
                <Pulse
                  active={active}
                  key={'pulse-' + work.book.pid}
                  color={list.dotColor}
                  position={position}
                  onClick={() => {
                    this.carouselTrigger(work.book.pid, i);
                  }}
                />
              );
            })}
          </div>

          <div className="celeb">
            <i
              className="material-icons carousel-close"
              onClick={() => {
                this.hideCarousel();
              }}
            >
              clear
            </i>

            <div className="col-xs-12 celeb-top">
              <div className="scrolltext">
                <div className="innerscrollbox">
                  <div className="col-xs-12">
                    <Text type="micro" className="mb-0">
                      {list.subtitle}
                    </Text>
                  </div>
                  <div className="col-xs-12">
                    <Title Tag="h1" type="title3">
                      {list.title}
                    </Title>
                  </div>
                  <div className="col-xs-12">
                    <Text type="large" className="mt-3">
                      {list.lead}
                    </Text>
                  </div>

                  <div className="col-xs-12 celeb-descript">
                    <Text type="body">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: textParser(list.description || '')
                        }}
                      />
                    </Text>
                  </div>
                </div>
              </div>

              <div className="col-xs-12">
                {list.list.length !== 0 ? (
                  <div
                    className="celeb-link-btn"
                    onClick={() => {
                      this.carouselTrigger(list.list[0].book.pid, 0);
                    }}
                  >
                    <span className="linktext">{list.urlText}</span>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>

            <div className="col-xs-12 celeb-bottom">
              <CarouselSlider
                slideIndex={this.state.slideIndex}
                onNextBook={this.nextBook}
              >
                {list.list.map(element => {
                  return (
                    <div
                      key={'caro-' + element.book.pid}
                      className={`carousel-container ${
                        this.props.active ? ' carousel-display' : ''
                      }`}
                    >
                      <ConciseWork
                        pid={element.book.pid}
                        description={
                          element.description || element.book.description
                        }
                      />
                    </div>
                  );
                })}
              </CarouselSlider>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps.id});

  return {
    list
  };
};

export const mapDispatchToProps = dispatch => ({
  loadList: _id => dispatch({type: LIST_LOAD_REQUEST, _id})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookcaseItem);
