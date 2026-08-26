'use strict';

const React = require('react');
const { renderTitanButtonGroup } = require('../lib/TitanButtonGroup');

const TitanButtonGroup = (props) => {
    const html = renderTitanButtonGroup(props);
    return <div className="titan-button-group-root inline-block" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanButtonGroup };
module.exports.default = TitanButtonGroup;
