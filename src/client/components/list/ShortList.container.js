import React from 'react';
import {connect} from 'react-redux';
import Kryds from '../svg/Kryds.svg';
import BookCover from '../general/BookCover.component';
import Textarea from 'react-textarea-autosize';
import {ON_SHORTLIST_REMOVE_ELEMENT} from '../../redux/shortlist.reducer';

export class ShortListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: ''
    };
  }

  render() {
    return (
      <div className="item col-xs-12 col-lg-10 text-left">
        <div className="row">
          <div className="book col-xs-6">
            <div className="row">
              <div className="col-xs-2">
                <BookCover pid={this.props.element.book.pid} />
              </div>
              <div className="col-xs-10 book-description">
                <div className="title">{this.props.element.book.title}</div>
                <div className="creator">{this.props.element.book.creator}</div>
                <Textarea
                  className="form-control description"
                  name="item-description"
                  placeholder={this.props.element.origin}
                  onChange={e => this.setState({description: e.target.value})}
                  value={this.state.description}
                />
              </div>
            </div>
          </div>
          <div className="add-to-list col-xs-3">
            Tilføj til liste
          </div>
          <div className="order col-xs-3">
            Bestil
          </div>
          <img src={Kryds} alt="remove" className="remove-btn" onClick={this.props.onRemove}/>
        </div>
      </div>
    );
  }
}
class ShortList extends React.Component {

  render() {
    const {elements} = this.props.shortListState;
    return (
      <div className="short-list-page col-xs-11 col-centered">
        <div className="page-header-1">Huskeliste</div>
        <div className="items">
          {elements.map(e =>
            <ShortListItem
              key={e.book.pid}
              element={e}
              onRemove={() => this.props.dispatch({type: ON_SHORTLIST_REMOVE_ELEMENT, pid: e.book.pid})}
            />
          )}
        </div>
      </div>
    );
  }
}
export default connect(
  // Map redux state to props
  (state) => {
    return {shortListState: state.shortListReducer};
  }
)(ShortList);
