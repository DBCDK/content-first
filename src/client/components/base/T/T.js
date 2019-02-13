import React from 'react';
import './T.css';

// Translation data obj
import translation from './T.json';

export const lang = translation.language;
export const units = translation.units;
export const components = translation.components;

/**
 * Examples:
 *
 * The componentWay:
 * * <T component="" name="" vars={[x,y,..]}/>
 *
 * The functionWay:
 * * T({component: '', name: '', vars: [x,y,..]});
 *
 * The function-in-component way:
 * <T
   component=''
   name=''
   vars={[x, y, T({component: '', name: ''})]}
 />
 *
 * @param {string} component
 * @param {string} name
 * @param {array} vars
 * @param {bool} renderAsHtml
 * @return {string}
 *
 */

const T = ({component, name, vars, renderAsHtml = false}) => {
  // Check if requested text exist, return error message instead, if not
  if (!components[component]) {
    return `{! unknown component: ${component}}`;
  }
  if (!components[component][name]) {
    return `{! unknown name: ${name} in component: ${component}}`;
  }
  if (!components[component][name][lang]) {
    return `{! unknown language: ${lang} in name: ${name}}`;
  }

  // Requested text
  const text = components[component][name][lang];

  // Result
  let result = text;

  /*
  * If requested text contains variables (%s)
  * %s will be replaced by variables from the
  * vars array
  */

  if (text.includes('%s')) {
    const aText = text.split('%s');

    if (aText.length - 1 !== vars.length) {
      return `{! vars does not match %s in name: ${name}}`;
    }

    let str = '';
    for (var i = 0; i < aText.length; i++) {
      str += aText[i] || '';
      str += vars[i] || '';
    }
    result = str;
  }

  // Render Html in text
  if (renderAsHtml) {
    return <span dangerouslySetInnerHTML={{__html: text}} />;
  }

  return result;
};

export default T;
