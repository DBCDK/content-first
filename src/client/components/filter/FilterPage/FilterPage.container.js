import React from 'react';
import Head from '../../base/Head';
import FilterCards from '../FilterCards/FilterCards.component';
import SearchBar from '../SearchBar/SearchBar.component';
import Results from './Results.component';

import './FilterPage.css';

class FilterPage extends React.Component {
  render() {
    return (
      <div className="filter-page">
        <Head
          title="Find din næste bog"
          description="Find den helt rigtige bog ved at søge på læseoplevelser som stemning, tempo, skrivestil, sprog."
          canonical="/find"
          og={{
            'og:url': 'https://laesekompas.dk/find',
            'og:type': 'book'
          }}
        />
        <div className="filters row">
          <div className="filter-page-top col-12">
            <div className="filter-page-searchbar">
              <SearchBar origin="fromFilter" blurInput={true} />
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
