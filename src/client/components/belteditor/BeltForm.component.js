import React from 'react';
import T from '../base/T';

import './BeltForm.css';

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
import withTagsFromUrl from '../hoc/AdressBar/withTagsFromUrl.hoc';
import withHistory from '../hoc/AdressBar/withHistory.hoc';
import Icon from '../base/Icon';
import Storage from '../roles/Storage.component';
import {OPEN_MODAL} from '../../redux/modal.reducer';
import {connect} from 'react-redux';
import {withObjects} from '../hoc/Storage/withObjects.hoc';
import {ERROR} from '../general/Notification/Notification.component';
import {timestampToShortDate} from '../../utils/dateTimeFormat';
import {withUser} from '../hoc/User';

const CREATE = 'create';

const PublishedNote = withUser(({created, user}) => (
  <Text>
    {timestampToShortDate(parseInt(created, 10)) +
      (user && typeof user.name === 'string' ? ', ' + user.name : '')}
  </Text>
));

class BeltForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title || '',
      description: props.description || '',
      enabled: props.enabled ? props.enabled.toLowerCase() === 'true' : false,
      id: props.id || '',
      index: props.index || '',
      saving: false,
      created: this.props.created,
      createdBy: this.props.createdBy
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

  extractTags(tags) {
    const accumulatedTags = [];
    tags.forEach(tag => {
      if (tag.type === 'TAG') {
        accumulatedTags.push(tag);
      }
      if (tag.type === 'TAG_RANGE') {
        tag.inRange.forEach(t => accumulatedTags.push(t));
      }
    });
    return accumulatedTags;
  }

  beltObject = (title, description, enabled, tags, id, index, createdBy) => ({
    _public: true,
    _type: 'belt',
    _id: id,
    key: title,
    name: title,
    subtext: description,
    tags: this.extractTags(tags).map(item => ({id: item.id, weight: 1})),
    onFrontPage: enabled,
    index: index,
    createdBy: createdBy
  });

  handleSubmit = async (create, update) => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state);
    }
    const belt = this.beltObject(
      this.state.title,
      this.state.description,
      this.state.enabled,
      this.props.tags,
      this.state.id,
      this.state.index,
      this.state.createdBy
    );
    try {
      this.setState({saving: true});
      if (this.props.mode === CREATE) {
        await create(belt);
      } else {
        await update(belt);
      }
      this.props.historyReplace('/redaktionen');
    } catch (e) {
      if (this.props.mode === CREATE) {
        this.props.showNotification(
          ERROR,
          T({component: 'editStartPage', name: 'createBelt'}),
          T({component: 'editStartPage', name: 'createBeltError'}),
          'An error happened when trying to create Belt'
        );
      } else {
        this.props.showNotification(
          ERROR,
          T({component: 'editStartPage', name: 'updateBelt'}),
          T({component: 'editStartPage', name: 'updateBeltError'}),
          'An error happened when trying to update Belt'
        );
      }
    }
  };

  removeBelt = async remove => {
    try {
      await remove(
        this.beltObject(
          this.state.title,
          this.state.description,
          this.state.enabled,
          this.props.tags,
          this.state.id,
          this.state.index
        )
      );
      this.props.historyReplace('/redaktionen');
    } catch (e) {
      this.props.showNotification(
        ERROR,
        T({component: 'editStartPage', name: 'deleteBelt'}),
        T({component: 'editStartPage', name: 'deleteBeltError'}),
        'An error happened when trying to delete Belt'
      );
    }
  };

  checkDisabled = () => this.state.title.length === 0;

  render() {
    const tags = this.props
      .flattenedTags()
      .map(tag => ({id: tag.id, weight: 1}));
    const {mode} = this.props;
    return (
      <div className="BeltForm">
        <Banner
          title={
            mode === CREATE
              ? T({component: 'editStartPage', name: 'createNewBelt'})
              : T({component: 'editStartPage', name: 'editBelt'})
          }
          className="fixed-width-col-md"
        />
        <div className="BeltForm__container col-centered">
          <Input
            className="belt-form-title"
            name="belt-form-title"
            placeholder={T({
              component: 'editStartPage',
              name: 'placeholderTitle'
            })}
            onChange={this.handleTitleChange}
            value={this.state.title}
            data-cy="belt-form-title-input"
          >
            <T component="editStartPage" name="beltTitle" />
          </Input>
          <Input
            className="belt-form-description"
            name="belt-form-description"
            placeholder={T({
              component: 'editStartPage',
              name: 'placeholderDescription'
            })}
            onChange={this.handleDescriptionChange}
            value={this.state.description}
            data-cy="belt-form-description-input"
          >
            <T component="editStartPage" name="description" />
          </Input>
          <Divider type="horizontal" variant="thin" />
          <label className="Input__label">
            <T component="editStartPage" name="publishing" />
          </label>
          <span className="BeltForm__radioButtonContainer">
            <label className="BeltForm__radioButton">
              <Radio
                name="publishing-group"
                value="disabled"
                checked={!this.state.enabled}
                onChange={this.handleEnabledChange}
                data-cy="belt-form-disabled-radio-button"
              />
              <T component="editStartPage" name="dontShowBelt" />
            </label>
          </span>
          <span className="BeltForm__radioButtonContainer">
            <label className="BeltForm__radioButton">
              <Radio
                name="publishing-group"
                value="enabled"
                checked={this.state.enabled}
                onChange={this.handleEnabledChange}
                data-cy="belt-form-enabled-radio-button"
              />
              <T component="editStartPage" name="doShowBelt" />
            </label>
            <div
              className={
                'publish-today' + (this.state.enabled ? '' : ' disabled')
              }
              data-cy="belt-form-publish-today"
            >
              {mode === CREATE ? (
                <Text>
                  <T component="editStartPage" name="publishToday" />
                </Text>
              ) : (
                <React.Fragment>
                  <Text>
                    <T component="editStartPage" name="published" />:
                  </Text>
                  <PublishedNote
                    id={this.state.createdBy}
                    created={this.state.created}
                  />
                </React.Fragment>
              )}
            </div>
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
          mount={'beltForm' + JSON.stringify(tags)}
          id={this.state.title}
          name={this.state.title}
          subtext={this.state.description}
          tags={tags}
        />
        <Toolbar>
          <Button
            ref={this.cancelButton}
            id="cancel-button"
            align="left"
            size="large"
            type="quaternary"
            href="redaktionen"
            hrefSelf={true}
            dataCy="belt-form-cancel-button"
          >
            <T component="general" name="cancel" />
          </Button>

          {this.props.mode === CREATE || (
            <Storage
              align="left"
              role="contentFirstEditor"
              render={({remove}) => (
                <Button
                  ref={this.deleteButton}
                  id="delete-button"
                  size="large"
                  type="quaternary"
                  onClick={() => this.removeBelt(remove)}
                  dataCy="belt-form-delete-button"
                >
                  <T component="editStartPage" name="delete" />
                </Button>
              )}
            />
          )}

          <Storage
            align="right"
            // this homemade role creates a warning for the following reason:
            // Elements with ARIA roles must use a valid, non-abstract ARIA role
            // google this: jsx-a11y/aria-role
            // currently skipping the warning with the following comment
            // eslint-disable-next-line
            role="contentFirstEditor"
            render={({create, update}) => (
              <Button
                ref={this.beltFormButton}
                align="center"
                size="large"
                type="quaternary"
                onClick={() => this.handleSubmit(create, update)}
                disabled={this.checkDisabled()}
                dataCy="belt-form-ok-button"
              >
                {this.props.mode === CREATE ? (
                  <T component="editStartPage" name="createBelt" />
                ) : (
                  <T component="editStartPage" name="saveBelt" />
                )}
              </Button>
            )}
          />
        </Toolbar>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  showNotification: (notificationType, title = '', text = '', cause = '') => {
    dispatch({
      type: OPEN_MODAL,
      modal: 'notification',
      context: {
        notificationType: notificationType,
        title: title,
        text: text,
        cause: cause,
        hideCancel: true,
        hideConfirm: false,
        doneText: T({component: 'general', name: 'close'}),
        cancelText: T({component: 'general', name: 'cancel'}),
        onCancel: () => {
          dispatch({
            type: 'CLOSE_MODAL',
            modal: 'notification'
          });
        }
      }
    });
  }
});

export default connect(
  () => {},
  mapDispatchToProps
)(withObjects(withHistory(withTagsFromUrl(BeltForm))));
