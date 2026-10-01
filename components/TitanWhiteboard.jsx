'use strict';
const React = require('react');
const { renderTitanWhiteboard } = require('../lib/TitanWhiteboard');

const TitanWhiteboard = ({
    id = 'titan-whiteboard-app',
    title = 'Live SVG Vector Drawing Canvas',
    subtitle = 'Sub-Pixel Bézier Smoothing • Touch, Stylus & Mouse Vector Engine',
    width = 800,
    height = 360,
    className = ''
}) => {
    const html = renderTitanWhiteboard({ id, title, subtitle, width, height, className });
    return <div className={`titan-whiteboard-wrapper ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanWhiteboard };
module.exports.default = TitanWhiteboard;
