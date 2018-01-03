'use strict';

const request = require('superagent');
const path = require('path');
const schemaHealth = path.join(__dirname, './schemas/elvis-health-out.json');
const schemaElvisCommunityData = path.join(__dirname, './schemas/elvis-community-data.json');
const schemaCommunityProfileIn = path.join(__dirname, './schemas/connector-profile-in.json');
const schemaCommunityListIn = path.join(__dirname, './schemas/connector-list-in.json');
const schemaCommunityUpdateListIn = path.join(__dirname, './schemas/connector-update-list-in.json');
const schemaElvisProfileData = path.join(__dirname, './schemas/elvis-profile-data.json');
const schemaElvisEntityQueryData = path.join(__dirname, './schemas/elvis-entity-query-data.json');
const schemaElvisSimpleEntityQueryData = path.join(__dirname, './schemas/elvis-simple-entity-query-data.json');
const schemaElvisSuccessOut = path.join(__dirname, './schemas/elvis-success-out.json');
const constants = require('./community-constants')();
const {validating, validatingInput} = require('__/json');
const _ = require('lodash');

/**
 * DBC Community Service (Elvis).
 */
class Community {
  //
  // Public methods.
  //

  print (msg, document) {
    console.log(msg); // eslint-disable-line no-console
    const util = require('util');
    console.log(util.inspect(document, {depth: 3})); // eslint-disable-line no-console
  }

  constructor (config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName () {
    return 'elvis';
  }

  clear () {
    this.setOk();
    this.errorLog = [];
    this.communityId = null;
  }

  isOk () {
    return this.ok;
  }

  getCurrentError () {
    return this.currentError;
  }

  getErrorLog () {
    return this.errorLog;
  }

  testingConnection () {
    return new Promise(resolve => {
      const me = this;
      request.get(`${me.config.url}${constants.apiHealth}`)
      .then(response => {
        return response.body;
      })
      .then(validating(schemaHealth))
      .then(data => {
        if (data.ok) {
          me.setOk();
        }
        else {
          me.logError(`Community service is unhealthy: ${JSON.stringify(data)}`);
        }
        return resolve(me.isOk());
      })
      .catch(error => {
        me.interpretAndLogResponseError(error);
        return resolve(me.isOk());
      });
    });
  }

  gettingCommunityId () {
    if (this.communityId) {
      return Promise.resolve(this.communityId);
    }
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request.get(me.getCommunityNameUrl());
        const data = await me.extractingCommunityResult(response.body, schemaElvisCommunityData);
        const communityId = data.id;
        return resolve(me.setCommunityId(communityId));
      }
      catch (error) {
        if (error.status !== 404) {
          me.interpretAndLogResponseError(error);
          return reject(error);
        }
        await me.creatingCommunity();
        return resolve(me.communityId);
      }
    });
  }

  gettingProfileIdByUserIdHash (userIdHash) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const queryUrl = await me.gettingQueryUrl();
        const response = await request.post(queryUrl).send({
          Profile: {'attributes.user_id': userIdHash},
          Include: 'id'
        });
        await validatingInput(response.body, schemaElvisSuccessOut);
        return resolve(response.body.data);
      }
      catch (error) {
        if (error.status === 400) {
          if (error.response && error.response.text) {
            if (error.response.text.match(/several results/i)) {
              return reject(`Multiple users have id ${userIdHash}`);
            }
          }
          return reject(`User ${userIdHash} not found`);
        }
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });

  }

  updatingProfileWithShortlistAndTastes (profileId, document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityProfileIn);
      }
      catch (error) {
        return reject(error);
      }
      try {
        const profileUrl = await me.gettingProfileIdUrl(profileId);
        const update = Object.assign({modified_by: profileId}, document);
        const response = await request.put(profileUrl).send(update);
        const data = await me.extractingCommunityResult(response.body, schemaElvisProfileData);
        return resolve(data);
      }
      catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingIdsOfAllListEntitiesOwnedByUserWithProfileId (profileId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const queryUrl = await me.gettingQueryUrl();
        const {body} = await request.post(queryUrl).send({
          Entities: {type: 'list', owner_id: profileId},
          Limit: 999,
          Include: {entity_id: 'id', id: 'attributes.uuid'}
        });
        await validatingInput(body, schemaElvisSuccessOut);
        const data = await me.extractingCommunityResult(body, schemaElvisSimpleEntityQueryData);
        return resolve(data.List);
      }
      catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingAllListEntitiesOwnedByProfileId (profileId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const queryUrl = await me.gettingQueryUrl();
        const {body} = await request.post(queryUrl).send({
          Entities: {type: 'list', owner_id: profileId},
          Limit: 999,
          Include: {
            id: 'attributes.uuid',
            public: 'attributes.public',
            type: 'attributes.type',
            title: 'title',
            description: 'contents',
            list: 'attributes.list'
          }
        });
        const data = await me.extractingCommunityResult(body, schemaElvisEntityQueryData);
        return resolve(data.List);
      }
      catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  creatingUserProfile (document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityProfileIn);
      }
      catch (error) {
        return reject(error);
      }
      try {
        const profileUrl = await me.gettingPostProfileUrl();
        const {body} = await request.post(profileUrl).send(document);
        const data = await me.extractingCommunityResult(body, schemaElvisProfileData);
        return resolve(data);
      }
      catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  creatingListEntity (profileId, document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityListIn);
      }
      catch (error) {
        return reject(error);
      }
      try {
        const ownedList = Object.assign({owner_id: profileId}, document);
        const entityUrl = await me.gettingPostEntityUrl();
        const response = await request.post(entityUrl).send(ownedList);
        await validatingInput(response.body, schemaElvisSuccessOut);
        return resolve(response.body);
      }
      catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  updatingListEntity (profileId, entityId, document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityUpdateListIn);
      }
      catch (error) {
        return reject(error);
      }
      try {
        const entityUrl = await me.gettingPutEntityUrl(entityId);
        const update = Object.assign({modified_by: profileId}, document);
        const response = await request.put(entityUrl).send(update);
        await validatingInput(response.body, schemaElvisSuccessOut);
        return resolve(response.body);
      }
      catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingUserByProfileId (profileId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const profileUrl = await me.gettingProfileIdUrl(profileId);
        const resp = await request.get(profileUrl);
        const body = resp.body;
        const profile = await me.extractingCommunityResult(body, schemaElvisProfileData);
        const toReturn = {
          name: profile.name,
          shortlist: profile.attributes.shortlist,
          profiles: me.transformTastesToFrontendProfiles(profile.attributes.tastes)
        };
        toReturn.lists = await me.gettingAllListEntitiesOwnedByProfileId(profileId);
        return resolve(toReturn);
      }
      catch (error) {
        if (error.status === 404) {
          return reject(error.response.body);
        }
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  //
  // Private testing methods.
  //

  setCommunityId (id) {
    this.communityId = id;
    return this.communityId;
  }

  //
  // Private methods.
  //

  setOk () {
    this.ok = true;
    this.currentError = null;
  }

  logError (error) {
    this.ok = false;
    this.currentError = 'Community-service communication failed';
    let logEntry = JSON.stringify(error);
    if (logEntry === '{}') {
      logEntry = error.toString();
    }
    this.errorLog.push(
      (new Date()).toISOString() + ': ' + logEntry
    );
  }

  interpretAndLogResponseError (error) {
    if (error.status >= 500) {
      this.logError('Community service is unhealthy');
    }
    else {
      this.logError(error);
    }
  }

  getCommunityNameUrl () {
    return `${this.config.url}${constants.apiCommunity}/${this.config.name}`;
  }

  extractingCommunityResult (document, schema) {
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaElvisSuccessOut);
        const data = document.data;
        await validatingInput(data, schema);
        resolve(data);
      }
      catch (error) {
        reject(error);
      }
    });
  }

  gettingQueryUrl () {
    return this.gettingCommunityId()
    .then(communityId => {
      const endpoint = constants.apiQuery(communityId);
      return `${this.config.url}${endpoint}`;
    });
  }

  creatingCommunity () {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request
          .post(`${me.config.url}${constants.apiCommunity}`)
          .send({name: me.config.name});
        const data = await me.extractingCommunityResult(response.body, schemaElvisCommunityData);
        me.setCommunityId(data.id);
        return resolve(me.communityId);
      }
      catch (error) {
        return reject(error);
      }
    });
  }

  gettingProfileIdUrl (profileId) {
    return this.gettingCommunityId()
    .then(communityId => {
      const endpoint = constants.apiProfileId(communityId, profileId);
      return `${this.config.url}${endpoint}`;
    });
  }

  gettingPostProfileUrl () {
    return this.gettingCommunityId()
    .then(communityId => {
      const endpoint = constants.apiPostProfile(communityId);
      return `${this.config.url}${endpoint}`;
    });
  }

  gettingPostEntityUrl () {
    return this.gettingCommunityId()
    .then(communityId => {
      const endpoint = constants.apiPostEntity(communityId);
      return `${this.config.url}${endpoint}`;
    });
  }

  gettingPutEntityUrl (entityId) {
    return this.gettingCommunityId()
    .then(communityId => {
      const endpoint = constants.apiEntityId(communityId, entityId);
      return `${this.config.url}${endpoint}`;
    });
  }

  transformTastesToFrontendProfiles (tastes) {
    return _.map(tastes, taste => {
      return {
        name: taste.name,
        profile: _.omit(taste, 'name')
      };
    });
  }
}

module.exports = Community;
