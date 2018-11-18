'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const {putUserData} = require('server/user');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const cookieTable = constants.cookies.table;
const uuidv4 = require('uuid/v4');
const objectStore = require('server/objectStore');
const ms_OneMonth = 30 * 24 * 60 * 60 * 1000;

router
  .route('/:id')
  //
  // GET /v1/test-login
  //
  .get(
    asyncMiddleware(async (req, res) => {
      const loginToken = uuidv4();
      const openplatformId = req.params.id;
      const openplatformToken = req.params.id;

      try {
        let userId = -1;

        await knex(cookieTable).insert({
          cookie: loginToken,
          community_profile_id: userId, // TODO remove this when users migrated
          openplatform_id: openplatformId,
          openplatform_token: openplatformToken,
          expires_epoch_s: Math.ceil((Date.now() + ms_OneMonth) / 1000)
        });
        console.log('after cookie insertion ');

        req.cookies['login-token'] = loginToken;
        console.log('loginToken ', loginToken);

        if (
          userId === -1 &&
          (await objectStore.find({
            type: 'USER_PROFILE',
            owner: openplatformId,
            limit: 1
          })).data.length === 0
        ) {
          await putUserData(
            {
              name: openplatformId,
              roles: [],
              openplatformId,
              shortlist: [],
              profiles: [],
              lists: [],
              acceptedAge: true,
              acceptedTerms: true
            },
            req
          );
        }
        console.log('  !!!!  COSTANTS.pages.start', constants.pages.start);
        return res
          .status(303)
          .location('http://localhost:3000/')
          .cookie('login-token', loginToken, {
            httpOnly: true
            /* TODO: add "secure: true" in production? */
            /* maxAge is not set, hence the cookie is removed when user closes browser (like it is in Hejmdal) */
          })
          .send();
      } catch (error) {
        console.log('ERRORRRR', constants.pages.generalError);
        let errorMsg = JSON.stringify(error);
        if (errorMsg === '{}') {
          errorMsg = error.toString();
        }
        return res.status(400).send(error);
      }
    })
  );

/*

router
  .route('/login/:id')
  //
  // GET /v1/login
  //
  .get(
    asyncMiddleware(async (req, res, next) => {
      const openplatformId = req.params.id;
      const userData = {
        name: ''+Math.floor(Math.random()*(999-100+1)+100)     ,
        roles: [],
        openplatformToken: '69640cb14e1d51b29a7e9b31e663ea3d4c4ac201',
        openplatformId: openplatformId || '',
        profiles: [],
        lists: [],
        shortlist: [],
        admin: false
      };

  await knex(cookieTable).insert([
    {
      cookie: 'login-tokden',
      community_profile_id: 123456,
      openplatform_id: '123openplatformId456',
      openplatform_token: '123openplatformToken456',
      expires_epoch_s: Math.ceil(Date.now() / 1000) + 10000
    }
  ]);
  await addUserProfileObjects({
    profileId: 123456,
    openplatformId: '123openplatformId456'
  });

      return res.status(200).json(userData);
    })
  );*/

module.exports = router;
/*
        let loginInfo={
            userid: "7183532906",
            pin: "2635",
            library:"Ishøj bibliotek"
        }
*/

/*  let reqUser = { id: -1,
      openplatformToken: '69640cb14e1d51b29a7e9b31e663ea3d4c4ac201',
      openplatformId: '8Iw+LS3umMJAwx2nFIDcwytFN0LUE5qO',
      admin: false };

      let reqst = {cookies:{}};
      reqst.cookies['login-token'] ='231b98a4-e165-4be7-a97a-d3f7694042ce';

      await putUserData(userData, reqst);
      return res.status(200).json({
        data: "await getUserData({req})",
      });
      */
/*
     async function addUserProfileObjects({profileId, openplatformId}) {
      const userProfile = {
        id: profileId,
        created_epoch: 1517919638,
        name: `testuser ${profileId}`,
        openplatformId,
        image: 'b667c0cd-94ef-4732-b740-43cf8340511a',
        roles: [],
        acceptedTerms: true,
        profiles: [],
        lists: [
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: openplatformId,
              public: true,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Har læst',
              description: 'En liste over læste bøger',
              list: []
            },
            links: {self: '/v1/lists/830e113a-e2f3-44a6-8d4c-3918668b5769'}
          },
          {
            data: {
              created_epoch: 1522753045,
              modified_epoch: 1522753045,
              owner: openplatformId,
              public: true,
              social: false,
              open: false,
              type: 'SYSTEM_LIST',
              title: 'Vil læse',
              description: 'En liste over bøger jeg gerne vil læse',
              list: []
            },
            links: {self: '/v1/lists/7c4a330b-750f-460a-8b17-00bab11a2c6f'}
          }
        ]
      };
      const userShortlist = {
        shortlist: [
          {pid: '870970-basis:52041082', origin: 'Fra "En god bog"'},
          {pid: '870970-basis:26296218', origin: 'Fra "En god bog"'},
          {pid: '870970-basis:52817757', origin: 'Fra "En god bog"'}
        ]
      };

      await knex(objectTable)
        .where('owner', openplatformId)
        .del();
      await knex(objectTable).insert([
        {
          id: 'bcdf3130-6ee5-11e8-9bfb-770000000001',
          rev: '1520339806500-lqkal2jnjn',
          owner: openplatformId,
          type: 'USER_SHORTLIST',
          key: '',
          public: false,
          created: 1528879363,
          modified: 1530533989,
          data: userShortlist
        },
        {
          id: 'bcdf3130-6ee5-11e8-9bfb-770000000002',
          rev: '1520339806512-lqkal2jnmm',
          owner: openplatformId,
          type: 'USER_PROFILE',
          key: '',
          public: true,
          created: 1528879363,
          modified: 1530533989,
          data: userProfile
        }
      ]);
     }*/
