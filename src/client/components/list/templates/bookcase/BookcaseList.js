import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {withList} from '../../../hoc/List';
import AddToList from '../../addtolist/AddToList.container';
import ListElement from '../../element/ListElement';
import ListInfo from './ListInfo';
import T from '../../../base/T';
import Icon from '../../../base/Icon';
import Text from '../../../base/Text';
import Banner from '../../../base/Banner';
import Comments from '../../../comments/Comment.container';
import ListContextMenu from '../../menu/ListContextMenu';
import {timestampToLongDate} from '../../../../utils/dateTimeFormat';

import './bookcaseList.css';

export class BookcaseList extends React.Component {
  constructor() {
    super();
    this.state = {
      added: null,
      sticky: false,
      expanded: false,
      windowWidth: 0,
      info: null
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

  onAddBook = () => {
    scrollToComponent(this.refs.suggester, {
      align: 'top',
      offset: -100,
      duration: 500
    });
    this.refs.suggester.input.focus();
  };

  render() {
    const {_id, list, deleteList, isListOwner, storeList} = this.props;
    const {added} = this.state;
    return (
      <React.Fragment>
        <Banner
          color="#81c793"
          title={list.title}
          className="fixed-width-col-md position-relative"
        >
          <div className="d-flex align-items-center">
            <Text type="body" variant="color-white--weight-semibold">
              <T component="list" name="bookshelf" />
            </Text>
            <div className="d-flex ml-4">
              <Icon
                className="align-middle md-xsmall text-white"
                name={list._public ? 'visibility' : 'visibility_off'}
              />
              <Text className="ml-2" type="small" variant="color-white">
                <T
                  component="general"
                  name={list._public ? 'public' : 'private'}
                />
              </Text>
            </div>
            <ListContextMenu
              deleteList={deleteList}
              className="mt-3 mr-2 mr-md-0"
              _id={list._id}
              style={{position: 'absolute', right: 0, top: 0, color: 'white'}}
            />
          </div>
          <Text type="small" variant="color-white">
            <T component={'general'} name="createdThe" />
            {` ${timestampToLongDate(list._created)}`}
          </Text>
        </Banner>
        <div className="d-flex justify-content-center mt-0">
          <div className="fixed-width-col-sm d-xs-none d-xl-block" />
          <div
            className="list-container fixed-width-col-md"
            ref={cover => (this.refs = {...this.refs, cover})}
          >
            <ListInfo
              _id={_id}
              list={list}
              isListOwner={isListOwner}
              onAddBook={this.onAddBook}
              sticky={this.state.sticky}
              expanded={this.state.expanded}
              expandClick={this.onExpandClick}
              pulseClick={this.onPulseClick}
              info={this.getListInfoPositions()}
              infoRef={info => (this.refs = {...this.refs, info})}
              forceUpdate={() => this.forceUpdate()}
              commentsListRef={this.refs.commentsList}
            />
            <div className="position-relative mt-4 mt-md-5">
              {list.list.map(element => {
                return (
                  <ListElement
                    elementRef={eRef => {
                      this.refs[element.pid] = eRef;
                    }}
                    pid={element.pid}
                    key={element.pid}
                    element={element}
                    list={list}
                    showUserInfo={false}
                    editing={added === element.pid ? true : false}
                    submit={storeList}
                  />
                );
              })}
            </div>

            {(list.open || isListOwner) && (
              <div className="p-3 p-md-0">
                <AddToList
                  list={list}
                  onAdd={pid => this.setState({added: pid})}
                  suggesterRef={suggester =>
                    (this.refs = {...this.refs, suggester})
                  }
                />
              </div>
            )}

            {list.social && (
              <div
                className="p-3 p-md-0"
                ref={commentsList => {
                  this.refs = {...this.refs, commentsList};
                }}
              >
                {(list.open || isListOwner) && (
                  <div className="list-divider petroleum mt-4 mb-4" />
                )}
                <Text type="small" variant="weight-semibold" className="mb-3">
                  <T component="list" name="commentListLabel" />
                </Text>
                <Comments
                  className="simpleList-comment mb-5"
                  id={list._id}
                  disabled={false}
                />
              </div>
            )}
          </div>
          <div className="fixed-width-col-sm d-xs-none d-lg-block mt-4 ml-4" />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps)(withList(BookcaseList));
