import React from 'react';

import './CardList.css';

const ListItem = props => {
  const tagState = props.selected ? 'listItem-active' : 'listItem-inactive';
  return (
    <li
      type="tag"
      size="small"
      className={'FilterCard__listItem ' + tagState}
      onClick={() => {
        if (props.onFilterToggle) {
          props.onFilterToggle(props.filter);
        }
      }}
    >
      {props.filter.title}
    </li>
  );
};

class FilterCardList extends React.Component {
  render() {
    const {
      filter,
      filters,
      selectedFilters,
      onFilterToggle,
      expanded
    } = this.props;

    const ignore = [];

    return (
      <ul className={`FilterCard__list `}>
        {!expanded &&
          filters[filter.title].map(f => {
            if (
              selectedFilters.map(selected => selected.id).indexOf(f.id) >= 0
            ) {
              ignore.push(f.id);
              return (
                <React.Fragment>
                  <ListItem key={f.id} filter={f} selected={true} />
                  {!expanded && <span>{', '}</span>}
                </React.Fragment>
              );
            }
          })}
        {filters[filter.title].map(f => {
          if (!ignore.includes(f.id)) {
            return (
              <React.Fragment>
                <ListItem
                  key={f.id}
                  filter={f}
                  selected={
                    selectedFilters
                      .map(selected => selected.id)
                      .indexOf(f.id) >= 0
                  }
                  onFilterToggle={expanded && onFilterToggle}
                />
                {!expanded && <span>{', '}</span>}
              </React.Fragment>
            );
          }
        })}
      </ul>
    );
  }
}

export default FilterCardList;
