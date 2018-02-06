'use strict';

module.exports = {
  contentFirstUserToCommunityProfileAndEntities,
  contentFirstListToCommunityEntity
};

const _ = require('lodash');

function contentFirstUserToCommunityProfileAndEntities(userInfo) {
  let skeleton = {
    profile: {
      attributes: {}
    }
  };
  if (userInfo.openplatformId) {
    skeleton.profile.attributes.openplatform_id = userInfo.openplatformId;
  }
  if (userInfo.openplatformToken) {
    skeleton.profile.attributes.openplatform_token = userInfo.openplatformToken;
  }
  if (userInfo.name) {
    skeleton.profile.name = userInfo.name;
  }
  if (userInfo.shortlist) {
    skeleton.profile.attributes.shortlist = userInfo.shortlist;
  }
  if (userInfo.profiles) {
    skeleton.profile.attributes.tastes = _.map(
      userInfo.profiles,
      contentFirstProfileToCommunityAttribute
    );
  }
  if (userInfo.roles) {
    skeleton.profile.attributes.roles = userInfo.roles;
  }
  if (userInfo.image) {
    skeleton.profile.attributes.image = userInfo.image;
  }
  if (userInfo.lists) {
    skeleton.lists = contentFirstListsToCommunityEntities(userInfo.lists);
  }
  return skeleton;
}

function contentFirstListsToCommunityEntities(lists) {
  return _.map(lists, contentFirstListToCommunityEntity);
}

function contentFirstProfileToCommunityAttribute(profile) {
  return {
    name: profile.name,
    moods: profile.profile.moods,
    authors: profile.profile.authors,
    genres: profile.profile.genres,
    archetypes: profile.profile.archetypes
  };
}

function contentFirstListToCommunityEntity(list) {
  return {
    type: 'list',
    title: list.title,
    contents: list.description,
    attributes: {
      uuid: list.id,
      public: list.public || false,
      type: list.type,
      list: list.list
    }
  };
}
