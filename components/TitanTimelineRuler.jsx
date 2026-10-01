import React from 'react';
import { renderTimelineRuler } from '../lib/TitanTimelineRuler';

export function TitanTimelineRuler(props) {
    const html = renderTimelineRuler(props);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
export default TitanTimelineRuler;
