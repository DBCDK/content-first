import React from 'react';
import FilterCards from './FilterCards.component';
import SearchBar from './SearchBar.component';
import Title from '../base/Title';

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

        <div className="container text-center">
          <Title Tag="h2" type="title4" className="mt-5">
            Her kodes ...
          </Title>
        </div>
      </div>
    );
  }
}
export default FilterPage;
