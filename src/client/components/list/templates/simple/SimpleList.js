import React from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {getListByIdSelector} from '../../../../redux/list.reducer';
import AddToList from '../../addtolist/AddToList.container';
import ListElement from './ListElement';
import ListInfo from './ListInfo';
import StickyConfirmPanel from '../../button/StickyConfirmPanel';
import StickySettingsPanel from '../../menu/StickySettingsPanel';
const getListById = getListByIdSelector();

export class SimpleList extends React.Component {
  constructor() {
    super();
    this.state = {added: null};
  }
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

  render() {
    const {_id, list} = this.props;
    const {added} = this.state;
    return (
      <React.Fragment>
        <StickyConfirmPanel _id={_id} />
        <StickySettingsPanel
          _id={_id}
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
    list
  };
};
export default connect(mapStateToProps)(SimpleList);
