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
 * @param {String} component
 * @param {String} name
 * @param {Array} vars
 * @return {String}
 *
 */

const T = ({component, name, vars}) => {
  const text = components[component][name][lang];

  if (text.includes('%s')) {
    const aText = text.split('%s');

    if (aText.length - 1 !== vars.length) {
      return '! Missing texts or vars';
    }

    let aReturn = '';
    for (var i = 0; i < aText.length; i++) {
      aReturn += aText[i] || '';
      aReturn += vars[i] || '';
    }
    return aReturn;
  }

  return text;
};

export default T;
