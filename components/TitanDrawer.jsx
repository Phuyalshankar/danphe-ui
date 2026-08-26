'use strict';
const React = require('react');
const { renderTitanDrawer } = require('../lib/TitanDrawer');

const TitanDrawer = ({
    isOpen = false,
    title = 'Drawer',
    subtitle = '',
    position = 'right',
    children = null,
    onClose = null
}) => {
    const html = renderTitanDrawer({ isOpen, title, subtitle, position, content: children });
    return <div className="titan-drawer-root" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanDrawer };
module.exports.default = TitanDrawer;
