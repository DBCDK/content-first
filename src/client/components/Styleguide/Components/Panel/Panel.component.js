import React from 'react';
import _ from 'lodash';

import './Panel.css';

let sections = [];
let links = [];

let lastId;
let cur = [];

export default class Panel extends React.Component {
  componentDidMount() {
    sections = Array.from(document.querySelectorAll('section[id]'));
    links = Array.from(document.querySelectorAll('.Panel_anchor'));

    window.addEventListener('scroll', event => {
      let fromTop = window.scrollY + 100;

      links.forEach(link => {
        let section = document.querySelector(link.hash);

        if (
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          link.classList.add('current');
        } else {
          link.classList.remove('current');
        }
      });
    });
  }

  componentDidUnount() {
    window.removeEventListener('scroll');
  }

  componentDidUpdate() {
    sections = Array.from(document.querySelectorAll('section[id]'));
    links = Array.from(document.querySelectorAll('.Panel_anchor'));
  }

  smoothScroll = anchor => {
    document.getElementById(`${anchor}`).scrollIntoView({
      behavior: 'smooth'
    });
  };

  render() {
    return (
      <div className="Panel">
        <ul>
          {sections.map((section, i) => {
            let current = i === 0 ? 'current' : '';

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`Panel_anchor ${current}`}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.smoothScroll(section.id);
                  }}
                >
                  {section.querySelector('h1').textContent}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
