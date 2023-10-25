import { isUndefined } from 'lodash';

export function getId({ id }) {
  return id;
}

export function invertThreeStateOption(opt) {
  return isUndefined(opt) ? undefined : !opt;
}
