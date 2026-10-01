'use strict';

const React = require('react');
const { renderNepaliDateTag } = require('../lib/NepaliDate');

const NepaliDateTag = ({
    variant = 'pill',
    lang = 'np',
    live = true,
    className = ''
}) => {
    const html = renderNepaliDateTag({ variant, lang, live, className });
    return <span className={`nepali-date-tag-root inline-flex ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

module.exports = { NepaliDateTag };
module.exports.default = NepaliDateTag;
