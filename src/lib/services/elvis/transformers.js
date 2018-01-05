'use strict';

module.exports = {
  divideListsIntoCreateUpdateAndDeleteForProfileId,
  transformFrontendUserToProfileAndEntities,
  transformListsToLists
};

const _ = require('lodash');

function divideListsIntoCreateUpdateAndDeleteForProfileId(
  newEntities,
  existingEntities,
  profileId
) {
  const existingUuids = _.map(existingEntities, entity => entity.id);
  const newUuids = _.map(newEntities, entry => entry.attributes.uuid);

  const uuidsToDelete = _.difference(existingUuids, newUuids);
  const uuidsToCreate = _.difference(newUuids, existingUuids);
  const uuidsToUpdate = _.intersection(newUuids, existingUuids);

  const entitiesToCreate = _.map(
    _.filter(newEntities, entity =>
      uuidsToCreate.includes(entity.attributes.uuid)
    ),
    entity => Object.assign({owner_id: profileId}, entity)
  );

  const partition = _.partition(existingEntities, entity =>
    uuidsToDelete.includes(entity.id)
  );
  const idsToDelete = _.map(partition[0], entry => entry.entity_id);

  const entriesToUpdate = partition[1];
  const entitiesToUpdate = _.map(
    _.filter(newEntities, entity =>
      uuidsToUpdate.includes(entity.attributes.uuid)
    ),
    entity =>
      Object.assign(
        {
          id: _.find(
            entriesToUpdate,
            entry => entry.id === entity.attributes.uuid
          ).entity_id
        },
        entity
      )
  );

  return {
    toCreate: entitiesToCreate,
    toUpdate: entitiesToUpdate,
    toDelete: idsToDelete
  };
}

function transformFrontendUserToProfileAndEntities(userInfo) {
  let skeleton = {
    profile: {
      attributes: {}
    }
  };
  if (userInfo.name) {
    skeleton.profile.name = userInfo.name;
  }
  if (userInfo.shortlist) {
    skeleton.profile.attributes.shortlist = userInfo.shortlist;
  }
  if (userInfo.profiles) {
    skeleton.profile.attributes.tastes = _.map(userInfo.profiles, transformProfileToTaste);
  }
  if (userInfo.lists) {
    skeleton.lists = transformListsToLists(userInfo.lists);
  }
  return skeleton;
}

function transformListsToLists(lists) {
  return _.map(lists, transformListToList);
}

function transformProfileToTaste(profile) {
  return {
    name: profile.name,
    moods: profile.profile.moods,
    authors: profile.profile.authors,
    genres: profile.profile.genres,
    archetypes: profile.profile.archetypes
  };
}

function transformListToList(list) {
  return {
    type: 'list',
    title: list.title,
    contents: list.description,
    attributes: {
      uuid: list.id,
      public: false,
      type: list.type,
      list: list.list
    }
  };
}
