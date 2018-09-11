import React from 'react';
import Pulse from '../pulse/Pulse.component';
import CarouselSlider from './CarouselSlider.component';
import ConciseWork from '../work/ConciseWork.container';

export class BookcaseItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      slideIndex: null,
      carousel: false,
      pulse: ''
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.gotoListPage = this.gotoListPage.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.list.list.length !== nextProps.list.list.length ||
      this.state !== nextState
    );
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
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

  updateDimensions() {
    this.getWindowWidth();

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
    const listurl =
      'https://content-first.demo.dbc.dk/lister/af12d710-b5ac-11e8-9ee1-1b9b68a1acb2';
    if (this.getWindowWidth() <= 500) {
      window.open(listurl, '_blank');
    }
  }

  render() {
    if (!this.props.list || !this.props.profile) {
      return null;
    }

    let description = this.props.list.description;

    // replacing -this.props.profile.name
    let firstname = this.props.profile.name.split(' ')[0];

    // new
    let pagetag = "Bøger jeg kan li'";
    // new
    let nameQuote = 'Læsning giver ro oveni hovedet';
    // new
    let subtag = 'Anbefalinger fra ' + this.props.profile.name + ', journalist';

    const imageStyle = {
      backgroundImage: 'url(' + this.props.list.bookcase + ')'
    };

    return (
      <section className={`${this.state.carousel ? 'section-active' : ''} `}>
        <div className="caroContainer" onClick={this.gotoListPage}>
          <div className="bookswrap" style={imageStyle}>
            {this.props.list.list.map((p, i) => {
              return (
                <Pulse
                  active={this.state.pulse}
                  pid={p.book.pid}
                  key={'pulse-' + p.book.pid}
                  onClick={() => {
                    this.carouselTrigger(p.book.pid, i);
                  }}
                  position={p.position}
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
                  <div className="col-xs-12 pagetag">
                    {pagetag.toUpperCase()}
                  </div>
                  <div className="col-xs-12 profile">
                    <span className="profile-name">{firstname}: </span>
                    <span className="profile-quote"> “{nameQuote}”</span>
                  </div>
                  <div className="col-xs-12 subtag">{subtag}</div>

                  <div className="col-xs-12 celeb-descript">
                    <p>{description}</p>
                  </div>
                </div>
              </div>

              <div className="col-xs-12">
                {this.props.list.list.length !== 0 ? (
                  <div
                    className="celeb-link-btn"
                    onClick={() => {
                      this.carouselTrigger(this.props.list.list[0].book.pid, 0);
                    }}
                  >
                    <span className="linktext">
                      Se {firstname + "'s"} bogliste
                    </span>
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
                {this.props.list.list.map(b => {
                  return (
                    <div
                      className={`carousel-container ${
                        this.props.active ? ' carousel-display' : ''
                      }`}
                    >
                      <ConciseWork pid={b.book.pid} />
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

export default BookcaseItem;
