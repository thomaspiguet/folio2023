import '../../../test/mock-appinsight';
import { call, put, fork, takeEvery } from 'redux-saga/effects';
import assert from 'assert';

import {
  rootSaga,
  watchRequests,
  authenticationSaga,
  organizationsSaga,
  getConfiguration,
  getAccessToken,
  getOrganizations,
} from './sagas';
import { fetchData } from '../../../api/fetch-wrapper';

import {
  GET_CONFIG_SUCCESS,
  GET_CONFIG_FAILURE,
  GET_TOKEN_SUCCESS,
  GET_TOKEN_FAILURE,
  LOAD_DATA_STARTED,
  LOAD_DATA_ENDED,
} from '../actions';

import {
  GET_ORGANIZATIONS_REQUEST,
  GET_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATIONS_FAILURE,
} from '../../scenario/actions/scenario';

import {
  CONFIG_ENDPOINT,
  REDIRECT_ENDPOINT,
  ORGANIZATIONS_ENDPOINT,
} from '../../../api/endpoints';

xdescribe('getOrganizationsSaga', () => {
  const orgs = [{
    internalCode: 'InternalCode1',
    code: 'Organization1',
    abbreviation: null,
    shortDescription: 'ShortDescription1',
    longDescription: 'LongDescription1',
    id: 3,
  }, {
    internalCode: 'InternalCode2',
    code: 'Organization2',
    abbreviation: null,
    shortDescription: 'ShortDescription2',
    longDescription: 'LongDescription2',
    id: 4,
  }];

  it('should fetch organizations', () => {
    const iterator = getOrganizations();

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_STARTED, payload: ORGANIZATIONS_ENDPOINT }),
      'putting LOAD_DATA_STARTED action'
    );

    assert.deepEqual(
      iterator.next().value,
      call(fetchData, ORGANIZATIONS_ENDPOINT),
      'waiting for fetched organizations'
    );

    assert.deepEqual(
      iterator.next({ response: orgs }).value,
      put({ type: GET_ORGANIZATIONS_SUCCESS, organizations: orgs }),
      'putting GET_ORGANIZATIONS_SUCCESS action'
    );

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_ENDED, payload: ORGANIZATIONS_ENDPOINT }),
      'putting LOAD_DATA_ENDED action'
    );
  });

  it('should fail to fetch organizations', () => {
    const iterator = getOrganizations();

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_STARTED, payload: ORGANIZATIONS_ENDPOINT }),
      'putting LOAD_DATA_STARTED action'
    );

    assert.deepEqual(
      iterator.next().value,
      call(fetchData, '/organizations'),
      'waiting for fetched organizations'
    );

    const error = new Error('network error');

    assert.deepEqual(
      iterator.next({ error }).value,
      put({ type: GET_ORGANIZATIONS_FAILURE, error }),
      'putting GET_ORGANIZATIONS_FAILURE action'
    );

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_ENDED, payload: ORGANIZATIONS_ENDPOINT }),
      'putting LOAD_DATA_ENDED action'
    );
  });
});


xdescribe('getConfiguration', () => {
  const config = {
    coreUrl: 'localhost:8235',
  };

  it('should fetch configuration', () => {
    const iterator = getConfiguration();

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_STARTED, payload: CONFIG_ENDPOINT }),
      'putting LOAD_DATA_STARTED action'
    );

    assert.deepEqual(
      iterator.next().value,
      call(fetchData, CONFIG_ENDPOINT),
      'waiting for fetched configuration'
    );

    assert.deepEqual(
      iterator.next({ response: config }).value,
      put({ type: GET_CONFIG_SUCCESS, payload: config }),
      'putting GET_CONFIG_SUCCESS action'
    );

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_ENDED, payload: CONFIG_ENDPOINT }),
      'putting LOAD_DATA_ENDED action'
    );
  });

  it('should fail to fetch configuration', () => {
    const iterator = getConfiguration();

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_STARTED, payload: CONFIG_ENDPOINT }),
      'putting LOAD_DATA_STARTED action'
    );

    assert.deepEqual(
      iterator.next().value,
      call(fetchData, CONFIG_ENDPOINT),
      'waiting for fetched configuration'
    );

    const error = new Error('network error');

    assert.deepEqual(
      iterator.next({ error }).value,
      put({ type: GET_CONFIG_FAILURE, error }),
      'putting GET_CONFIG_FAILURE action'
    );

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_ENDED, payload: CONFIG_ENDPOINT }),
      'putting LOAD_DATA_ENDED action'
    );
  });
});

xdescribe('getAccessToken', () => {
  const config = {
    coreUrl: 'localhost:8235',
  };

  it('should fetch configuration', () => {
    const iterator = getAccessToken();

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_STARTED, payload: REDIRECT_ENDPOINT }),
      'putting LOAD_DATA_STARTED action'
    );

    assert.deepEqual(
      iterator.next().value,
      call(fetchData, REDIRECT_ENDPOINT),
      'waiting for fetched access_token'
    );

    assert.deepEqual(
      iterator.next({ response: config }).value,
      put({ type: GET_TOKEN_SUCCESS, payload: config }),
      'putting GET_TOKEN_SUCCESS action'
    );

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_ENDED, payload: REDIRECT_ENDPOINT }),
      'putting LOAD_DATA_ENDED action'
    );
  });

  it('should fail to fetch configuration', () => {
    const iterator = getAccessToken();

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_STARTED, payload: REDIRECT_ENDPOINT }),
      'putting LOAD_DATA_STARTED action'
    );

    assert.deepEqual(
      iterator.next().value,
      call(fetchData, REDIRECT_ENDPOINT),
      'waiting for fetched access_token'
    );

    const error = new Error('network error');

    assert.deepEqual(
      iterator.next({ error }).value,
      put({ type: GET_TOKEN_FAILURE, error }),
      'putting GET_TOKEN_FAILURE action'
    );

    assert.deepEqual(
      iterator.next().value,
      put({ type: LOAD_DATA_ENDED, payload: REDIRECT_ENDPOINT }),
      'putting LOAD_DATA_ENDED action'
    );
  });
});

xdescribe('authenticationSaga', () => {
  it('should fetch configuration and access_token', () => {
    const iterator = authenticationSaga();

    assert.deepEqual(
      iterator.next().value,
      call(getConfiguration),
      'calling getConfiguration'
    );

    assert.deepEqual(
      iterator.next().value,
      call(getAccessToken),
      'calling getAccessToken'
    );
  });
});

xdescribe('organizationsSaga', () => {
  it('should create root saga', () => {
    const iterator = organizationsSaga();

    assert.deepEqual(
      iterator.next().value,
      takeEvery(GET_ORGANIZATIONS_REQUEST, getOrganizations),
      'fetch config and access_token'
    );
  });
});

xdescribe('rootSaga', () => {
  it('should create root saga', () => {
    const iterator = rootSaga();

    assert.deepEqual(
      iterator.next().value,
      fork(watchRequests),
      'fork watcher for fetch requests'
    );

    assert.deepEqual(
      iterator.next().value,
      fork(authenticationSaga),
      'fetch config and access_token'
    );
  });
});

// describe('getAccessToken', () => {
//   it('', () => {
//
//   });
// });
