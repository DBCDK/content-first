/* eslint-disable no-undefined */

'use strict';

const config = require('server/config');

import listReducer, {LISTS_EXPAND} from '../client/redux/list.reducer';
import userReducer, {
  ON_USER_DETAILS_RESPONSE
} from '../client/redux/user.reducer';
import interactionReducer, {
  FETCH_INTERACTIONS_SUCCESS
} from '../client/redux/interaction.reducer';
import rolesReducer, {ROLES_RESPONSE} from '../client/redux/roles.reducer';
import orderReducer, {PREVIOUSLY_ORDERED} from '../client/redux/order.reducer';
import beltsReducer, {BELTS_LOAD_RESPONSE} from '../client/redux/belts.reducer';
import kioskReducer, {KIOSK_RESPONSE} from '../client/redux/kiosk.reducer';
import StorageClient from '../shared/server-side-storage.client';
import ListRequester from '../shared/list.requester';
import BeltsRequester from '../shared/belts.requester';

const {getUser, getUserData} = require('server/user');
const objectStore = require('server/objectStore');

const libraries = require('server/external-v1-libraries');

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
  let rolesState = rolesReducer(undefined, {});
  let kioskState = kioskReducer(undefined, {
    type: KIOSK_RESPONSE,
    response: {...config.kiosk}
  });

  let lookupUrl = null;
  let isPremium = false;
  let municipalityAgencyId = null;

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

    // Get user library info from USER_PRIVAT info obj
    const userLibraries = (await storageClient.find({
      type: 'USER_PRIVAT',
      owner: req.user.openplatformId
    })).data;

    // check if user has premium access

    if (userLibraries.length > 0 && userLibraries[0].municipalityAgencyId) {
      municipalityAgencyId = userLibraries[0].municipalityAgencyId;
      isPremium = await libraries.userHasAPayingLibrary(
        userLibraries[0].municipalityAgencyId
      );
    }

    if (municipalityAgencyId) {
      lookupUrl = await libraries.getLibraryLookupUrl(
        municipalityAgencyId,
        req.user.openplatformToken
      );
    }

    // Test cases ----------
    if (req.user.isPremium) {
      isPremium = req.user.isPremium;
    }

    if (req.user.municipalityAgencyId) {
      municipalityAgencyId = req.user.municipalityAgencyId;
    }

    if (req.user.lookupUrl) {
      lookupUrl = req.user.lookupUrl;
    }
    // ---------- ------------
  }

  const roles = (await objectStore.getAllRoles()).data;
  rolesState = rolesReducer(rolesState, {type: ROLES_RESPONSE, roles});

  const editorBelts = await beltsRequester.fetchOwnedBelts(
    rolesState.contentFirstEditor._id
  );
  beltsState = beltsReducer(beltsState, {
    type: BELTS_LOAD_RESPONSE,
    belts: editorBelts
  });

  return {
    userReducer: {...userState, isPremium, municipalityAgencyId, lookupUrl},
    listReducer: listState,
    beltsReducer: beltsState,
    interactionReducer: interactionState,
    orderReducer: orderState,
    roles: rolesState,
    kiosk: kioskState
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
