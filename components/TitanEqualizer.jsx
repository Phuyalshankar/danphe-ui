import React from 'react';
import { renderTitanEqualizer } from '../lib/TitanEqualizer';

export function TitanEqualizer(props) {
    const html = renderTitanEqualizer(props);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default TitanEqualizer;
