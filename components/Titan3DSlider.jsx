'use strict';
const React = require('react');
const { renderTitan3DSlider } = require('../lib/Titan3DSlider');

const Titan3DSlider = (props) => {
    const html = renderTitan3DSlider(props);
    return <div className="titan-3d-slider-component" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { Titan3DSlider };
module.exports.default = Titan3DSlider;