import React from 'react';
import Header from '../../base/Header';
import FilterCards from '../FilterCards/FilterCards.component';
import SearchBar from '../SearchBar/SearchBar.component';
import Results from './Results.component';

import './FilterPage.css';

class FilterPage extends React.Component {
  render() {
    return (
      <div className="filter-page">
        <Header
          title={`Find din næste bog`}
          canonical={'/find'}
          og={{
            'og:title': `Find din næste bog`,
            'og:description': 'Find inspiration til din næste bog',
            'og:url': `https://laesekompas.dk/find`,
            'og:type': 'book'
          }}
        />
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
