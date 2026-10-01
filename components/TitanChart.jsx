'use strict';
const React = require('react');
const { renderTitanChart } = require('../lib/TitanChart');

const TitanChart = ({
    variant = 'area',
    title = '',
    subtitle = '',
    badge = '',
    data = [],
    labels = [],
    segments = [],
    color = 'cyan',
    showGrid = true,
    showDots = true,
    animated = true,
    className = ''
}) => {
    const html = renderTitanChart({
        variant,
        title,
        subtitle,
        badge,
        data,
        labels,
        segments,
        color,
        showGrid,
        showDots,
        animated,
        className
    });
    return <div className={`titan-chart-root ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanChart };
module.exports.default = TitanChart;
