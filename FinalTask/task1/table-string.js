const os = require('os');

const END_LINE = os.EOL;
const PAD_COLUMN_SYMBOL = ' ';
const BORDER_MIDDLE_SYMBOL = '═';
const BORDER_SIDE_SYMBOL = '║';
const BORDER_SYMBOLS = { top: { left: '╔', middle: '╦', right: '╗' }, middle: { left: '╠', middle: '╬', right: '╣' }, bottom: { left: '╚', middle: '╩', right: '╝' } };

module.exports = class TableString {

    constructor(data, tableName) {
        this.dataSets = data;
        this.tableName = tableName;
        this.maxColumnSize = this.getMaxColumnSize();
        this.columnCount = this.getColumnCount();
        this.columnSize = this.getColumnSize();
    }

    getTableString() {
        if (this.maxColumnSize === 0) {
            return this.getEmptyTable();
        }

        return this.getTableWithData();
    }

    getEmptyTable() {
        const emptyTableMessage = ` Table "${this.tableName}" is empty or does not exist `;

        const borderTop = BORDER_SYMBOLS.top.left + this.getLineColumnBorder(emptyTableMessage.length) + BORDER_SYMBOLS.top.right + END_LINE;
        const textEmptyTable = BORDER_SIDE_SYMBOL + emptyTableMessage + BORDER_SIDE_SYMBOL + END_LINE;
        const borderBottom = BORDER_SYMBOLS.bottom.left + this.getLineColumnBorder(emptyTableMessage.length) + BORDER_SYMBOLS.bottom.right + END_LINE;

        return borderTop + textEmptyTable + borderBottom;
    }


    getTableWithData() {
        return this.getStringTableHeader() + this.getStringTableData();
    }

    getLineColumnBorder(columnSize) {
        return BORDER_MIDDLE_SYMBOL.repeat(columnSize);
    }

    getTopBorder() {
        return this.getBorder(BORDER_SYMBOLS.top);
    }

    getMiddleBorder() {
        return this.getBorder(BORDER_SYMBOLS.middle);
    }

    getBottomBorder() {
        return this.getBorder(BORDER_SYMBOLS.bottom);
    }

    getBorder(borderSymbols) {
        return borderSymbols.left + this.getCellsBorder(borderSymbols.middle) + borderSymbols.right + END_LINE;
    }

    getCellsBorder(cellDivider) {
        const cellBorder = this.getLineColumnBorder(this.columnSize) + cellDivider;
        return cellBorder.repeat(this.columnCount - 1) + this.getLineColumnBorder(this.columnSize);
    }

    getMaxElementLength(elements) {
        const elementsLength = elements.map(element => element.toString().length)
        return Math.max(...elementsLength);
    }

    getMaxHeaderColumnSize() {
        const columnNames = this.dataSets[0].getColumnNames();
        return this.getMaxElementLength(columnNames);
    }

    getMaxDataColumnSize() {
        return this.dataSets.reduce((maxDataColumnSize, dataSetRow) => {
            const dataSetRowValue = dataSetRow.getValues();
            const maxElementsLengthInRow = this.getMaxElementLength(dataSetRowValue);

            return Math.max(maxDataColumnSize, maxElementsLengthInRow);
        }, 0);
    }

    getMaxColumnSize() {
        let maxColumnSize = 0;

        if (this.dataSets.length > 0) {
            const maxHeaderColumnSize = this.getMaxHeaderColumnSize();
            const maxDataColumnSize = this.getMaxDataColumnSize();

            return Math.max(maxHeaderColumnSize, maxDataColumnSize)
        }

        return maxColumnSize;
    }

    getColumnCount() {
        return this.dataSets.length > 0 ? this.dataSets[0].getColumnNames().length : 0;
    }

    getColumnSize() {
        let columnSize = this.maxColumnSize + 2;

        if (this.isEven(columnSize)) {
            columnSize += 1;
        }

        return columnSize;
    }

    isEven(number) {
        return number % 2 !== 0;
    }

    getRowInfo(values) {
        const rowInfo = values.reduce((row, column) => {
            const columnValue = column.toString();

            const columnInfo = this.getColumnInfo(columnValue)
            return row + `${BORDER_SIDE_SYMBOL}${columnInfo}`;
        }, '');

        return rowInfo + BORDER_SIDE_SYMBOL + END_LINE;
    }

    getColumnInfo(columnValue) {
        const columnLength = columnValue.length;
        const columnInfoLeftPad = this.getColumInfoPad(columnLength);
        const columnInfoRightPad = this.getColumInfoPad(columnLength - 1);

        return `${columnInfoLeftPad}${columnValue}${columnInfoRightPad}`;

    }
    getColumInfoPad(columnLength) {
        const padLength = Math.trunc((this.columnSize - columnLength) / 2)
        return PAD_COLUMN_SYMBOL.repeat(padLength);
    }

    getStringTableHeader() {
        const columnNames = this.dataSets[0].getColumnNames();

        const topHeaderBorder = this.getTopBorder();
        const headerColumnInfo = this.getRowInfo(columnNames);
        const bottomHeaderBorder = this.getMiddleBorder();

        return topHeaderBorder + headerColumnInfo + bottomHeaderBorder;
    }

    getStringTableData() {
        return this.getTableData() + this.getBottomBorder()
    }

    getTableData() {
        return this.dataSets.reduce((tableData, dataSet, index) => {
            const values = dataSet.getValues();

            tableData += this.getRowInfo(dataSet.getValues());

            if (this.isLastRow(index)) {
                tableData += this.getMiddleBorder();
            }

            return tableData;
        }, '');
    }

    isLastRow(rowIndex){
        const rowAmount = this.dataSets.length;
        return rowIndex < rowAmount - 1
    }
}
