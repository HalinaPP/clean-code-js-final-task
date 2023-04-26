const TableString = require('./table-string');

const VALID_COMMAND_PARAMETERS_NUMBER = 2;

module.exports = class Print {
    constructor(view, manager) {
        this.view = view;
        this.manager = manager;
    }

    canProcess(command) {
        return command.startsWith('print ');
    }

    process(input) {
        const tableName = this.getTableName(input);
        const tableData = this.manager.getTableData(tableName);

        const table = new TableString(tableData, tableName);

        this.view.write(table.getTableString());
    }

    getTableName(input) {
        const command = input.split(' ');
        this.validateCommandParametersAmount(command.length);

        return command[1];
    }

    validateCommandParametersAmount(parametersAmount) {
        if (parametersAmount !== VALID_COMMAND_PARAMETERS_NUMBER) {
            throw new TypeError('Incorrect number of parameters. Expected 1, got ' + (parametersAmount - 1));
        }
    }
};
