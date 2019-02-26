import React from 'react';
import Heading from '../../base/Heading';
import withTagsFromUrl from '../../base/AdressBar/withTagsFromUrl.hoc';

import './CardList.css';

const ListItem = withTagsFromUrl(
  ({filter, isSelected, toggleSelected, enabled = true}) => {
    const selected = isSelected(filter.id);
    const tagState = selected ? 'listItem-active' : 'listItem-inactive';
    return (
      <li
        type="term"
        size="small"
        className={'FilterCard__listItem ' + tagState}
        data-cy={filter.title.toLowerCase() || ''}
        onClick={() => {
          if (enabled) {
            toggleSelected(filter.id);
          }
        }}
      >
        {filter.title}
      </li>
    );
  }
);

class FilterCardList extends React.Component {
  render() {
    const {filter, filters, expanded, isSelected} = this.props;
    const ignore = [];

    const oFilters = filters[filter.title];
    const aFilters = Object.values(oFilters);
    const aKeys = Object.keys(oFilters);

    return (
      <ul className={`FilterCard__list `}>
        {!expanded &&
          aFilters.map(f => {
            if (f instanceof Array) {
              return f.map(aF => {
                if (isSelected(aF.id)) {
                  ignore.push(aF.id);
                  return (
                    <React.Fragment>
                      <ListItem key={aF.id} filter={aF} enabled={false} />
                      {!expanded && <span>{', '}</span>}
                    </React.Fragment>
                  );
                }
              });
            }
            if (isSelected(f.id)) {
              ignore.push(f.id);
              return (
                <React.Fragment>
                  <ListItem key={f.id} filter={f} enabled={false} />
                  {!expanded && <span>{', '}</span>}
                </React.Fragment>
              );
            }
          })}

        {aFilters.map((f, idx) => {
          if (f instanceof Array) {
            return (
              <React.Fragment key={idx}>
                {expanded && (
                  <li
                    type="term"
                    size="small"
                    className={
                      'FilterCard__listItem FilterCard__listItem-heading'
                    }
                  >
                    {aKeys[idx]}
                  </li>
                )}
                {f.map(aF => {
                  if (!ignore.includes(aF.id)) {
                    return (
                      <React.Fragment key={aF.id}>
                        <ListItem key={aF.id} filter={aF} />
                        {!expanded && <span>{', '}</span>}
                      </React.Fragment>
                    );
                  }
                })}
              </React.Fragment>
            );
          }
          if (!ignore.includes(f.id)) {
            return (
              <React.Fragment key={f.id}>
                <ListItem key={f.id} filter={f} />
                {!expanded && <span>{', '}</span>}
              </React.Fragment>
            );
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

export default withTagsFromUrl(FilterCardList);
