import React from 'react';
import { renderTitanAnimationStudio } from '../animation/TitanAnimationStudio';

export function TitanAnimationStudio(props) {
    const html = renderTitanAnimationStudio(props);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default TitanAnimationStudio;
