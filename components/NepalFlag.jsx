'use strict';

const React = require('react');
const { renderNepalFlag } = require('../lib/NepalFlag');

const NepalFlag = ({
    width = 48,
    height = 58,
    animated = true,
    shadow = true,
    className = ''
}) => {
    const html = renderNepalFlag({ width, height, animated, shadow, className });
    return <span className={`nepal-flag-root inline-flex ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { NepalFlag };
module.exports.default = NepalFlag;
