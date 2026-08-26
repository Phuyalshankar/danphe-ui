'use strict';
const React = require('react');
const { renderTitan3DKnob } = require('../lib/Titan3DKnob');

const Titan3DKnob = (props) => {
    const html = renderTitan3DKnob(props);
    return <div className="titan-3d-knob-component" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { Titan3DKnob };
module.exports.default = Titan3DKnob;