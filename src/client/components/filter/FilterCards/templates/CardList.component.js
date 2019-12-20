import React from 'react';
import {isMobile} from 'react-device-detect';
import Heading from '../../../base/Heading';
import {withTagsFromUrl} from '../../../hoc/AdressBar';

import './CardList.css';

const ListItem = withTagsFromUrl(
  ({filter, isSelected, toggleSelected, enabled}) => {
    const selected = isSelected(filter.id);
    const tagState = selected ? 'listItem-active' : 'listItem-inactive';
    const isTouch = isMobile ? 'isTouch' : '';

    return (
      <li
        type="term"
        size="small"
        className={`FilterCard__listItem ${tagState} ${isTouch}`}
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

    console.log(filter.title, aFilters);

    return (
      <ul className={`FilterCard__list `}>
        {!expanded &&
          aFilters.map(f => {
            if (f instanceof Array) {
              return f.map(aF => {
                if (isSelected(aF.id)) {
                  ignore.push(aF.id);
                  return (
                    <React.Fragment key={'notExpArr-' + aF.id}>
                      <ListItem filter={aF} enabled={false} />
                      <span>{', '}</span>
                    </React.Fragment>
                  );
                }
                return null;
              });
            }
            if (isSelected(f.id)) {
              ignore.push(f.id);
              return (
                <React.Fragment key={'notExp-' + f.id}>
                  <ListItem filter={f} enabled={false} />
                  <span>{', '}</span>
                </React.Fragment>
              );
            }
            return null;
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
                      <React.Fragment key={'exp-' + aF.id}>
                        <ListItem filter={aF} enabled={expanded} />
                        {!expanded && <span>{', '}</span>}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </React.Fragment>
            );
          }
          if (!ignore.includes(f.id)) {
            return (
              <React.Fragment key={'inc' + f.id}>
                <ListItem filter={f} enabled={expanded} />
                {!expanded && <span>{', '}</span>}
              </React.Fragment>
            );
          }
          return null;
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
