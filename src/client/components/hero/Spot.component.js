import React from 'react';
import {connect} from 'react-redux';
import Title from '../base/Title';
import Text from '../base/Text';
import Link from '../general/Link.component';
import './Spot.css';

const Logo = () => (
  <div className="logo d-none d-md-flex flex-column justify-content-between">
    <div className="logo-circle" />
    <div className="logo-lines">
      <div className="logo-line short mt-2" />
      <div className="logo-line long mt-2" />
      <div className="logo-line regular mt-2" />
    </div>
  </div>
);

export class Hero extends React.Component {
  render() {
    const {isLoggedIn} = this.props;

    if (isLoggedIn) {
      return null;
    }

    return (
      <div className="Spot due">
        <div className="col-10 col-xl-6 mr-auto ml-auto d-flex justify-content-between h-100 p-0">
          <Logo />
          <div className="align-self-center text-center">
            <Title tag="h3" type="title4">
              {'Gem dine favoritter - Opret en profil på Læsekompas.dk'}
            </Title>
            <Link href="/v1/auth/login" className="d-block mt-3">
              <Text
                type="large"
                variant="decoration-underline"
                className="mb-0"
              >
                Log ind eller opret din profil her
              </Text>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.userReducer.isLoggedIn
  };
};

export default connect(mapStateToProps)(Hero);
