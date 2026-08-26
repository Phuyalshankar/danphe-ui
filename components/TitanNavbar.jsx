'use strict';

const React = require('react');
const { renderTitanNavbar } = require('../lib/TitanNavbar');

const TitanNavbar = (props) => {
    const html = renderTitanNavbar(props);
    return <div className="titan-navbar-root w-full" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanNavbar };
module.exports.default = TitanNavbar;
