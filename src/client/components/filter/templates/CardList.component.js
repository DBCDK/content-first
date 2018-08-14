import React from 'react';
import Heading from '../../base/Heading';

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
  componentWillReceiveProps(nextProps) {
    if (this.props.filters !== nextProps.filters) {
      console.log('not same');
    }
  }

  render() {
    const {
      filter,
      filters,
      selectedFilters,
      onFilterToggle,
      expanded
    } = this.props;

    console.log('render . . . ');
    console.log(selectedFilters);

    const ignore = [];

    const oFilters = filters[filter.title];
    const aFilters = Object.values(oFilters);
    const aKeys = Object.keys(oFilters);

    return (
      <ul className={`FilterCard__list `}>
        {!expanded &&
          aFilters.map(f => {
            if (f instanceof Array) {
              return f.map(f => {
                if (
                  selectedFilters.map(selected => selected.id).indexOf(f.id) >=
                  0
                ) {
                  ignore.push(f.id);
                  return (
                    <React.Fragment>
                      <ListItem key={f.id} filter={f} selected={true} />
                      {!expanded && <span>{', '}</span>}
                    </React.Fragment>
                  );
                }
              });
            } else {
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
            }
          })}

        {aFilters.map((f, idx) => {
          if (f instanceof Array) {
            return (
              <React.Fragment>
                {expanded && (
                  <li
                    type="tag"
                    size="small"
                    className={
                      'FilterCard__listItem FilterCard__listItem-heading'
                    }
                  >
                    {aKeys[idx]}
                  </li>
                )}
                {f.map(f => {
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
              </React.Fragment>
            );
          } else {
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
          }
        })}
        {!expanded && (
          <Heading
            type="subtitle"
            Tag="h6"
            className="FilterCard__listItem-more"
          >
            Vis flere...
          </Heading>
        )}
      </ul>
    );
  }
}

export default FilterCardList;
