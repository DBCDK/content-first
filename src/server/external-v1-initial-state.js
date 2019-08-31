'use strict';

import listReducer, {LISTS_EXPAND} from '../client/redux/list.reducer';
import userReducer, {
  ON_USER_DETAILS_RESPONSE
} from '../client/redux/user.reducer';

const {getUser, getUserData} = require('server/user');
const objectStore = require('server/objectStore');

const express = require('express');
const router = express.Router({mergeParams: true});

async function initState(req) {
  let listState = listReducer(undefined, {});
  let userState = userReducer(undefined, {});

  if (req.user) {
    userState = userReducer(userState, {
      type: ON_USER_DETAILS_RESPONSE,
      user: {
        ...(await getUserData(req.user.openplatformId, req.user)),
        openplatformToken: req.user.openplatformToken,
        over13: req.user.special.over13,
        tempname: req.user.special.name
      }
    });
    const lists = (await objectStore.find(
      {type: 'list', owner: req.user.openplatformId},
      await getUser(req)
    )).data;
    await Promise.all(
      lists.map(async list => {
        list.tmpEntries = (await objectStore.find(
          {
            type: 'list-entry',
            key: list._id,
            owner: list._public ? undefined : req.user.openplatformId
          },
          await getUser(req)
        )).data;
      })
    );

    listState = listReducer(listState, {type: LISTS_EXPAND, lists});
  }
  return {
    userReducer: userState,
    listReducer: listState
  };
}

router.route('/').get(async (req, res, next) => {
  try {
    const data = await initState(req);
    res.json({data});
  } catch (e) {
    res.status(500).json({
      error: 'Failed to fetch initial state'
    });
  }
});

module.exports = router;
