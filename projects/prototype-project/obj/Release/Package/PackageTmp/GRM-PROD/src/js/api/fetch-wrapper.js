import fetchPonyfill from 'fetch-ponyfill';
import { isArray } from 'lodash';

const { fetch } = fetchPonyfill();

function checkStatus(response) {
  if (response.status >= 200 && response.status < 400) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  if (response._bodyBlob && response._bodyBlob.size === 0) {
    return undefined;
  }
  return response.json();
}

function getQueryString(url, data) {
  if (!data) {
    return '';
  }
  const esc = encodeURIComponent;
  const query = Object.keys(data)
    .map((k) => {
      if (k && isArray(data[k]) && data[k].length > 0) {
        return data[k].map((id) => `${ esc(k) }=${ esc(id) }`).join('&');
      }

      return `${ esc(k) }=${ esc(data[k]) }`;
    })
    .join('&');
  const querySymbol = url.indexOf('?') >= 0 ? '&' : '?';
  return query ? `${ querySymbol }${ query }` : '';
}

export function fetchData({ url, locale, accessToken }, fetchOptions) {
  const options = fetchOptions || {};
  const method = options.method || 'GET';
  let body;
  const headers = options.headers || {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-LANGUAGE': locale,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${ accessToken }`;
  }

  const fetchUrl = `${ url }${ getQueryString(url, options.data) }`;
  if (['POST', 'PUT'].indexOf(method) > -1) {
    body = JSON.stringify(options.body);
  }

  return fetch(fetchUrl, { method, headers, body })
    .then(checkStatus)
    .then(options.responseBlob ? response => response.blob() : parseJSON)
    .then(response => ({ response, options }))
    .catch((error) => {
      const status = error.response ? error.response.status : null;
      const message = error.message ? error.message : (error.response ? error.response.message : null);
      if (status === 400 || status === 403) {
        return parseJSON(error.response)
          .then(data => ({
            response: data,
            options,
            error: {
              message,
              status,
            },
          }));
      }

      return {
        error: {
          message,
          status,
        },
        options,
      };
    })

    ;
}
