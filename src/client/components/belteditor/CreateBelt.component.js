import React from 'react';
import {connect} from 'react-redux';
import T from '../base/T';

import './CreateBelt.css';

import Banner from '../base/Banner';
import Input from '../base/Input';
import Divider from '../base/Divider';
import Button from '../base/Button';
import Toolbar from '../base/Toolbar';

export class CreateBelt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    };
  }

  handleTitleChange = event => {
    this.setState({title: event.target.value});
  };

  handleDescriptionChange = event => {
    this.setState({description: event.target.value});
  };

  handleSubmit = () => {
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state);
    }
  };

  checkDisabled = () => this.state.title.length === 0;

  render() {
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
            <T component="editStartPage" name="title" />
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
        </div>
        <Toolbar>
          <Button
            ref={this.cancelButton}
            id="cancel-button"
            align="center"
            size="large"
            type="quaternary"
            href="redaktionen"
            hrefSelf={true}
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
          >
            <T component="editStartPage" name="createBelt" />
          </Button>
        </Toolbar>
      </div>
    );
  }
}

export const mapStateToProps = () => ({});

export const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBelt);
