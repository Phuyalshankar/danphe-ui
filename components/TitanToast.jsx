'use strict';
const React = require('react');
const { renderMasterCard } = require('../lib/TitanMasterCard');

const TitanToast = ({
    isOpen = true,
    title = 'Notification',
    message = '',
    type = 'success',
    position = 'top-right'
}) => {
    if (!isOpen) return null;
    const html = renderMasterCard({
        toast: true,
        isOpen: true,
        title,
        subtitle: message,
        position,
        badge: type.toUpperCase()
    });
    return <div className="titan-toast-root" dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { TitanToast };
module.exports.default = TitanToast;
