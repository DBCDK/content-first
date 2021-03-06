import React from 'react';
import {Parallax, Background} from 'react-parallax';

import Button from '../../base/Button';
import Link from '../../general/Link.component';

import '../Hero.css';
import './InteractionSlide.css';
import {getLeavesMap, tagsToUrlParams} from '../../../utils/taxonomy';

const leavesMap = getLeavesMap();

/**
* Settings Example:
*
      {
        img: 'img/hero/Læsekompas_Images_16x9_022.jpg',
        blend: '#74a9ff',
        tags: [5642, 5660, 5731],
        btnColor: 'korn',
        btnText: 'Vis bøger',
        btnTextColor: 'petroleum',
        position: 'left',
        template: 'InteractionSlide',
        disabled: false
      }
*/

export class Hero extends React.Component {
  buildUrl(tags) {
    return `/find?tags=${tagsToUrlParams(tags)}`;
  }

  render() {
    const {hero, className} = this.props;

    // Horizontal flip
    const flip = hero.img.flip === 'x' ? 'flipX' : 'flipY';

    // Image source
    const orientation =
      window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    return (
      <Parallax className={`interaction-slide ${className}`} strength={250}>
        <Background>
          <div
            className={`hero_bg-image box-wrap ${flip}`}
            style={{
              backgroundImage: `url(${hero.img[orientation]})`,
              backgroundColor: hero.img.blend || 'transparent'
            }}
          />
        </Background>
        <div className={`box box-${hero.position}`}>
          {hero.tags.map(tag => (
            <Link
              key={`single-tag-${tag}`}
              href={this.buildUrl([tag])}
              tabIndex={-1}
            >
              <Button size="large" type="term" className="mb-2 mb-sm-3">
                {leavesMap[tag].title}
              </Button>
            </Link>
          ))}
          <Link href={this.buildUrl(hero.tags)} tabIndex={-1}>
            <Button
              type="primary"
              size="large"
              variant={`bgcolor-${hero.btnColor}--color-${hero.btnTextColor}`}
            >
              {hero.btnText}
            </Button>
          </Link>
        </div>
      </Parallax>
    );
  }
}

export default Hero;
