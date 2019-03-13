import React from 'react';
import PropTypes from 'prop-types';

import facebook from './facebook.svg';
import './Share.css';

/**
  Social media share button
  - Currently only supporting facebook

  * @param {String} href (!Required) The url to the page you want the user to share
  * @param {String or Object} children The button text
  * @param {bool} preventCash (true as default) Prevent facebook from cashing the shared post
  * @param {String} title The button hover title
  * @param {String} target (_blank as default) Share modal opens in new tab
  * @returns {React.Component} The share button

  * @example

    <Share
      title={'My hover title goes here'}
      href={'https://laesekompas.dk/lister/4747595903-34532...'}
      className="align-self-center"
    >
      Del
    </Share>

**/

const Share = ({
  href,
  children,
  className = '',
  target = '_blank',
  preventCash = true,
  onClick = null,
  title = null,
  ...props
}) => {
  const url = 'https://www.facebook.com/sharer/sharer.php?display=page&u=';
  const cash = preventCash ? `?${Date.now()}` : '';

  return (
    <a
      href={`${url}${href}${cash}`}
      title={title}
      target={target}
      onClick={onClick}
      className={`Share d-flex align-items-center petroleum ${className}`}
    >
      <img src={facebook} className="mr-2" width="13" height="auto" />
      <p className="Share__title">{children}</p>
    </a>
  );
};

export default Share;
