/**
 * Utillties for backend service manipulation of taxonomy data.
 */

'use strict';
const _ = require('lodash');
const {validatingInput} = require('__/json');
const path = require('path');
const schema = path.join(__dirname, 'schemas/taxonomy-in.json');

class IdChecker {
  constructor() {
    this.problems = [];
    this.ids = [];
  }
  getProblems() {
    return this.problems;
  }
  checkId(x) {
    const id = parseInt(x, 10);
    if (_.isNaN(id)) {
      this.problems.push(`Cannot convert ${x} to an integer`);
      return;
    }
    if (_.includes(this.ids, id)) {
      this.problems.push(`Id ${id} occurs more than once`);
      return;
    }
    this.ids.push(id);
  }
}

function parsingTaxonomyInjection(obj) {
  return new Promise((resolve, reject) => {
    return validatingInput(obj, schema)
      .then(document => {
        const idChecker = new IdChecker();
        document.forEach(top => {
          idChecker.checkId(top.id);
          top.items.forEach(middle => {
            idChecker.checkId(middle.id);
            middle.items.forEach(bottom => {
              idChecker.checkId(bottom.id);
            });
          });
        });
        const problems = idChecker.getProblems();
        if (problems.length !== 0) {
          return reject(problems);
        }
        let taxonomy = [];
        document.forEach(top => {
          let middleTier = [];
          top.items.forEach(middle => {
            let bottomTier = [];
            middle.items.forEach(bottom => {
              bottomTier.push({
                id: parseInt(bottom.id, 10),
                title: bottom.title
              });
            });
            middleTier.push({
              id: parseInt(middle.id, 10),
              title: middle.title,
              items: bottomTier
            });
          });
          taxonomy.push({
            id: parseInt(top.id, 10),
            title: top.title,
            items: middleTier
          });
        });
        resolve(taxonomy);
      })
      .catch(reject);
  });
}

exports.parsingTaxonomyInjection = parsingTaxonomyInjection;
