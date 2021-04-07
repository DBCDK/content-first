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
        <div className="filters">
          <div className="filter-page-top">
            <div className="filter-page-searchbar">
              <SearchBar origin="fromFilter" blurInput={true} />
            </div>
          </div>
        </div>
        <FilterCards />
        <Results path="find" />
      </div>
    );
  }
}

export default FilterPage;
