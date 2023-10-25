import { get } from 'lodash';
import { autobind } from 'core-decorators';

import { PopupActionKind } from '../../components/general/popup/constants';

export default class ReadOnlyDeleteValidator {
  constructor(instance, options, intl, popupOpen) {
    this.instance = instance;
    this.intl = intl;
    this.popupOpen = popupOpen;
    this.options = options || {};
  }

  getErrors() {
  }

  getError() {
  }

  @autobind
  onDeleteRow(rowInfo) {
    const { index, onDeleteRow } = rowInfo;
    const rowData = get(this.instance, `props.${ this.options.path }`)[index];
    if (this.options.confirmDeleteRow) {
      this.popupOpen({
        style: 'warning',
        message: this.intl.formatMessage({ id: this.options.deletionRowConfirmMessage || 'form.confirm-delete' }),
        actions: [
          { kind: PopupActionKind.yes, func: onDeleteRow, arg: { ...rowData } },
          { kind: PopupActionKind.no },
        ],
      });
    } else {
      onDeleteRow({ ...rowData });
    }
  }

  isEditMode() {
    return !this.instance.props.editMode;
  }

}
