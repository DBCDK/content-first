import React from 'react';
import {connect} from 'react-redux';
import Image from '../Image.component';
import {ON_SHORTLIST_EXPAND, ON_SHORTLIST_COLLAPSE, ON_SHORTLIST_REMOVE_ELEMENT} from '../../redux/shortlist.reducer';

const ShortListElement = (props) => {
  return (
    <div className="short-list-element">
      <div className="short-list-element--cover-image">
        <Image urls={[
          `https://metakompasset.demo.dbc.dk/api/cover/${encodeURIComponent(props.element.book.pid)}`,
          `/v1/image/${encodeURIComponent(props.element.book.pid)}`,
          '/default-book-cover.png'
        ]}/>
      </div>
      <div className="short-list-element--text">
        <div className="short-list-element--header">{props.element.book.title}</div>
        <div className="short-list-element--description">{props.element.book.taxonomy_description}</div>
        <div className="short-list-element--origin">{props.element.origin}</div>
      </div>
      <span className="short-list-element--close-btn glyphicon glyphicon-remove text-right" onClick={props.onClose}/>
    </div>
  );
};

const ShortListContent = (props) => {
  if (!props.expanded) {
    return null;
  }

  return (
    <div className="short-list--content panel text-left">
      <span className="short-list--close-btn glyphicon glyphicon-remove" onClick={props.onClose}/>
      <div className="short-list--header">HUSKELISTE</div>
      <div className='short-list--empty-text text-center'>{props.elements.length === 0 && 'Din huskeliste er tom'}</div>
      <div className="short-list--elements">
        {props.children}
      </div>
    </div>
  );
};

class ShortListDropdown extends React.Component {
  render() {
    const {expanded, elements} = this.props.shortListState;

    return (
      <div className="short-list">
        <div className="short-list--btn" onClick={() => {
          this.props.dispatch({type: expanded ? ON_SHORTLIST_COLLAPSE : ON_SHORTLIST_EXPAND});
        }}>Huskeliste</div>
        <ShortListContent
          expanded={expanded}
          elements={elements}
          onClose={() => this.props.dispatch({type: ON_SHORTLIST_COLLAPSE})
          }>
          {elements && elements.map(element => {
            return <ShortListElement
              key={element.book.pid}
              element={element}
              onClose={() => this.props.dispatch({type: ON_SHORTLIST_REMOVE_ELEMENT, pid: element.book.pid})}/>;
          })}
        </ShortListContent>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {shortListState: state.shortListReducer};
  }
)(ShortListDropdown);
