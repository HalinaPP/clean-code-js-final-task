const DataSet = require('./thirdparty/data-set');
const Print = require('./print');

const view = {
    data: '',
    write: text => view.data = text,
    read: () => view.data,
};
const manager = {
    tableData: new Map(),
    getTableData: tableName => manager.tableData.get(tableName) || [],
};

const command = new Print(view, manager);

manager.tableData.set('test', [
    //new DataSet([['id', 1], ['name', 'Steven Seagal'], ['password', '123456']]),
    //new DataSet([['id', 2], ['name', 'Eva Song'], ['password', '789456']]),
]);
command.process('print test');
