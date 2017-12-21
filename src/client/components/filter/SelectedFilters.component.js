import React from 'react';

const SelectedFilter = props => {
  return (
    <div className="selected-filter">
      {props.filter.title}
      <span
        onClick={() => {
          props.onDisableFilter(props.filter);
        }}
      >
        X
      </span>
    </div>
  );
};

const SelectedFilters = props => {
  return (
    <div>
      <div className="selected-filters text-left">
        <div className="col-xs-12">
          {props.selectedFilters.map((filter, idx) => {
            return (
              <SelectedFilter
                key={idx}
                filter={filter}
                onDisableFilter={props.onFilterToggle}
              />
            );
          })}
          <span
            className={
              props.edit
                ? 'add-filter btn btn-success'
                : 'add-filter btn btn-primary'
            }
            onClick={props.onEditFilterToggle}
          >
            Tilføj filter
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectedFilters;
