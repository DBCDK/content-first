/* eslint-disable no-undefined */

'use strict';

import listReducer, {LISTS_EXPAND} from '../client/redux/list.reducer';
import userReducer, {
  ON_USER_DETAILS_RESPONSE
} from '../client/redux/user.reducer';
import interactionReducer, {
  FETCH_INTERACTIONS_SUCCESS
} from '../client/redux/interaction.reducer';
import orderReducer, {PREVIOUSLY_ORDERED} from '../client/redux/order.reducer';
import beltsReducer, {BELTS_LOAD_RESPONSE} from '../client/redux/belts.reducer';
import StorageClient from '../shared/server-side-storage.client';
import ListRequester from '../shared/list.requester';
import BeltsRequester from '../shared/belts.requester';

const {getUser, getUserData} = require('server/user');
const objectStore = require('server/objectStore');

const express = require('express');
const router = express.Router({mergeParams: true});

/**
 *
 * @param {*} req
 */
async function initState(req) {
  const storageClient = new StorageClient({user: getUser(req), objectStore});
  const listRequester = new ListRequester({storageClient});
  const beltsRequester = new BeltsRequester({storageClient});

  let listState = listReducer(undefined, {});
  let userState = userReducer(undefined, {});
  let interactionState = interactionReducer(undefined, {});
  let orderState = orderReducer(undefined, {});
  let beltsState = beltsReducer(undefined, {});

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

    const lists = await listRequester.fetchOwnedLists(req.user.openplatformId);
    listState = listReducer(listState, {type: LISTS_EXPAND, lists});

    const belts = await beltsRequester.fetchOwnedBelts(req.user.openplatformId);
    beltsState = beltsReducer(beltsState, {type: BELTS_LOAD_RESPONSE, belts});

    const interactions = (await storageClient.find({
      type: 'INTERACTION',
      owner: req.user.openplatformId,
      limit: 20
    })).data;
    interactionState = interactionReducer(interactionState, {
      type: FETCH_INTERACTIONS_SUCCESS,
      interactions
    });

    const orders = (await storageClient.find({
      type: 'ORDER',
      owner: req.user.openplatformId,
      limit: 20
    })).data;
    orders.forEach(order => {
      orderState = orderReducer(orderState, {
        type: PREVIOUSLY_ORDERED,
        pid: order.pid
      });
    });
  }

  return {
    userReducer: userState,
    listReducer: listState,
    beltsReducer: beltsState,
    interactionReducer: interactionState,
    orderReducer: orderState
  };
}

router.route('/').get(async (req, res) => {
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
