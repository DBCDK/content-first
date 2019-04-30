import React from 'react';
import FilterCards from '../FilterCards/FilterCards.component';
import SearchBar from '../SearchBar/SearchBar.component';
import Results from './Results.component';

import './FilterPage.css';

class FilterPage extends React.Component {
  render() {
    return (
      <div className="filter-page">
        <div className="filters row">
          <div className="filter-page-top col-12">
            <div className="filter-page-searchbar">
              <SearchBar />
            </div>
          </div>
        </div>
        <FilterCards />
        <Results />
      </div>
    );
  }
}

export default FilterPage;
