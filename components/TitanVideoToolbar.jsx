import React from 'react';
import { renderVideoToolbar, VIDEO_TOOLS } from '../lib/TitanVideoToolbar';
import { renderAdaptiveIconSVG } from '../lib/TitanAdaptiveIcon';

export function TitanVideoToolbar(props) {
    const html = renderVideoToolbar(props);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function TitanVideoIcon({ name, size = 24, className = '' }) {
    const html = renderAdaptiveIconSVG(name, 0, size);
    return <span dangerouslySetInnerHTML={{ __html: html }} style={{ display: 'inline-flex', alignItems: 'center' }} />;
}

export { VIDEO_TOOLS };
export default TitanVideoToolbar;
