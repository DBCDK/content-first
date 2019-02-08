import React from 'react';
import './T.css';

// Translation data obj
import translation from './T.json';

export const lang = translation.language;
export const units = translation.units;
export const components = translation.components;

/**
 *
 * The componentWay: <T component="" name="" vars={[]}/>
 *
 * The functionWay: T({component: '', name: '', vars: []});
 *
 * @param {String} component
 * @param {String} name
 * @param {Array} vars
 * @return {String || Array}
 *
 */

const T = ({component, name, vars}) => {
  if (!components[component]) {
    console.log('Cant find component: ' + component);
  }
  if (!components[component][name]) {
    console.log('Cant find ' + name + ' in component ' + component);
  }
  if (!components[component][name][lang]) {
    console.log(
      'Cant find language ' +
        lang +
        ' in component ' +
        component +
        ' name ' +
        name
    );
  }

  const text = components[component][name][lang];

  if (text.includes('%s')) {
    const aText = text.split('%s');

    if (aText.length - 1 !== vars.length) {
      return '! Missing texts or vars';
    }

    let aReturn = [];
    for (var i = 0; i < aText.length; i++) {
      aReturn.push(aText[i] || '');
      aReturn.push(vars[i] || '');
    }
    return aReturn;
  }

  return text;
};

export default T;
