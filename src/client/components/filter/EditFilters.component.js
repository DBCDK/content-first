import React from 'react';
import intersection from 'lodash.intersection';

const FilterButton = (props) => {
  return (
    <span
      className={props.selected ? 'btn btn-active' : 'btn btn-inactive'}
      onClick={() => {
        props.onFilterToggle(props.filter);
      }}>
      {props.filter.title}
    </span>
  );
};

const EditFilters = (props) => {
  return (
    <div className={props.edit ? 'edit-filters col-xs-12 text-left' : 'edit-filters col-xs-12 text-left hidden'}>
      {props.filters.map((f1, idx1) => {
        if (f1.children) {
          return (
            <div key={idx1} className='first-level col-xs-4'>
              <h3>{f1.title}</h3>
              {f1.children.map((f2, idx2) => {
                if (f2.children) {

                  // find selected filters of this category
                  const selected = intersection(props.selectedFilters.map(f => f.id), f2.children.map(f => f.id));
                  const selectedClass = selected.length > 0 ? ' contains-selected' : '';

                  return (
                    <div key={idx2} className={`second-level col-xs-12${selectedClass}`}>
                      <h4 onClick={() => {
                        props.onExpandFiltersToggle(f2.id);
                      }}>{f2.title}<span>{f2.children.length}</span></h4>
                      {props.expandedFilters.includes(f2.id) && f2.children.map((f3, idx3) => {
                        if (!f3.children) {
                          return <FilterButton key={idx3} filter={f3} selected={props.selectedFilters.includes(f3)} onFilterToggle={props.onFilterToggle}/>;
                        }
                        return null;
                      })}
                    </div>
                  );
                }
                return (
                  <div key={idx2} className='second-level'>
                    <FilterButton filter={f2} selected={props.selectedFilters.includes(f2)} onFilterToggle={props.onFilterToggle}/>
                  </div>
                );
              })}
            </div>
          );
        }
        return null;
      })}
      <div className='col-xs-12 text-center'>
        <span className='btn btn-success approve' onClick={props.onEditFilterToggle}>OK</span>
      </div>
    </div>
  );
};

export default EditFilters;
