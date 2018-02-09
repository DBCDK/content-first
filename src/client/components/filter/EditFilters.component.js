import React from 'react';
import intersection from 'lodash.intersection';

const FilterButton = props => {
  return (
    <span
      className={props.selected ? 'btn btn-active' : 'btn btn-inactive'}
      onClick={() => {
        props.onFilterToggle(props.filter);
      }}
    >
      {props.filter.title}
    </span>
  );
};

const EditFilters = props => {
  return (
    <div
      className={
        props.edit
          ? 'edit-filters col-xs-12 text-left'
          : 'edit-filters col-xs-12 text-left hidden'
      }
    >
      {Object.entries(props.filters).map(([title, values]) => {
        return (
          <div key={title} className="first-level col-xs-4">
            <h3>{title}</h3>
            {!Array.isArray(values) &&
              Object.entries(values).map(([title2, values2]) => {
                const id = title2;
                // find selected filters of this category
                const selected = intersection(
                  props.selectedFilters.map(f => f.id),
                  values2.map(f => f.id)
                );
                const selectedClass =
                  selected.length > 0 ? ' contains-selected' : '';
                return (
                  <div
                    key={id}
                    className={`second-level col-xs-12${selectedClass}`}
                  >
                    <h4
                      onClick={() => {
                        props.onExpandFiltersToggle(title2);
                      }}
                    >
                      {title2}
                      <span>{values2.length}</span>
                    </h4>
                    {props.expandedFilters[id] &&
                      values2.map(f => {
                        return (
                          <FilterButton
                            key={f.title}
                            filter={f}
                            selected={
                              props.selectedFilters
                                .map(s => s.id)
                                .indexOf(f.id) >= 0
                            }
                            onFilterToggle={props.onFilterToggle}
                          />
                        );
                      })}
                  </div>
                );
              })}
            {Array.isArray(values) &&
              values.map(f => {
                return (
                  <div key={f.title} className="second-level">
                    <FilterButton
                      filter={f}
                      selected={
                        props.selectedFilters
                          .map(selected => selected.id)
                          .indexOf(f.id) >= 0
                      }
                      onFilterToggle={props.onFilterToggle}
                    />
                  </div>
                );
              })}
          </div>
        );
      })}
      <div className="col-xs-12 text-center">
        <span
          className="btn btn-success approve"
          onClick={props.onEditFilterToggle}
        >
          Luk
        </span>
      </div>
    </div>
  );
};

export default EditFilters;
