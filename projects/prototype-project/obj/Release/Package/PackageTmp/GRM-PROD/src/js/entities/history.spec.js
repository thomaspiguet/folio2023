import { isEditableHistoryCell, canRemoveHistory, processingTypes } from './history';

describe('history entity', () => {
  const entry = {
    financialYearGroup: {
      description: undefined,
      valueType: undefined,
    }
  };

  it('should return true if column is editable and false if not where processingType = Adjustment', () => {
    const row = {
      processingType: 'Adjustment',
    };

    const columns = [
      {
        id: 'date',
        editable: false,
      },
      {
        id: 'processingType',
        editable: false,
      },
      {
        id: 'description',
        editable: true,
      },
      {
        id: 'rateAmount',
        editable: false,
      },
      {
        id: 'adjustedAmount',
        editable: true,
      },
      {
        id: 'totalAmount',
        editable: false,
      }
    ];

    columns.forEach((column) => {
      expect(isEditableHistoryCell(entry, row, column.id)).toBe(column.editable);
    });
  });

  it('should return true if column is editable and false if not where processingType = Creation', () => {
    const row = {
      processingType: 'Creation',
    };

    const columns = [
      {
        id: 'date',
        editable: false,
      },
      {
        id: 'processingType',
        editable: false,
      },
      {
        id: 'description',
        editable: true,
      },
      {
        id: 'rateAmount',
        editable: false,
      },
      {
        id: 'adjustedAmount',
        editable: false,
      },
      {
        id: 'totalAmount',
        editable: true,
      }
    ];

    columns.forEach((column) => {
      expect(isEditableHistoryCell(entry, row, column.id)).toBe(column.editable);
    });
  });

  it('should return true if column is editable and false if not where processingType = Correction', () => {
    const row = {
      processingType: 'Correction',
    };

    const columns = [
      {
        id: 'date',
        editable: false,
      },
      {
        id: 'processingType',
        editable: false,
      },
      {
        id: 'description',
        editable: true,
      },
      {
        id: 'rateAmount',
        editable: false,
      },
      {
        id: 'adjustedAmount',
        editable: false,
      },
      {
        id: 'totalAmount',
        editable: true,
      }
    ];

    columns.forEach((column) => {
      expect(isEditableHistoryCell(entry, row, column.id)).toBe(column.editable);
    });
  });

  it('should return true if history type can be deleted and false if can not', () => {
    const histories =[
      {
        processingType: 'Creation',
      },
      {
        processingType: 'Adjustment',
      },
      {
        processingType: 'Correction',
      },
      {
        processingType: 'Modification',
      },
      {
        processingType: 'Indexation',
      },
      {
        processingType: 'BatchIndexation',
      },
      {
        processingType: 'Import',
      },
      {
        processingType: 'BudgetEqualsActual',
      },
    ];
    histories.forEach((history) => {
      var type = processingTypes.find(function (tp){
        return tp.id === history.processingType;
     });
      expect(canRemoveHistory(history)).toBe(type.canBeDeleted);
    });
  });

  it('should return true if column is editable and false if not where processingType = Indexation', () => {
    const row = {
      processingType: 'Indexation',
    };

    const columns = [
      {
        id: 'date',
        editable: false,
      },
      {
        id: 'processingType',
        editable: false,
      },
      {
        id: 'description',
        editable: true,
      },
      {
        id: 'rateAmount',
        editable: true,
      },
      {
        id: 'adjustedAmount',
        editable: false,
      },
      {
        id: 'totalAmount',
        editable: false,
      }
    ];

    columns.forEach((column) => {
      expect(isEditableHistoryCell(entry, row, column.id)).toBe(column.editable);
    });
  });

  it('should return true if column is editable and false if not where processingType = BatchIndexation', () => {
    const row = {
      processingType: 'BatchIndexation',
    };

    const columns = [
      {
        id: 'date',
        editable: false,
      },
      {
        id: 'processingType',
        editable: false,
      },
      {
        id: 'description',
        editable: true,
      },
      {
        id: 'rateAmount',
        editable: true,
      },
      {
        id: 'adjustedAmount',
        editable: false,
      },
      {
        id: 'totalAmount',
        editable: false,
      }
    ];

    columns.forEach((column) => {
      expect(isEditableHistoryCell(entry, row, column.id)).toBe(column.editable);
    });
  });

});
