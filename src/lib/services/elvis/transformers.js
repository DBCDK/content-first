'use strict';

module.exports = {
  divideListsIntoCreateUpdateAndDeleteForProfileId,
  transformFrontendUserToProfileAndEntities
};

const _ = require('lodash');

function divideListsIntoCreateUpdateAndDeleteForProfileId (newEntities, existingEntities, profileId) {
  const existingUuids = _.map(existingEntities, entity => entity.uuid);
  const newUuids = _.map(newEntities, entry => entry.attributes.uuid);

  const uuidsToDelete = _.difference(existingUuids, newUuids);
  const uuidsToCreate = _.difference(newUuids, existingUuids);
  const uuidsToUpdate = _.intersection(newUuids, existingUuids);

  const entitiesToCreate = _.map(
    _.filter(newEntities, entity => uuidsToCreate.includes(entity.attributes.uuid)),
    entity => Object.assign(entity, {owner_id: profileId})
  );

  const partition = _.partition(existingEntities, entity => uuidsToDelete.includes(entity.uuid));
  const idsToDelete = _.map(partition[0], entry => entry.id);

  const entriesToUpdate = partition[1];
  const entitiesToUpdate = _.map(
    _.filter(newEntities, entity => uuidsToUpdate.includes(entity.attributes.uuid)),
    entity => Object.assign(entity, {id: _.find(entriesToUpdate, entry => entry.uuid === entity.attributes.uuid).id})
  );

  return {
    toCreate: entitiesToCreate,
    toUpdate: entitiesToUpdate,
    toDelete: idsToDelete
  };
}

function transformFrontendUserToProfileAndEntities (userInfo) {
  let skeleton = {
    profile: {
      name: userInfo.name,
      attributes: {
        shortlist: userInfo.shortlist,
        tastes: _.map(userInfo.profiles, transformProfileToTaste)
      }
    },
    lists: _.map(userInfo.lists, transformListToList)
  };
  return skeleton;
}

function transformProfileToTaste (profile) {
  return {
    name: profile.name,
    moods: profile.profile.moods,
    authors: profile.profile.authors,
    genres: profile.profile.genres,
    archetypes: profile.profile.archetypes
  };
}

function transformListToList (list) {
  return {
    type: 'list',
    title: list.title,
    contents: list.description,
    attributes: {
      uuid: list.id,
      public: false,
      list: list.list
    }
  };
}
