const React = require('react');
const { renderTitanMobileDeviceFrame } = require('../lib/TitanMobileDeviceFrame');

const TitanMobileDeviceFrame = (props) => {
    const html = renderTitanMobileDeviceFrame(props);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanMobileDeviceFrame };
module.exports.default = TitanMobileDeviceFrame;
