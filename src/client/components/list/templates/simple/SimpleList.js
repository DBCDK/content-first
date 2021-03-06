import React from 'react';
import scrollToComponent from 'react-scroll-to-component';
import {withList} from '../../../hoc/List';
import T from '../../../base/T';
import Icon from '../../../base/Icon';
import Text from '../../../base/Text';
import Banner from '../../../base/Banner';
import Comments from '../../../comments/Comment.container';
import AddToList from '../../addtolist/AddToList.container';
import ListElement from '../../element/ListElement';
import ListInfo from './ListInfo';
import ListContextMenu from '../../menu/ListContextMenu';

import {timestampToLongDate} from '../../../../utils/dateTimeFormat';

import './SimpleList.css';

export class SimpleList extends React.Component {
  onEdit = () => {
    scrollToComponent(this.refs.cover, {
      align: 'top',
      offset: -100,
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

  constructor() {
    super();
    this.state = {added: null, titleMissing: false};
  }

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
            <Text type="body" variant="color-petroleum--weight-semibold">
              <T component="list" name="list" />
            </Text>
            <div className="d-flex ml-4">
              <Icon
                className="align-middle md-small text-petroleum"
                name={list._public ? 'visibility' : 'visibility_off'}
              />
              <Text className="ml-2" type="small" variant="color-petroleum">
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
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                color: 'petroleum'
              }}
            />
          </div>
          <Text type="small" variant="color-petroleum">
            <T component={'general'} name="createdThe" />
            {` ${timestampToLongDate(list._created)}`}
          </Text>
        </Banner>

        <div className="d-flex justify-content-center mt-0">
          <div
            className="list-container fixed-width-col-md"
            ref={cover => {
              this.refs = {...this.refs, cover};
            }}
          >
            <ListInfo
              _id={_id}
              list={list}
              isListOwner={isListOwner}
              onAddBook={this.onAddBook}
              onEdit={this.onEdit}
              titleMissing={this.state.titleMissing}
            />
            <div className="position-relative mt-4 mt-md-5">
              {list.list.map(element => {
                return (
                  <ListElement
                    key={element.pid}
                    pid={element.pid}
                    element={element}
                    list={list}
                    editing={added === element.pid ? true : false}
                    showUserInfo={list._owner !== element._owner}
                    submit={storeList}
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

            {(list.open || isListOwner) && (
              <div className="p-3 p-md-0">
                <AddToList
                  id={list._id}
                  onAdd={pid => this.setState({added: pid})}
                  suggesterRef={suggester =>
                    (this.refs = {...this.refs, suggester})
                  }
                />
              </div>
            )}

            {list.social && (
              <div className="p-3 p-md-0" id="listCommentsArea">
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
        </div>
      </React.Fragment>
    );
  }
}

export default withList(SimpleList);
