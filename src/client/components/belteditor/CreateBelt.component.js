import React from 'react';
import {connect} from 'react-redux';
import T from '../base/T';

import './CreateBelt.css';

import Banner from "../base/Banner";

export class CreateProfilePage extends React.Component {
  render() {
    return (
      <div className="CreateBelt">
        <Banner
          title={T({component: 'editStartPage', name: 'createNewBelt'})}
          className="fixed-width-col-md position-relative"
        />
      </div>
    );
  }
}

export const mapStateToProps = () => {};

export const mapDispatchToProps = () => {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProfilePage);
