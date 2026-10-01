'use strict';
const React = require('react');
const { renderTitanProgress } = require('../lib/TitanProgress');

const TitanProgress = ({
    value = 50,
    max = 100,
    variant = 'linear',
    color = 'cyan',
    label = '',
    showValue = true,
    className = ''
}) => {
    const html = renderTitanProgress({ value, max, variant, color, label, showValue, className });
    return <div className={`titan-progress-root ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanProgress };
module.exports.default = TitanProgress;
