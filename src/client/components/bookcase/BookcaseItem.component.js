import React from 'react';
import Pulse from '../pulse/Pulse.component';
import CarouselItem from './CarouselItem.component';
import CarouselSlider from './CarouselSlider.component';

/*
  <BookcaseItem list={obj} profile={obj}/>
*/

export class BookcaseItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      slideIndex: null,
      carousel: false,
      pulse: ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.list.list.length !== nextProps.list.list.length ||
      this.state !== nextState
    );
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

    return (
      <section
        className={`${this.state.carousel ? 'section-active' : ''}`}
        onClick={this.test}
      >
        <img
          className={'imgcontainer'}
          src={
            this.props.list.image
              ? '/v1/image/' + this.props.list.image + '/1200/600'
              : this.props.list.bookcase
          }
          alt={this.props.name + '´s bogreol'}
        />

        <div className="row">
          <div className="bookswrap">
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
            <img
              className="carousel-close"
              src="/static/media/Kryds.e69a54ef.svg"
              alt="luk"
              onClick={() => {
                this.hideCarousel();
              }}
            />

            <div className="col-xs-12 celeb-top">
              <div className="scrolltext">
                <div className="innerscrollbox">
                  <div className="col-xs-12 pagetag">{pagetag}</div>
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
                    <span className={'linktext'}>
                      Se {firstname}
                      's bogliste
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
                    <CarouselItem
                      active={this.state.carousel}
                      key={'carousel-' + b.book.pid}
                      description={b.description || b.book.description}
                      book={b.book}
                    />
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
