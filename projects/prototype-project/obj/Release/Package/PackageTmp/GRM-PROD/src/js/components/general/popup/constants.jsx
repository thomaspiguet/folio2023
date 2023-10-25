import { defineMessages } from 'react-intl';

export const PopupStyle = {
  warning: 'warning',
  error: 'error',
  info: 'info',
  confirm: 'confirm',
};
export const PopupActionKind = {
  cancel: 'cancel',
  continue: 'continue',
  yes: 'yes',
  no: 'no',
  ok: 'ok',
  close: 'close',
};
export const PopupType = {
  dialog: 'dialog',
  spinner: 'spinner',
};

defineMessages({
  warning: {
    id: 'popup.header-warning',
    defaultMessage: 'Warning!',
  },
  error: {
    id: 'popup.header-error',
    defaultMessage: 'Error!',
  },
  info: {
    id: 'popup.header-info',
    defaultMessage: 'Information!',
  },
  confirm: {
    id: 'popup.header-confirm',
    defaultMessage: 'Confirm',
  },
  continue: {
    id: 'popup.action-continue',
    defaultMessage: 'Continue',
  },
  cancel: {
    id: 'popup.action-cancel',
    defaultMessage: 'Cancel',
  },
  close: {
    id: 'popup.action-close',
    defaultMessage: 'Close',
  },
  yes: {
    id: 'popup.action-yes',
    defaultMessage: 'Yes',
  },
  no: {
    id: 'popup.action-no',
    defaultMessage: 'No',
  },
  ok: {
    id: 'popup.action-ok',
    defaultMessage: 'OK',
  },
  delete: {
    id: 'popup.action-delete',
    defaultMessage: 'Delete',
  },
});
