'use strict';
const React = require('react');
const { renderMasterCard } = require('../lib/TitanMasterCard');

const TitanModal = ({
    isOpen = true,
    title = 'Modal Dialog',
    subtitle = '',
    icon = 192,
    children = null,
    onClose = null,
    onConfirm = null,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false
}) => {
    if (!isOpen) return null;
    const html = renderMasterCard({
        modal: true,
        isOpen: true,
        title,
        subtitle,
        icon,
        body: children ? '<div class="custom-modal-slot">' + children + '</div>' : ''
    });
    return <div className="titan-modal-root" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanModal };
module.exports.default = TitanModal;
