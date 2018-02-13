'use strict';

const request = require('superagent');
const path = require('path');
const schemaHealth = absSchemaPath('elvis-health-out');
const schemaElvisCommunityData = absSchemaPath('elvis-community-data');
const schemaCommunityProfileIn = absSchemaPath('connector-profile-in');
const schemaCommunityListIn = absSchemaPath('connector-list-in');
const schemaCommunityUpdateListIn = absSchemaPath('connector-update-list-in');
const schemaElvisProfileData = absSchemaPath('elvis-profile-data');
const schemaElvisEntityQueryData = absSchemaPath('elvis-entity-query-data');
const schemaElvisSimpleEntityQueryData = absSchemaPath(
  'elvis-simple-entity-query-data'
);
const schemaElvisSingletonEntityQueryData = absSchemaPath(
  'elvis-singleton-entity-query-data'
);
const schemaElvisEntityGetData = absSchemaPath('elvis-entity-get-data');
const schemaElvisSuccessOut = absSchemaPath('elvis-success-out');
const constants = require('./community-constants')();
const {validating, validatingInput} = require('__/json');
const _ = require('lodash');
const uuidGenerator = require('uuid');

/**
 * DBC Community Service (Elvis).
 */
class Community {
  //
  // Public methods.
  //

  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.clear();
  }

  getName() {
    return 'elvis';
  }

  clear() {
    this.setOk();
    this.errorLog = [];
    this.communityId = null;
  }

  isOk() {
    return this.ok;
  }

  getCurrentError() {
    return this.currentError;
  }

  getErrorLog() {
    return this.errorLog;
  }

  testingConnection() {
    return new Promise(resolve => {
      const me = this;
      request
        .get(`${me.config.url}${constants.apiHealth}`)
        .then(response => {
          return response.body;
        })
        .then(validating(schemaHealth))
        .then(data => {
          if (data.ok) {
            me.setOk();
          } else {
            me.logError(
              `Community service is unhealthy: ${JSON.stringify(data)}`
            );
          }
          return resolve(me.isOk());
        })
        .catch(error => {
          me.interpretAndLogResponseError(error);
          return resolve(me.isOk());
        });
    });
  }

  gettingCommunityId() {
    if (this.communityId) {
      return Promise.resolve(this.communityId);
    }
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request.get(me.getCommunityNameUrl());
        const data = await me.extractingCommunityResult(
          response.body,
          schemaElvisCommunityData
        );
        const communityId = data.id;
        return resolve(me.setCommunityId(communityId));
      } catch (error) {
        if (error.status !== 404) {
          me.interpretAndLogResponseError(error);
          return reject(error);
        }
        await me.creatingCommunity();
        return resolve(me.communityId);
      }
    });
  }

  gettingProfileIdByOpenplatformId(openplatformId) {
    return this.gettingUserByOpenplatformId(openplatformId) // force break
      .then(user => {
        return user.id;
      });
  }

  gettingUserByOpenplatformId(openplatformId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const queryUrl = await me.gettingQueryUrl();
        const response = await request.post(queryUrl).send({
          Profile: {'attributes.openplatform_id': openplatformId},
          Include: {
            id: 'id',
            created_epoch: 'created_epoch',
            name: 'name',
            roles: 'attributes.roles',
            openplatformId: 'attributes.openplatform_id',
            openplatformToken: 'attributes.openplatform_token',
            image: 'attributes.images'
          }
        });
        await validatingInput(response.body, schemaElvisSuccessOut);
        const user = response.body.data;
        user.roles = user.roles || [];
        return resolve(user);
      } catch (error) {
        if (error.status === 400) {
          let meta = {};
          if (error.response && error.response.text) {
            if (error.response.text.match(/several results/i)) {
              meta.debug = `Multiple users have id ${openplatformId}`;
            }
          }
          return reject({
            status: 404,
            title: 'User not found',
            detail: `User ${openplatformId} does not exist or is deleted`,
            meta
          });
        }
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  updatingProfileWithShortlistAndTastes(profileId, document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityProfileIn);
      } catch (error) {
        return reject(error);
      }
      try {
        const profileUrl = await me.gettingProfileIdUrl(profileId);
        const update = Object.assign({modified_by: profileId}, document);
        const response = await request.put(profileUrl).send(update);
        const data = await me.extractingCommunityResult(
          response.body,
          schemaElvisProfileData
        );
        return resolve(data);
      } catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingIdsOfAllListEntitiesOwnedByUserWithProfileId(profileId) {
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
        const data = await me.extractingCommunityResult(
          body,
          schemaElvisSimpleEntityQueryData
        );
        return resolve(data.List);
      } catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingAllListEntitiesOwnedByProfileId(profileId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const queryUrl = await me.gettingQueryUrl();
        const query = {
          Entities: {type: 'list', owner_id: profileId},
          Limit: 999,
          Include: {
            entity_id: 'id',
            created_epoch: 'created_epoch',
            modified_epoch: 'modified_epoch',
            profile_id: 'owner_id',
            owner: {
              Profile: {id: '^owner_id'},
              Include: 'attributes.openplatform_id'
            },
            // TODO: also extract Profile name & image, created_epoch modified_epoch
            uuid: 'attributes.uuid',
            public: 'attributes.public',
            type: 'attributes.type',
            title: 'title',
            description: 'contents',
            list: 'attributes.list'
          }
        };
        const {body} = await request.post(queryUrl).send(query);
        const data = await me.extractingCommunityResult(
          body,
          schemaElvisEntityQueryData
        );
        const lists = _.map(data.List, entry => {
          return {
            data: _.omit(entry, 'uuid', 'profile_id', 'entity_id'),
            links: {
              self: `/v1/lists/${entry.uuid}`,
              uuid: entry.uuid,
              profile_id: entry.profile_id,
              entity_id: entry.entity_id
            }
          };
        });
        return resolve(lists);
      } catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingListByEntityId(entityId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const entityUrl = await me.gettingEntityIdUrl(entityId);
        const {body} = await request.get(entityUrl);
        const data = await me.extractingCommunityResult(
          body,
          schemaElvisEntityGetData
        );
        const list = await me.spikingCommunityListWithOwner(data);
        return resolve(list);
      } catch (error) {
        if (error.status === 404) {
          return reject({
            status: 404,
            title: 'List not found',
            detail: `List ${entityId} does not exist or has been deleted`
          });
        }
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  // TODO move around/refactor
  async query(q) {
    const queryUrl = await this.gettingQueryUrl();
    const {body} = await request.post(queryUrl).send(q);
    if (!body.data) {
      throw new Error('Expected body.data, body=' + JSON.stringify(body));
    }
    return body.data;
  }
  async findObjects(query, user = {}) {
    let result;
    if (!query.type) {
      throw new Error('Query Error');
    }
    const entities = {};
    if (query.owner) {
      entities['attributes.owner'] = query.owner;
      if (user.openplatformId !== query.owner && !user.admin) {
        return {
          data: {error: 'forbidden'},
          errors: [{status: 403, message: 'forbidden'}]
        };
      }
    } else if (query.key) {
      entities['attributes.key'] = query.key;
      entities['attributes.public'] = true;
    } else {
      throw new Error('Query Error');
    }
    try {
      result = await this.query({
        Entities: entities,
        SortBy: 'modified_epoch',
        Order: 'descending',
        Limit: +query.limit || 10,
        Offset: +query.offset || 0,
        Include: {
          json: 'contents'
        }
      });
      result = result.List.map(o => JSON.parse(o.json));
    } catch (e) {
      throw e;
    }
    return {data: result};
  }
  async putObject({object, user}) {
    object = Object.assign({}, object);

    let prevObject;

    if (object._id) {
      try {
        prevObject = await this.query({
          Entity: {
            type: 'object',
            'attributes.id': object._id
          },
          Include: {
            id: 'id',
            owner: {
              Profile: {id: '^owner_id'},
              Include: 'attributes.openplatform_id'
            },
            owner_id: 'owner_id',
            json: 'contents'
          }
        });
        prevObject.json = JSON.parse(prevObject.json);
      } catch (e) {
        return {
          data: {error: 'not found'},
          errors: [{status: 404, message: 'not found'}]
        };
      }
    } else {
      object._id = uuidGenerator.v1();
    }

    if (
      !user.admin &&
      prevObject &&
      prevObject.json.owner !== user.openplatformId
    ) {
      return {
        data: {error: 'forbidden'},
        errors: [{status: 403, message: 'forbidden'}]
      };
    }
    if (object._rev && prevObject && object._rev !== prevObject.json._rev) {
      return {
        data: {error: 'conflict'},
        errors: [{status: 409, message: 'conflict'}]
      };
    }

    object._rev =
      Date.now() +
      '-' +
      Math.random()
        .toString(36)
        .slice(2);
    object.owner = (prevObject && prevObject.json.owner) || user.openplatformId;

    const entity = {
      type: 'object',
      contents: JSON.stringify(object),
      attributes: {
        type: typeof object.type === 'string' ? object.type : '',
        key: typeof object.key === 'string' ? object.key : '',
        owner: object.owner,
        public: !!object.public,
        id: object._id
      }
    };

    if (prevObject) {
      entity.modified_by = user.id;
      const entityUrl = await this.gettingEntityIdUrl(prevObject.id);
      await request.put(entityUrl).send(entity);
    } else {
      entity.owner_id = prevObject ? prevObject.owner_id : user.id;
      entity.title = '';
      const entityUrl = await this.gettingPostEntityUrl();
      await request.post(entityUrl).send(entity);
    }
    return {data: {ok: true, id: object._id, rev: object._rev}};
  }
  async getObjectById(id, user = {}) {
    let result;
    try {
      result = JSON.parse(
        (await this.query({
          Entity: {'attributes.id': id},
          Include: {
            json: 'contents'
          }
        })).json
      );
    } catch (e) {
      // TODO load/transform unmigrated data here
      /*
      try ...
      return await this.query({
        Entity: {'attributes.uuid': id},
        Include: {
        ...
          owner: {
            Profile: {id: '^owner_id'},
            Include: 'attributes.openplatform_id'
          }
        }
      })
      catch ...
      */
      return {
        data: {error: 'not found'},
        errors: [{status: 404, message: 'not found'}]
      };
    }
    if (!result.public && !user.admin && user.openplatformId !== result.owner) {
      return {
        data: {error: 'forbidden'},
        errors: [{status: 403, message: 'forbidden'}]
      };
    }
    return {data: result};
  }

  gettingListEntityByUuid(uuid) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const queryUrl = await me.gettingQueryUrl();
        const query = {
          Entity: {
            type: 'list',
            'attributes.uuid': uuid
          },
          Include: {
            entity_id: 'id',
            created_epoch: 'created_epoch',
            modified_epoch: 'modified_epoch',
            type: 'attributes.type',
            title: 'title',
            description: 'contents',
            profile_id: 'owner_id',
            uuid: 'attributes.uuid',
            owner: {
              Profile: {id: '^owner_id'},
              Include: 'attributes.openplatform_id'
            },
            list: 'attributes.list',
            public: 'attributes.public'
          }
        };
        const {body} = await request.post(queryUrl).send(query);
        const data = await me.extractingCommunityResult(
          body,
          schemaElvisSingletonEntityQueryData
        );
        const result = {
          data: _.omit(data, ['uuid', 'profile_id', 'entity_id']),
          links: {
            self: `/v1/lists/${data.uuid}`,
            uuid,
            profile_id: data.profile_id,
            entity_id: data.entity_id
          }
        };
        return resolve(result);
      } catch (error) {
        if (error.status === 400) {
          let info = error;
          if (info.response) {
            info = info.response;
          }
          if (info.body) {
            info = info.body;
          }
          if (info.errors && info.errors[0] && info.errors[0].detail) {
            const detail = info.errors[0].detail;
            if (detail.match(/no result/i)) {
              return reject({
                status: 404,
                title: 'List not found',
                detail: `List ${uuid} does not exist or has been deleted`
              });
            }
          }
        }
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  creatingUserProfile(document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityProfileIn);
      } catch (error) {
        return reject(error);
      }
      try {
        const profileUrl = await me.gettingPostProfileUrl();
        const {body} = await request.post(profileUrl).send(document);
        const data = await me.extractingCommunityResult(
          body,
          schemaElvisProfileData
        );
        return resolve(data);
      } catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  creatingListEntity(profileId, document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityListIn);
      } catch (error) {
        return reject(error);
      }
      try {
        const ownedList = Object.assign({owner_id: profileId}, document);
        const entityUrl = await me.gettingPostEntityUrl();
        const response = await request.post(entityUrl).send(ownedList);
        await validatingInput(response.body, schemaElvisSuccessOut);
        const data = await me.extractingCommunityResult(
          response.body,
          schemaElvisEntityGetData
        );
        const list = await me.spikingCommunityListWithOwner(data);
        return resolve(list);
      } catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  updatingListEntity(profileId, entityId, document) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaCommunityUpdateListIn);
      } catch (error) {
        return reject(error);
      }
      try {
        const entityUrl = await me.gettingEntityIdUrl(entityId);
        const update = Object.assign({modified_by: profileId}, document);
        const response = await request.put(entityUrl).send(update);
        await validatingInput(response.body, schemaElvisSuccessOut);
        const data = await me.extractingCommunityResult(
          response.body,
          schemaElvisEntityGetData
        );
        const list = await me.spikingCommunityListWithOwner(data);
        return resolve(list);
      } catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  deletingListEntity(profileId, entityId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const entityUrl = await me.gettingEntityIdUrl(entityId);
        // A deletion is done by only sending a modified_by.
        const update = {modified_by: profileId};
        const response = await request.put(entityUrl).send(update);
        await validatingInput(response.body, schemaElvisSuccessOut);
        return resolve(response.body);
      } catch (error) {
        if (error.status === 400) {
          if (error.response && error.response.text) {
            if (error.response.text.match(/entity.+not belong to community/i)) {
              return reject(`List ${entityId} does not exist`);
            }
          }
        }
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingUserByProfileId(profileId) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const profileUrl = await me.gettingProfileIdUrl(profileId);
        const response = await request.get(profileUrl);
        const profile = await me.extractingCommunityResult(
          response.body,
          schemaElvisProfileData
        );
        const roles = profile.attributes.roles || [];
        const toReturn = {
          name: profile.name,
          image: profile.attributes.image,
          acceptedTerms: profile.attributes.acceptedTerms,
          roles,
          openplatformId: profile.attributes.openplatform_id,
          openplatformToken: profile.attributes.openplatform_token,
          shortlist: profile.attributes.shortlist,
          profiles: me.transformTastesToFrontendProfiles(
            profile.attributes.tastes
          )
        };
        return resolve(toReturn);
      } catch (error) {
        if (error.status === 404) {
          if (error.response) {
            if (error.response.body) {
              return reject(error.response.body);
            }
          }
          return reject(error);
        }
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  gettingPublicLists(limit, offset = 0) {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const queryUrl = await me.gettingQueryUrl();
        const {body} = await request.post(queryUrl).send({
          Entities: {type: 'list', 'attributes.public': true},
          SortBy: 'created_epoch',
          Order: 'descending',
          Limit: limit,
          Offset: offset,
          Include: {
            entity_id: 'id',
            created_epoch: 'created_epoch',
            modified_epoch: 'modified_epoch',
            profile_id: 'owner_id',
            uuid: 'attributes.uuid',
            // TODO: also extract Profile name & image, created_epoch modified_epoch
            owner: {
              Profile: {id: '^owner_id'},
              Include: 'attributes.openplatform_id'
            },
            public: 'attributes.public',
            type: 'attributes.type',
            title: 'title',
            description: 'contents',
            list: 'attributes.list'
          }
        });
        const data = await me.extractingCommunityResult(
          body,
          schemaElvisEntityQueryData
        );
        const lists = _.map(data.List, entry => {
          return {
            data: _.omit(entry, 'uuid', 'profile_id', 'entity_id'),
            links: {
              self: `/v1/lists/${entry.uuid}`,
              uuid: entry.uuid,
              profile_id: entry.profile_id,
              entity_id: entry.entity_id
            }
          };
        });
        return resolve({
          lists,
          total: data.Total,
          next_offset: data.NextOffset
        });
      } catch (error) {
        me.interpretAndLogResponseError(error);
        return reject(error);
      }
    });
  }

  //
  // Private testing methods.
  //

  setCommunityId(id) {
    this.communityId = id;
    return this.communityId;
  }

  //
  // Private methods.
  //

  setOk() {
    this.ok = true;
    this.currentError = null;
  }

  logError(error) {
    this.ok = false;
    this.currentError = 'Community-service communication failed';
    let logEntry = JSON.stringify(error);
    if (logEntry === '{}') {
      logEntry = error.toString();
    }
    this.errorLog.push(new Date().toISOString() + ': ' + logEntry);
  }

  interpretAndLogResponseError(error) {
    if (error.status >= 500) {
      this.logError('Community service is unhealthy');
    } else {
      this.logError(error);
    }
  }

  getCommunityNameUrl() {
    return `${this.config.url}${constants.apiCommunity}/${this.config.name}`;
  }

  extractingCommunityResult(document, schema) {
    return new Promise(async (resolve, reject) => {
      try {
        await validatingInput(document, schemaElvisSuccessOut);
        const data = document.data;
        await validatingInput(data, schema);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  gettingQueryUrl() {
    return this.gettingCommunityId() // force break
      .then(communityId => {
        const endpoint = constants.apiQuery(communityId);
        return `${this.config.url}${endpoint}`;
      });
  }

  creatingCommunity() {
    const me = this;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request
          .post(`${me.config.url}${constants.apiCommunity}`)
          .send({name: me.config.name});
        const data = await me.extractingCommunityResult(
          response.body,
          schemaElvisCommunityData
        );
        me.setCommunityId(data.id);
        return resolve(me.communityId);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async spikingCommunityListWithOwner(document) {
    const list = this.fromCommunityList(document);
    try {
      // TODO: It is somewhat wasteful to get all this Profile data just to
      // get the openplatformId.  There should probably be a
      // gettingOpenplatformIdByProfileId function.
      const result = await this.gettingUserByProfileId(document.owner_id);
      list.data.owner = result.openplatformId;
    } catch (error) {
      return Promise.reject(error);
    }
    return list;
  }

  fromCommunityList(document) {
    return {
      data: {
        created_epoch: document.created_epoch,
        modified_epoch: document.modified_epoch,
        type: document.attributes.type,
        title: document.title,
        description: document.contents,
        list: document.attributes.list,
        public: document.attributes.public
      },
      links: {
        self: `/v1/lists/${document.attributes.uuid}`,
        uuid: document.attributes.uuid,
        profile_id: document.owner_id,
        entity_id: document.id
      }
    };
  }

  gettingProfileIdUrl(profileId) {
    return this.gettingCommunityId() // force break
      .then(communityId => {
        const endpoint = constants.apiProfileId(communityId, profileId);
        return `${this.config.url}${endpoint}`;
      });
  }

  gettingPostProfileUrl() {
    return this.gettingCommunityId() // force break
      .then(communityId => {
        const endpoint = constants.apiPostProfile(communityId);
        return `${this.config.url}${endpoint}`;
      });
  }

  gettingPostEntityUrl() {
    return this.gettingCommunityId() // force break
      .then(communityId => {
        const endpoint = constants.apiPostEntity(communityId);
        return `${this.config.url}${endpoint}`;
      });
  }

  gettingEntityIdUrl(entityId) {
    return this.gettingCommunityId() // force break
      .then(communityId => {
        const endpoint = constants.apiEntityId(communityId, entityId);
        return `${this.config.url}${endpoint}`;
      });
  }

  transformTastesToFrontendProfiles(tastes) {
    return _.map(tastes, taste => {
      return {
        name: taste.name,
        profile: _.omit(taste, 'name')
      };
    });
  }
}

function absSchemaPath(schema) {
  return path.join(__dirname, 'schemas', schema);
}

module.exports = Community;
