import React from 'react';
import T from '../base/T';

import './CreateBelt.css';

import Banner from '../base/Banner';
import Input from '../base/Input';
import Divider from '../base/Divider';
import Button from '../base/Button';
import Toolbar from '../base/Toolbar';
import Radio from '../base/Radio';
import Text from '../base/Text';
import SearchBar from '../filter/SearchBar/SearchBar.component';
import FilterCards from '../filter/FilterCards/FilterCards.component';
import TagsBelt from '../base/Belt/TagsBelt.component';
import withTagsFromUrl from '../../components/hoc/AdressBar/withTagsFromUrl.hoc';
import Icon from '../base/Icon';

export class CreateBelt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      enabled: false
    };
  }

  handleTitleChange = event => {
    this.setState({title: event.target.value});
  };

  handleDescriptionChange = event => {
    this.setState({description: event.target.value});
  };

  handleEnabledChange = changeEvent => {
    this.setState({
      enabled: changeEvent.target.value === 'enabled'
    });
  };

  handleSubmit = () => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state);
    }
    const result = {...this.state, tags: this.props.tags.map(item => item.id)};
    console.log('CreateBelt Result', result);
    window.open('/redaktionen', '_self');
  };

  checkDisabled = () => this.state.title.length === 0;

  render() {
    const tags = this.props
      .flattenedTags()
      .map(tag => ({id: tag.id, weight: 1}));

    return (
      <div className="CreateBelt">
        <Banner
          title={T({component: 'editStartPage', name: 'createNewBelt'})}
          className="fixed-width-col-md"
        />
        <div className="CreateBelt__container col-centered">
          <Input
            className="create-belt-title"
            name="create-belt-title"
            placeholder={T({
              component: 'editStartPage',
              name: 'placeholderTitle'
            })}
            onChange={this.handleTitleChange}
            value={this.state.title}
            data-cy="create-belt-title-input"
          >
            <T component="editStartPage" name="beltTitle" />
          </Input>
          <Input
            className="create-belt-description"
            name="create-belt-description"
            placeholder={T({
              component: 'editStartPage',
              name: 'placeholderDescription'
            })}
            onChange={this.handleDescriptionChange}
            value={this.state.description}
            data-cy="create-belt-description-input"
          >
            <T component="editStartPage" name="description" />
          </Input>
          <Divider type="horizontal" variant="thin" />
          <label className="Input__label">
            <T component="editStartPage" name="publishing" />
          </label>
          <span className="CreateBelt__radioButtonContainer">
            <label className="CreateBelt__radioButton">
              <Radio
                name="publishing-group"
                value="disabled"
                checked={!this.state.enabled}
                onChange={this.handleEnabledChange}
                data-cy="create-belt-disabled-radio-button"
              />
              <T component="editStartPage" name="dontShowBelt" />
            </label>
          </span>
          <span className="CreateBelt__radioButtonContainer">
            <label className="CreateBelt__radioButton">
              <Radio
                name="publishing-group"
                value="enabled"
                checked={this.state.enabled}
                onChange={this.handleEnabledChange}
                data-cy="create-belt-enabled-radio-button"
              />
              <T component="editStartPage" name="doShowBelt" />
            </label>
            <Text
              className={
                'publish-today' + (this.state.enabled ? '' : ' disabled')
              }
              data-cy="create-belt-publish-today"
            >
              <T component="editStartPage" name="publishToday" />
            </Text>
          </span>
          <Divider type="horizontal" variant="thin" />
          <label className="Input__label">
            <T component="editStartPage" name="selectTags" />
          </label>
          <div className="filters row">
            <div className="filter-page-searchbar">
              <Icon name="search" />
              <SearchBar scrollableSuggestions={true} filterByType="TAG" />
            </div>
          </div>
        </div>
        <FilterCards />
        <TagsBelt
          mount={'createBelt' + JSON.stringify(tags)}
          id={this.state.title}
          name={this.state.title}
          subtext={this.state.description}
          tags={tags}
        />
        <Toolbar>
          <Button
            ref={this.cancelButton}
            id="cancel-button"
            align="center"
            size="large"
            type="quaternary"
            href="redaktionen"
            hrefSelf={true}
            dataCy="create-belt-cancel-button"
          >
            <T component="general" name="cancel" />
          </Button>
          <Button
            ref={this.createBeltButton}
            align="center"
            size="large"
            type="quaternary"
            onClick={this.handleSubmit}
            disabled={this.checkDisabled()}
            dataCy="create-belt-ok-button"
          >
            <T component="editStartPage" name="createBelt" />
          </Button>
        </Toolbar>
      </div>
    );
  }
}

export default withTagsFromUrl(CreateBelt);
