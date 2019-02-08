import './T.css';

// Translation data obj
import translation from './T.json';

export const lang = translation.language;
export const units = translation.units;
export const components = translation.components;

/**
 *
 * The componentWay:
 * * <T component="" name="" vars={[x,y,..]}/>
 *
 * The functionWay:
 * * T({component: '', name: '', vars: [x,y,..]});
 *
 * @param {String} component
 * @param {String} name
 * @param {Array} vars
 * @return {String || Array}
 *
 */

const T = ({component, name, vars}) => {
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
