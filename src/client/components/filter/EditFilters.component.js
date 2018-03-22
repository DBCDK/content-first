import React from 'react';
import Kryds from '../svg/Kryds.svg';

const FilterGroup = ({
  title,
  filters,
  selectedFilters,
  onFilterToggle,
  className,
  showDelimiter
}) => (
  <div className={`filter-group ${className}`}>
    {showDelimiter && <hr className="mb1 mt2" />}
    <h4 className="mb0">{title}</h4>
    {filters[title].map(f => {
      return (
        <FilterButton
          key={f.id}
          filter={f}
          selected={
            selectedFilters.map(selected => selected.id).indexOf(f.id) >= 0
          }
          onFilterToggle={onFilterToggle}
        />
      );
    })}
  </div>
);
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
      style={props.style}
    >
      <div className={props.showTags ? 'tags' : 'tags hide-tags'}>
        <FilterGroup className="col-xs-4" title="Stemning" {...props} />
        <div className="col-xs-8">
          <div className="row">
            <FilterGroup className="col-xs-6" title="Længde" {...props} />
            <FilterGroup
              className="col-xs-6"
              title="På biblioteket"
              {...props}
            />
          </div>
          <div className="row">
            <FilterGroup
              className="col-xs-6"
              title="Tempo"
              showDelimiter={true}
              {...props}
            />
            <FilterGroup
              className="col-xs-6"
              title="Handlingens tid"
              showDelimiter={true}
              {...props}
            />
          </div>
          <div className="row">
            <FilterGroup
              className="col-xs-6"
              title="Struktur"
              showDelimiter={true}
              {...props}
            />
            <FilterGroup
              className="col-xs-6"
              title="Skrivestil"
              showDelimiter={true}
              {...props}
            />
          </div>
        </div>
      </div>
      <img
        src={Kryds}
        style={{
          width: 10,
          position: 'absolute',
          right: 30,
          top: 10,
          cursor: 'pointer'
        }}
        onClick={props.onEditFilterToggle}
        alt="Luk"
      />
    </div>
  );
};

export default EditFilters;
