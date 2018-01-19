'use strict';

module.exports = {
  creatingList,
  deletingListByEntityId,
  fetchingEntityAndProfileIdFromListCache,
  gettingListByUuid,
  reservingListForProfileIdInCache,
  updatingList
};

const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const listTable = constants.lists.table;
const community = require('server/community');
const transform = require('__/services/elvis/transformers');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

function deletingListByEntityId(userId, entityId) {
  return new Promise(async (resolve, reject) => {
    try {
      await community.deletingListEntity(userId, entityId);
      return resolve();
    } catch (error) {
      return reject(error);
    }
  });
}

function creatingList(profileId, frontendListWithUuid) {
  const communityList = transform.contentFirstListToCommunityEntity(
    frontendListWithUuid
  );
  return community
    .creatingListEntity(profileId, communityList)
    .then(cachingListEntityId);
}

function cachingListEntityId(listWithCommunityInfo) {
  return new Promise((resolve, reject) => {
    knex(listTable)
      .where('uuid', listWithCommunityInfo.links.uuid)
      .update({community_entity_id: listWithCommunityInfo.links.entity_id})
      .then(() => {
        return resolve(stripOffCommunityLinks(listWithCommunityInfo));
      })
      .catch(error => {
        reject({
          status: 500,
          title: 'Database operation failed',
          detail: error
        });
      });
  });
}

function stripOffCommunityLinks(listPlusCommunityInfo) {
  return _.omit(listPlusCommunityInfo, [
    'links.uuid',
    'links.profile_id',
    'links.entity_id'
  ]);
}

function updatingList(profileId, entityId, frontendListWithUuid) {
  const communityList = transform.contentFirstListToCommunityEntity(
    frontendListWithUuid
  );
  return new Promise((resolve, reject) => {
    community
      .updatingListEntity(profileId, entityId, communityList)
      .then(listWithCommunityInfo => {
        return resolve(stripOffCommunityLinks(listWithCommunityInfo));
      })
      .catch(error => {
        let meta = error;
        if (meta.response) {
          meta = meta.response;
        }
        if (meta.error) {
          meta = meta.error;
        }
        return reject({
          status: 503,
          title: 'Community-service connection problem',
          detail: 'Community service is not reponding properly',
          meta
        });
      });
  });
}

function gettingListByUuid(uuid) {
  return new Promise(async (resolve, reject) => {
    let entityId;
    try {
      const res = await fetchingEntityAndProfileIdFromListCache(uuid);
      entityId = res.entityId;
    } catch (error) {
      if (!error.meta) {
        error.meta = {};
      }
      error.meta.resource = `/v1/lists/${uuid}`;
      reject(error);
    }
    let listPlusCommunityInfo;
    try {
      if (entityId) {
        listPlusCommunityInfo = await community.gettingListByEntityId(entityId);
      } else {
        listPlusCommunityInfo = await community.gettingListEntityByUuid(uuid);
        const links = listPlusCommunityInfo.links;
        await puttingListInCache(links.uuid, links.profile_id, links.entity_id);
      }
    } catch (error) {
      if (!error.meta) {
        error.meta = {};
      }
      error.meta.resource = `/v1/lists/${uuid}`;
      return reject(error);
    }
    return resolve(listPlusCommunityInfo);
  });
}

function puttingListInCache(uuid, profileId, entityId) {
  return new Promise((resolve, reject) => {
    knex(listTable)
      .insert({
        uuid,
        community_profile_id: profileId,
        community_entity_id: entityId
      })
      .then(resolve)
      .catch(error => {
        reject({
          status: 500,
          title: 'Database operation failed',
          detail: error
        });
      });
  });
}

function reservingListForProfileIdInCache(profileId) {
  const uuid = uuidv4();
  return new Promise((resolve, reject) => {
    return knex(listTable)
      .insert({uuid, community_profile_id: profileId})
      .then(() => {
        return resolve(uuid);
      })
      .catch(error => {
        reject({
          status: 500,
          title: 'Database operation failed',
          detail: error
        });
      });
  });
}

/**
 * [fetchingEntityAndProfileIdFromListCache description]
 * @param  {string} uuid         List UUID.
 * @return {profileId, entityId} Ids in Community, all fields null if not found.
 */
function fetchingEntityAndProfileIdFromListCache(uuid) {
  return new Promise((resolve, reject) => {
    return knex(listTable)
      .where('uuid', uuid)
      .select('community_profile_id', 'community_entity_id')
      .then(existing => {
        if (existing.length === 1) {
          return resolve({
            profileId: existing[0].community_profile_id,
            entityId: existing[0].community_entity_id
          });
        }
        return resolve({profileId: null, entityId: null});
      })
      .catch(error => {
        reject({
          status: 500,
          title: 'Database operation failed',
          detail: error
        });
      });
  });
}
