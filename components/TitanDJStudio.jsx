import React from 'react';
import { renderTitanDJStudio } from '../lib/TitanDJStudio';

export function TitanDJStudio(props) {
    const html = renderTitanDJStudio(props);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default TitanDJStudio;
