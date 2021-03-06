"use strict";

const int_2_col_str = require('./int_2_col_str.js');
const col_str_2_int = require('./col_str_2_int.js');
const RawValue = require('./raw_value.js');
const Range = require('./range.js');
const RefValue = require('./ref_value.js');

function raw_offset(cell_ref, rows, columns, height, width) {
    height = (height || new RawValue(1)).calc();
    width = (width || new RawValue(1)).calc();
    if (cell_ref.args.length === 1 && cell_ref.args[0].name === 'RefValue') {
        var ref_value = cell_ref.args[0];
        var parsed_ref = ref_value.parseRef();
        var col = col_str_2_int(parsed_ref.cell_name) + columns.calc();
        var col_str = int_2_col_str(col);
        var row = +parsed_ref.cell_name.replace(/^[A-Z]+/g, '') + rows.calc();
        var cell_name = col_str + row;
        if (height === 1 && width === 1) {
            return new RefValue(cell_name, ref_value.formula).calc();
        }
        else {
            var end_range_col = int_2_col_str(col + width - 1);
            var end_range_row = row + height - 1;
            var end_range = end_range_col + end_range_row;
            var str_expression = parsed_ref.sheet_name + '!' + cell_name + ':' + end_range;
            return new Range(str_expression, ref_value.formula).calc();
        }
    }
}

module.exports = {
    'OFFSET': raw_offset
};
