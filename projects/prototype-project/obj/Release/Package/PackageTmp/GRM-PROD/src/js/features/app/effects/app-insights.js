import { take } from 'redux-saga/effects';
import { AppInsights } from 'applicationinsights-js';

import { GET_CONFIG_SUCCESS } from '../actions';

const isProduction = process.env.NODE_ENV === 'production';

export function* startAppInsights() {
  while (true) {
    const action = yield take(GET_CONFIG_SUCCESS);
    const { appInsightsInstrumentationKey } = action.payload;

    const appInsightsOptions = {
      // The key of your Application Insights resource in Azure
      instrumentationKey: appInsightsInstrumentationKey,
      disableAjaxTracking: true,
      isCookieUseDisabled: true,
      isBrowserLinkTrackingEnabled: false,
      samplingPercentage: 50,
    };
    if (!isProduction) {
      // For development mode only, data is sent immediately and not batched
      appInsightsOptions.enableDebug = true;
    }

    // Download full ApplicationInsights script from CDN and initialize it
    try {
      AppInsights.downloadAndSetup(appInsightsOptions);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  }
}
