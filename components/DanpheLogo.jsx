'use strict';
const React = require('react');
const { renderDanpheLogo } = require('../lib/DanpheLogo');

const DanpheLogo = ({
    size = 120,
    animated = true,
    glow = true,
    showBadge = false,
    className = ''
}) => {
    const html = renderDanpheLogo({ size, animated, glow, showBadge, className });
    return <div className={`danphe-bird-root inline-block ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { DanpheLogo };
module.exports.default = DanpheLogo;
