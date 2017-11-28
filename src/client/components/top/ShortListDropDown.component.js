import React from 'react';
import {connect} from 'react-redux';
import Image from '../Image.component';
import Kryds from '../svg/Kryds.svg';
import Huskeliste from '../svg/Huskeliste.svg';
import {ON_SHORTLIST_EXPAND, ON_SHORTLIST_COLLAPSE, ON_SHORTLIST_REMOVE_ELEMENT} from '../../redux/shortlist.reducer';

const SHORT_LIST_MAX_LENGTH = 3;

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
        <div className="short-list-element--taxonomy-description">{props.element.book.taxonomy_description}</div>
        <div className="short-list-element--origin">{props.element.origin}</div>
      </div>
      <img src={Kryds} alt="luk" className="short-list-element--close-btn" onClick={props.onClose}/>
    </div>
  );
};

const ShortListContent = (props) => {
  const moreCount = props.elements.length - SHORT_LIST_MAX_LENGTH;
  let moreLabel = null;
  if (moreCount > 0) {
    if (moreCount === 1) {
      moreLabel = '1 bog mere på listen';
    }
    else {
      moreLabel = `${moreCount} bøger mere på listen`;
    }
  }
  return (
    <div className={`short-list--content panel text-left${props.expanded ? '' : ' slide-out'}`}>
      <img src={Kryds} alt="luk" className="short-list--close-btn" onClick={props.onClose}/>
      <div className="short-list--header">HUSKELISTE</div>
      <div className='short-list--empty-text text-center'>{props.elements.length === 0 && 'Din huskeliste er tom'}</div>
      <div className="short-list--elements">
        {props.children}
      </div>
      {moreLabel && <div className="short-list--more-elements text-center">
        <span className="short-list--more-elements-text">{moreLabel}</span>
        <div className="short-list--more-elements-line"/>
      </div>}
      {moreLabel && <div className="short-list--more-btn text-center"><span className="btn btn-default text-center">SE HELE LISTEN</span></div>}
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
        }}>
          <img src={Huskeliste} alt="" title="Huskeliste"/>
          {elements.length > 0 && <span className="short-list--btn-badge badge">{elements.length}</span>}
        </div>
        <ShortListContent
          expanded={expanded}
          elements={elements}
          onClose={() => this.props.dispatch({type: ON_SHORTLIST_COLLAPSE})
          }>
          {elements && elements.slice(0, SHORT_LIST_MAX_LENGTH).map(element => {
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
