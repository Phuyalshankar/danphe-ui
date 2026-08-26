'use strict';

const React = require('react');
const { renderTitanTable } = require('../lib/TitanTableSuite');

const TitanTable = (props) => {
    const html = renderTitanTable(props);
    return <div className="titan-table-root w-full" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanTable };
module.exports.default = TitanTable;
