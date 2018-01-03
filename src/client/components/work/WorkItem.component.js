import React from 'react';
import BookCover from '../general/BookCover.component';
import CheckmarkMenu, {MenuItem} from '../general/CheckmarkMenu.component';
import CheckmarkButton from '../general/CheckmarkButton.component';
import TouchHover from '../general/TouchHover.component';
import {SYSTEM_LIST} from '../../redux/list.reducer';

class WorkItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.changeMap[this.props.work.book.pid] !==
        nextProps.changeMap[this.props.work.book.pid] ||
      this.props.marked !== nextProps.marked ||
      this.props.work !== nextProps.work
    );
  }

  render() {
    const tax_description =
      this.props.work.book.taxonomy_description ||
      this.props.work.book.description;
    return (
      <div className={this.props.workClass}>
        <TouchHover className="cover-image-wrapper">
          <TouchHover
            className="cover-image"
            onClick={touches => {
              if (touches !== 1) {
                this.props.onCoverClick(this.props.work.book.pid);
              }
            }}
          >
            <BookCover book={this.props.work.book} />
          </TouchHover>
          {!this.props.isLoggedIn && (
            <CheckmarkButton
              label="Husk"
              marked={this.props.marked}
              onClick={() => this.props.onRememberClick(this.props.work)}
            />
          )}
          {this.props.isLoggedIn && (
            <CheckmarkMenu
              text="Husk"
              checked={this.props.marked}
              onClick={() => this.props.onRememberClick(this.props.work)}
            >
              {this.props.lists.filter(l => l.type === SYSTEM_LIST).map(l => (
                <MenuItem
                  key={l.id}
                  text={l.title}
                  checked={
                    l.list.filter(
                      element => element.book.pid === this.props.work.book.pid
                    ).length > 0
                  }
                  onClick={() => {
                    this.props.onAddToList(l);
                  }}
                />
              ))}
              <MenuItem
                key="addToList"
                text="Tilføj til liste"
                onClick={this.props.onAddToListOpenModal}
              />
            </CheckmarkMenu>
          )}
        </TouchHover>
        <div className="metakompas-description">
          {this.props.showTaxonomy &&
            tax_description &&
            tax_description
              .split('\n')
              .map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
      </div>
    );
  }
}

export default WorkItem;
