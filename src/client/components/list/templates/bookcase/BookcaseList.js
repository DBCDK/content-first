import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {getListByIdSelector} from '../../../../redux/list.reducer';
import {getUser} from '../../../../redux/users';
import AddToList from '../../addtolist/AddToList.container';
import ListElement from '../../element/ListElement';
import ListInfo from './ListInfo';
import StickyConfirmPanel from '../../button/StickyConfirmPanel';
import StickySettingsPanel from '../../menu/StickySettingsPanel';

import './bookcaseList.css';

const getListById = getListByIdSelector();

export class BookcaseList extends React.Component {
  constructor() {
    super();
    this.state = {
      added: null,
      sticky: false,
      expanded: false,
      windowWidth: 0,
      info: null,
      titleMissing: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    this.setState({info: this.refs.info});
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  handleScroll = () => {
    const info = this.getListInfoPositions();
    const sticky = window.pageYOffset > info.height ? true : false;

    if (this.state.sticky !== sticky) {
      this.setState({sticky});
    }
    if (this.state.expanded === true) {
      this.setState({expanded: false});
    }
  };

  handleResize = () => {
    const windowWidth = window.innerWidth;
    if (this.state.windowWidth !== windowWidth) {
      this.setState({windowWidth});
    }
  };

  onExpandClick = () => {
    this.setState({expanded: !this.state.expanded});
  };

  onPulseClick = pid => {
    scrollToComponent(this.refs[pid], {
      align: 'top',
      offset: -220,
      duration: 500
    });
  };

  getListInfoPositions = () => {
    const info = this.state.info;
    const headerHeight =
      document.getElementsByTagName('header')[0].offsetHeight || 0;

    let padding = 0;
    let imgHeight = 0;
    let imgWidth = 0;

    if (info && info.querySelector('.list-cover-image')) {
      imgWidth = info.querySelector('.list-cover-image').offsetWidth;
      imgHeight = info.querySelector('.list-cover-image').offsetHeight;

      const nodeStyle = window.getComputedStyle(info);
      padding = nodeStyle.getPropertyValue('padding');
    }

    return {
      height: info ? info.offsetHeight : '100%',
      width: info ? info.offsetWidth : '100%',
      top: info ? info.offsetTop : 0,
      headerHeight,
      padding,
      imgWidth,
      imgHeight
    };
  };

  onEdit = () => {
    scrollToComponent(this.refs.cover, {
      align: 'top',
      offset: -200,
      duration: 500
    });
  };

  onAddBook = () => {
    scrollToComponent(this.refs.suggester, {
      align: 'top',
      offset: -100,
      duration: 500
    });
    this.refs.suggester.input.focus();
  };

  render() {
    const {_id, list} = this.props;
    const {added} = this.state;
    return (
      <React.Fragment>
        <StickyConfirmPanel
          _id={_id}
          onTitleMissing={bool => this.setState({titleMissing: bool})}
        />
        <StickySettingsPanel
          _id={_id}
          showOwner={true}
          showDate={true}
          onEdit={this.onEdit}
          onAddBook={this.onAddBook}
          disabled={list.editing || list.isNew}
        />
        <div className="d-flex justify-content-center mt-0 mt-md-5 mb-5">
          <div className="fixed-width-col-sm d-xs-none d-xl-block" />
          <div
            className="list-container fixed-width-col-md"
            ref={cover => {
              this.refs = {...this.refs, cover};
            }}
          >
            <ListInfo
              _id={_id}
              onAddBook={this.onAddBook}
              onEdit={this.onEdit}
              sticky={this.state.sticky}
              expanded={this.state.expanded}
              expandClick={this.onExpandClick}
              pulseClick={this.onPulseClick}
              info={this.getListInfoPositions()}
              infoRef={info => {
                this.refs = {...this.refs, info};
              }}
              titleMissing={this.state.titleMissing}
              forceUpdate={() => this.forceUpdate()}
            />
            <div className="position-relative">
              {list.list.map(element => {
                return (
                  <ListElement
                    elementRef={eRef => {
                      this.refs[element.pid] = eRef;
                    }}
                    key={element.pid}
                    element={element}
                    list={list}
                    showUserInfo={false}
                    editing={added === element.pid ? true : false}
                  />
                );
              })}
              {list.editing && (
                <div
                  className="position-absolute"
                  style={{
                    width: '100%',
                    height: '100%',
                    top: 0,
                    background: 'white',
                    opacity: 0.7,
                    zIndex: 1000
                  }}
                />
              )}
            </div>
            <AddToList
              suggesterRef={suggester => {
                this.refs = {...this.refs, suggester};
              }}
              className="pt-5"
              style={{minHeight: 500, background: 'white'}}
              list={list}
              onAdd={pid => this.setState({added: pid})}
              disabled={list.editing}
            />
          </div>
          <div className="fixed-width-col-sm d-xs-none d-lg-block mt-4 ml-4" />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const list = getListById(state, {_id: ownProps._id});

  return {
    owner: getUser(state, {id: list._owner}),
    list
  };
};
export default connect(mapStateToProps)(BookcaseList);
