import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {getListByIdSelector} from '../../../../redux/list.reducer';
import {getUser} from '../../../../redux/users';
import AddToList from '../../addtolist/AddToList.container';
import ListElement from './ListElement';
import ListInfo from './ListInfo';
import StickyConfirmPanel from '../../button/StickyConfirmPanel';
import StickySettingsPanel from '../../menu/StickySettingsPanel';
import BookcaseItem from '../../../bookcase/BookcaseItem.component';

import './bookcaseList.css';

const getListById = getListByIdSelector();

export class BookcaseList extends React.Component {
  constructor() {
    super();
    this.state = {added: null, sticky: false, expanded: false};
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const info = this.getListInfoPositions();
    // Calculate if coverInfo should be fixed
    const offsetTop = window.pageYOffset;
    const headerHeight = document.getElementsByTagName('header')[0]
      .offsetHeight;

    //const sticky = offsetTop + headerHeight * 1.5 > info.top ? true : false;

    const sticky = offsetTop > info.top + info.height ? true : false;

    if (this.state.sticky !== sticky) {
      this.setState({sticky});
    }
    this.setState({expanded: false});
  };

  onExpandClick = () => {
    this.setState({expanded: !this.state.expanded});
  };

  getListInfoPositions = () => {
    return {
      height: this.refs.info ? this.refs.info.offsetHeight : 0,
      width: this.refs.info ? this.refs.info.offsetWidth : 0,
      top: this.refs.info ? this.refs.info.offsetTop : 0
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

    const info = this.getListInfoPositions();

    return (
      <React.Fragment>
        <BookcaseItem profile={list.user} list={list} />
        <StickyConfirmPanel _id={_id} />
        <StickySettingsPanel
          _id={_id}
          showOwner={true}
          showDate={true}
          onEdit={this.onEdit}
          onAddBook={this.onAddBook}
        />
        <div className="d-flex justify-content-center mt-0 mt-md-5 mb-5">
          <div className="fixed-width-col-sm d-xs-none d-xl-block" />
          <div
            className="list-container pistache fixed-width-col-md"
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
              info={info}
              infoRef={info => {
                this.refs = {...this.refs, info};
              }}
            />
            <div className="position-relative">
              {list.list.map(element => {
                return (
                  <ListElement
                    key={element.pid}
                    element={element}
                    list={list}
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
