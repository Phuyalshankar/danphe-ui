'use strict';
const React = require('react');
const { renderTitanSvgAnimationCard } = require('../lib/TitanSvgAnimationCard');

const TitanSvgAnimationCard = (props) => {
    const html = renderTitanSvgAnimationCard(props);
    return <div className="titan-svg-animation-card-component" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanSvgAnimationCard };
module.exports.default = TitanSvgAnimationCard;
