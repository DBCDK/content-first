import {
  REQUEST_USER,
  RECEIVE_USER,
  usersReducer,
  usersMiddleware
} from '../users';
import Immutable from 'immutable';

const request = require('superagent');

describe('users', () => {
  describe('reducer', () => {
    it('REQUEST_USER action sets loading', () => {
      expect(
        usersReducer(new Immutable.Map(), {type: REQUEST_USER, id: 'userId'})
      ).toEqual(Immutable.fromJS({userId: {loading: true}}));
    });
    it('REQUEST_USER action does nothing if already loading/loaded', () => {
      const state = Immutable.fromJS({userId: true});
      expect(usersReducer(state, {type: REQUEST_USER, id: 'userId'})).toEqual(
        state
      );
    });
    it('RECEIVE_USER sets user', () => {
      expect(
        usersReducer(Immutable.fromJS({userId: {loading: true}}), {
          type: RECEIVE_USER,
          id: 'userId',
          user: {some: 'user'}
        })
      ).toEqual(Immutable.fromJS({userId: {some: 'user'}}));
    });
  });
  describe('middleware', () => {
    // Restore mocked functions
    const requestGet = request.get;
    afterEach(() => {
      request.get = requestGet;
    });

    it('fetches user', async () => {
      // Mock
      let dispatched;
      const promise = new Promise(resolve => {
        dispatched = resolve;
      });
      const storeMock = {
        getState: () => ({users: Immutable.fromJS({})}),
        dispatch: action => {
          expect(action).toEqual({
            id: 'user/id',
            type: RECEIVE_USER,
            user: 'some user object'
          });
          dispatched();
        }
      };
      request.get = async function requestMock(url) {
        expect(url).toEqual('/v1/user/user%2Fid');
        return {body: {data: 'some user object'}};
      };

      usersMiddleware(storeMock)(() => {})({type: REQUEST_USER, id: 'user/id'});

      await promise;
    });
  });
});
